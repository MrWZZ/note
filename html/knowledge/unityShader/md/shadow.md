### 使用引用需要添加的基本代码

```C++
Shader "Shader/Base_Shadow" {

	Properties
	{
		_MainTex("Texture", 2D) = "white" {}
	}

    SubShader {

        Tags { "LightMode"="ForwardBase" }

        Pass {

			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			
			#include "UnityCG.cginc"
			#include "AutoLight.cginc"
			#pragma multi_compile_fwdbase

			sampler2D _MainTex;
            float4 _MainTex_ST;

			struct appdata
			{
				float4 vertex : POSITION;
				float2 uv : TEXCOORD0;
			};

			struct v2f
			{
				float4 vertex : SV_POSITION;
				float2 uv : TEXCOORD0;
				SHADOW_COORDS(1)
			};

			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				TRANSFER_SHADOW(o);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				fixed3 col = tex2D(_MainTex, i.uv).rgb;
				//接受阴影
				fixed shadow = SHADOW_ATTENUATION(i);
				return fixed4(col * shadow,1.0);
			}

			ENDCG

        }

    }
    
    //投射阴影
	FallBack "VertexLit"
}
```

### 增加变量控制阴影强度

```C++ 
_Shadow ("shadow", Range(0,1)) = 1

fixed _Shadow;
	
fixed shadow = 1 - _Shadow + SHADOW_ATTENUATION(i) * _Shadow;
```

