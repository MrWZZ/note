### 渲染顺序

开启透明混合后，一个物体被渲染到屏幕上时，每个片元除了颜色值和深度值外，还有——透明度。透明度为1，则完全不透明，透明度为0，则完全不会显示。

在Unity中我们有两种方式实现透明度效果

- 透明度测试（Alpha Test）：这种方式无法得到真正的半透明效果。只是0或1（完全透明和完全不透明）
- 透明度混合（Alpha Blending）：使用当前的透明度作为混合因子，与已经存储在颜色缓冲中的颜色值进行混合。

那让我讨论第一个问题：渲染顺序

为什么先说渲染顺序呢？

在之前的两篇文章中，我并没有涉猎到渲染顺序。因为对于不透明的物体，渲染顺序的决定是由深度缓冲决定的。

深度缓冲的基本思想为：根据深度缓冲中的值来判断该片元距离摄像机的距离，当渲染一个片元时，需要把深度值和已经存在于深度缓冲中的值进行比较（前提：开启深度测试），如果它的值距离摄像机更远，说明该片元不应被渲染。

但是当我们使用透明度混合时，就得关闭深度写入（ZWrite）。

为什么关闭深度写入呢？

一个半透明的物体后面如果有物体的话，应该是可以被看到的，但是深度写入会把它剔除掉。

所以对于渲染顺序就得我们自行控制了。

方式一：透明物体在前，不透明物体在后。

- 情况一：如果先渲染不透明物体（开启深度写入和深度测试），将不透明物体颜色写入颜色缓存，深度写入深度缓冲，然后渲染透明物体（关闭深度写入，开启深度测试），将透明物体的颜色与颜色缓冲中的颜色混合，得到正确结果。
- 情况二：先渲染透明物体（关闭深度写入，开启深度测试），透明物体颜色写入颜色缓冲，然后渲染不透明物体（开启深度写入和深度测试），深度缓存中没有内容，所以直接覆盖颜色缓冲。得到错误结果。

方式二：两个透明物体。

- 情况一：先渲染后方的透明物体，颜色写入颜色缓冲，然后渲染前方透明物体，颜色和颜色缓冲中的颜色混合，得到正确结果。
- 情况二：先渲染前方的透明物体，颜色写入颜色缓冲，然后渲染后方透明物体，颜色和颜色缓冲中的颜色混合，得到后方物体在前方物体前的画面，得到错误结果。

基于这种情况Unity给我们一种解决方式（大多数引擎的解决方式）：物体排序+分割网格。

- 物体排序：1.先渲染所有不透明物体，并开启它们的深度测试和深度写入。2.把半透明物体按它们距离摄像机的远近进行排序，然后按照从后往前的顺序渲染半透明物体（开启深度测试，关闭深度写入）。
- 分割网格：解决物体排序遗留问题：循环重叠（例：3个物体互相重叠），我们把网格分割，分别判断分开后的网格的顺序来进行渲染。

### Unity Shader 的渲染队列

Unity提供了渲染队列（render queue）解决渲染顺序的问题。用SubShader的Queue标签来设置我们的模型在哪个渲染队列。索引越小越先渲染

Unity的5个渲染队列：

- Background：索引：1000，这个队列是最先渲染的。
- Geometry：索引：2000，默认渲染队列。不透明物体使用这个队列。
- Alpha Test：索引：2450，需要透明度测试的物体使用该队列。
- Transparent：索引：3000，按照从后往前的顺序渲染，使用透明度混合的物体都应该用该队列。
- Overlay：索引：4000，该队列用于实现一些叠加效果，最后渲染。

#### 透明度测试

只要一个片元的透明度不满足条件，那么这个片元就会被舍弃。用clip来进行透明度测试。

``` C++
Shader "My Shader/AlphaShader"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Texture", 2D) = "white" {}
        _Cutoff ("Alpha Cutoff", Range(0, 1)) = 0.5
    }
    SubShader
    {
        // 透明度测试队列为AlphaTest，所以Queue=AlphaTest
        // RenderType标签让Unity把这个Shader归入提前定义的组中，以指明该Shader是一个使用了透明度测试的Shader
        // IgonreProjector为True表明此Shader不受投影器（Projectors）影响
        Tags { "Queue"="AlphaTest" "IgnoreProjector"="True" "RenderType"="TransparentCutout" }

        Pass
        {
            Tags { "LightMode"="ForwardBase" }

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            
            #include "UnityCG.cginc"
            #include "Lighting.cginc"

            struct a2v
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 texcoord : TEXCOORD0;
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float2 uv : TEXCOORD0;
                float3 worldNormal : TEXCOORD1;
                float3 worldPos : TEXCOORD2;
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            fixed4 _Color;
            // 用于决定调用clip函数时进行的透明度测试使用的判断条件
            fixed _Cutoff;
            
            v2f vert (a2v v)
            {
                v2f o;

                o.pos = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
                o.worldNormal = UnityObjectToWorldNormal(v.normal);
                o.worldPos = mul(unity_ObjectToWorld, v.vertex);

                return o;
            }
            
            fixed4 frag (v2f i) : SV_Target
            {
                fixed3 worldNormal = normalize(i.worldNormal);
                fixed3 worldPos = normalize(i.worldPos);
                fixed3 worldLightDir = normalize(UnityWorldSpaceLightDir(worldPos));
                // 纹素值
                fixed4 texColor = tex2D(_MainTex, i.uv);
                // 原理
                // if ((texColor.a - _Cutoff) < 0.0) { discard; }
                // 如果结果小于0，将片元舍弃
                clip(texColor.a - _Cutoff);
                // 反射率
                fixed3 albedo =  texColor.rgb * _Color.rgb;
                // 环境光
                fixed3 ambient = UNITY_LIGHTMODEL_AMBIENT.rgb * albedo;
                // 漫反射
                fixed3 diffuse = _LightColor0.rgb * albedo * max(0, dot(worldNormal, worldLightDir));
                return fixed4(ambient + diffuse, 1.0);
            }
            ENDCG
        }
    }
}
```

#### 透明度混合

那我们看看Unity给我们提供的混合命令——Blend。给出Blend的常用语义。

- Blend Off：关闭混合
- Blend SrcFactor DstFactor：开启混合，设置混合因子。源颜色（片元颜色）乘以SrcFactor，目标颜色（已经在颜色缓冲中的颜色）乘以DstFactor，然后把两者相加
- Blend SrcFactor DstFactor，SrcFactorA DstFactorA：同上，不过把透明通道（a）与颜色通道（rgb）用不同的因子。
- BlendOp BlendOperation：使用BlendOperation对其进行其他操作，非简单相加混合。

混合公式：DstColorNew = SrcAlpha * SrcColor + (1 - SrcAlpha) * DstColorOld

```C++
Shader "My Shader/AlphaShader"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Texture", 2D) = "white" {}
        _AlphaScale ("Alpha Scale", Range(0, 1)) = 1
    }
    SubShader
    {
        // 透明度混合队列为Transparent，所以Queue=Transparent
        // RenderType标签让Unity把这个Shader归入提前定义的组中，以指明该Shader是一个使用了透明度混合的Shader
        // IgonreProjector为True表明此Shader不受投影器（Projectors）影响
        Tags { "Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent" }

        Pass
        {
            Tags { "LightMode"="ForwardBase" }
            
            // 关闭深度写入
            ZWrite Off
            // 开启混合模式，并设置混合因子为SrcAlpha和OneMinusSrcAlpha
            Blend SrcAlpha OneMinusSrcAlpha

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            
            #include "UnityCG.cginc"
            #include "Lighting.cginc"

            struct a2v
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 texcoord : TEXCOORD0;
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float2 uv : TEXCOORD0;
                float3 worldNormal : TEXCOORD1;
                float3 worldPos : TEXCOORD2;
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            fixed4 _Color;
            // 用于决定调用clip函数时进行的透明度测试使用的判断条件
            fixed _AlphaScale;
            
            v2f vert (a2v v)
            {
                v2f o;

                o.pos = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
                o.worldNormal = UnityObjectToWorldNormal(v.normal);
                o.worldPos = mul(unity_ObjectToWorld, v.vertex);

                return o;
            }
            
            fixed4 frag (v2f i) : SV_Target
            {
                fixed3 worldNormal = normalize(i.worldNormal);
                fixed3 worldPos = normalize(i.worldPos);
                fixed3 worldLightDir = normalize(UnityWorldSpaceLightDir(worldPos));
                // 纹素值
                fixed4 texColor = tex2D(_MainTex, i.uv);
                // 反射率
                fixed3 albedo =  texColor.rgb * _Color.rgb;
                // 环境光
                fixed3 ambient = UNITY_LIGHTMODEL_AMBIENT.rgb * albedo;
                // 漫反射
                fixed3 diffuse = _LightColor0.rgb * albedo * max(0, dot(worldNormal, worldLightDir));
                // 返回颜色，透明度部分乘以我们设定的值
                return fixed4(ambient + diffuse, texColor.a * _AlphaScale);
            }
            ENDCG
        }
    }
}
```

### 存在的问题

然而这种实现方式是有问题的。就像前面说的一样，它并不能渲染正确的顺序。

解决方式：用两个Pass来渲染模型

- 第一个Pass：开启深度写入，但不输出颜色，目的仅仅为了填充深度缓冲。
- 第二个Pass：正常的透明度混合，由于上一个Pass已经得到了逐像素的正确深度信息，该Pass就可以按照像素级别的深度排序进行透明渲染。
- 缺点：多了一个Pass性能有所影响。

``` c++
Shader "My Shader/AlphaShader"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Texture", 2D) = "white" {}
        _AlphaScale ("Alpha Scale", Range(0, 1)) = 1
    }
    SubShader
    {
        // 透明度混合队列为Transparent，所以Queue=Transparent
        // RenderType标签让Unity把这个Shader归入提前定义的组中，以指明该Shader是一个使用了透明度混合的Shader
        // IgonreProjector为True表明此Shader不受投影器（Projectors）影响
        Tags { "Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent" }

        Pass
        {
            // 开启深度写入
            ZWrite On
            // 设置颜色通道的写掩码，0为不写入任何颜色
            ColorMask 0
        }

        Pass
        {
            Tags { "LightMode"="ForwardBase" }
            
            // 关闭深度写入
            ZWrite Off
            // 开启混合模式，并设置混合因子为SrcAlpha和OneMinusSrcAlpha
            Blend SrcAlpha OneMinusSrcAlpha

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            
            #include "UnityCG.cginc"
            #include "Lighting.cginc"

            struct a2v
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 texcoord : TEXCOORD0;
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float2 uv : TEXCOORD0;
                float3 worldNormal : TEXCOORD1;
                float3 worldPos : TEXCOORD2;
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            fixed4 _Color;
            // 用于决定调用clip函数时进行的透明度测试使用的判断条件
            fixed _AlphaScale;
            
            v2f vert (a2v v)
            {
                v2f o;

                o.pos = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
                o.worldNormal = UnityObjectToWorldNormal(v.normal);
                o.worldPos = mul(unity_ObjectToWorld, v.vertex);

                return o;
            }
            
            fixed4 frag (v2f i) : SV_Target
            {
                fixed3 worldNormal = normalize(i.worldNormal);
                fixed3 worldPos = normalize(i.worldPos);
                fixed3 worldLightDir = normalize(UnityWorldSpaceLightDir(worldPos));
                // 纹素值
                fixed4 texColor = tex2D(_MainTex, i.uv);
                // 反射率
                fixed3 albedo =  texColor.rgb * _Color.rgb;
                // 环境光
                fixed3 ambient = UNITY_LIGHTMODEL_AMBIENT.rgb * albedo;
                // 漫反射
                fixed3 diffuse = _LightColor0.rgb * albedo * max(0, dot(worldNormal, worldLightDir));
                // 返回颜色，透明度部分乘以我们设定的值
                return fixed4(ambient + diffuse, texColor.a * _AlphaScale);
            }
            ENDCG
        }
    }
}
```

## 双面渲染的透明效果

对于刚才的立方体，虽然是透明的，但是却看不到里面的构造，是不是感觉也不太对，如果想看到内部构造怎么办呢？

Unity默认会剔除物体的背面（就是内部），那么我们可以用Cull指令来控制需要剔除哪个面的渲染图元。

- Cull Back：背对着摄像机的渲染图元不会渲染，默认情况。
- Cull Front：朝向摄像机的渲染图元不会渲染。
- Cull Off：关闭剔除功能，所有的都会渲染。缺点：需要渲染的数目成倍增加，除非用于特殊效果，建议不开启。



这回也是用两个Pass来完成：第一个Pass渲染背面，第二个Pass渲染前面

Shader 代码如下:

``` c++	
Shader "My Shader/AlphaShader"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Texture", 2D) = "white" {}
        _AlphaScale ("Alpha Scale", Range(0, 1)) = 1
    }
    SubShader
    {
        // 透明度混合队列为Transparent，所以Queue=Transparent
        // RenderType标签让Unity把这个Shader归入提前定义的组中，以指明该Shader是一个使用了透明度混合的Shader
        // IgonreProjector为True表明此Shader不受投影器（Projectors）影响
        Tags { "Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent" }

        Pass
        {
            Tags { "LightMode"="ForwardBase" }

            // 只渲染背面
            Cull Front
            // 关闭深度写入
            ZWrite Off
            // 开启混合模式，并设置混合因子为SrcAlpha和OneMinusSrcAlpha
            Blend SrcAlpha OneMinusSrcAlpha

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            
            #include "UnityCG.cginc"
            #include "Lighting.cginc"

            struct a2v
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 texcoord : TEXCOORD0;
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float2 uv : TEXCOORD0;
                float3 worldNormal : TEXCOORD1;
                float3 worldPos : TEXCOORD2;
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            fixed4 _Color;
            // 用于决定调用clip函数时进行的透明度测试使用的判断条件
            fixed _AlphaScale;
            
            v2f vert (a2v v)
            {
                v2f o;

                o.pos = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
                o.worldNormal = UnityObjectToWorldNormal(v.normal);
                o.worldPos = mul(unity_ObjectToWorld, v.vertex);

                return o;
            }
            
            fixed4 frag (v2f i) : SV_Target
            {
                fixed3 worldNormal = normalize(i.worldNormal);
                fixed3 worldPos = normalize(i.worldPos);
                fixed3 worldLightDir = normalize(UnityWorldSpaceLightDir(worldPos));
                // 纹素值
                fixed4 texColor = tex2D(_MainTex, i.uv);
                // 反射率
                fixed3 albedo =  texColor.rgb * _Color.rgb;
                // 环境光
                fixed3 ambient = UNITY_LIGHTMODEL_AMBIENT.rgb * albedo;
                // 漫反射
                fixed3 diffuse = _LightColor0.rgb * albedo * max(0, dot(worldNormal, worldLightDir));
                // 返回颜色，透明度部分乘以我们设定的值
                return fixed4(ambient + diffuse, texColor.a * _AlphaScale);
            }
            ENDCG
        }

        Pass
        {
            Tags { "LightMode"="ForwardBase" }
            
            // 只渲染前面
            Cull Back 
            // 关闭深度写入
            ZWrite Off
            // 开启混合模式，并设置混合因子为SrcAlpha和OneMinusSrcAlpha
            Blend SrcAlpha OneMinusSrcAlpha

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            
            #include "UnityCG.cginc"
            #include "Lighting.cginc"

            struct a2v
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 texcoord : TEXCOORD0;
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float2 uv : TEXCOORD0;
                float3 worldNormal : TEXCOORD1;
                float3 worldPos : TEXCOORD2;
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            fixed4 _Color;
            // 用于决定调用clip函数时进行的透明度测试使用的判断条件
            fixed _AlphaScale;
            
            v2f vert (a2v v)
            {
                v2f o;

                o.pos = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
                o.worldNormal = UnityObjectToWorldNormal(v.normal);
                o.worldPos = mul(unity_ObjectToWorld, v.vertex);

                return o;
            }
            
            fixed4 frag (v2f i) : SV_Target
            {
                fixed3 worldNormal = normalize(i.worldNormal);
                fixed3 worldPos = normalize(i.worldPos);
                fixed3 worldLightDir = normalize(UnityWorldSpaceLightDir(worldPos));
                // 纹素值
                fixed4 texColor = tex2D(_MainTex, i.uv);
                // 反射率
                fixed3 albedo =  texColor.rgb * _Color.rgb;
                // 环境光
                fixed3 ambient = UNITY_LIGHTMODEL_AMBIENT.rgb * albedo;
                // 漫反射
                fixed3 diffuse = _LightColor0.rgb * albedo * max(0, dot(worldNormal, worldLightDir));
                // 返回颜色，透明度部分乘以我们设定的值
                return fixed4(ambient + diffuse, texColor.a * _AlphaScale);
            }
            ENDCG
        }
    }
}
```



