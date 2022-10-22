### 基础光照

在顶点着色器中，如果要把模型空间下的法线转换到世界空间下，需要使用：

```c++
i.normal = UnityObjectToWorldNormal(v.normal);
```

这个方法能防止在片元方法中`normalize`时导致法线方向偏差。

使用光照模型，我们引用“*UnityStandardBRDF.cginc*”文件，可以方便我们对光照进行处理

![include-files-brdf](..\res\include-files-brdf.png)

使用`dot()`方法时，我们要想保证得出的值在0-1之间。可以使用`DotClamped()`。

`_WorldSpaceLightPos0.xyz`可以表示主要光源所在的位置。

`_LightColor0.rgb `表示主要光源的颜色。

unity在渲染光照时，有好几个渲染步骤。在渲染主要光线时，其步骤的名称为：`ForwardBase`。我们要对这个步骤进行处理，需要告知编译器，让其填充这个步骤数据。

```c++
Tags {
	"LightMode" = "ForwardBase"
}
```

当场景有多个光源时，我们至少需要两个Pass，一个为`ForwardBase`渲染主要光，另一个为`ForwardAdd`渲染额外的光。


一个物体被渲染，大体分为3个部分：环境光、漫反射、高光反射。

```c++
// 纹素
fixed3 albedo = tex2D(_MainTex,i.uv).rgb * _Tint.rgb;

// 环境光
fixed3 ambient = UNITY_LIGHTMODEL_AMBIENT.rgb * albedo;

// 漫反射
float3 lightDir = _WorldSpaceLightPos0.xyz;
float3 lightColor = _LightColor0.rgb;
fixed3 diffuse = albedo * lightColor * DotClamped(lightDir, i.normal);

// 高光反射
// 1.在v2f中增加
float3 worldPos : TEXCOORD0;
// 2.在顶点方法中赋值
o.worldPos = mul((float3x3)unity_ObjectToWorld,v.vertex);
// 3.在片元方法中处理
float3 viewDir = normalize(_WorldSpaceCameraPos - i.worldPos);
float3 halfVector = normalize(lightDir + viewDir);
// _SpecularTint：在属性中增加一个颜色值于控制高光颜色；Smoothness：在属性中增加一个数字值用于控制高光的大小
fixed3 specular = _SpecularTint * lightColor * pow(DotClamped(halfVector, i.normal),_Smoothness * 100);

// 片元中返回的最终颜色
return fixed4(specular + diffuse + ambient,1);
```



引用*`UnityStandardUtils.cginc`*文件，里面包含了很多光照渲染的方法。

![include-files-utils](..\res\include-files-utils.png)

高光反射时，应该根据当前表面的颜色，反射一个合理的值，这里就需要一个额外的判断。`EnergyConservationBetweenDiffuseAndSpecular() `方法可以返回一个经过处理后的表面颜色值。

这个方法接受纹素和高光颜色作为输入，返回一个调整后的纹素值。这个方法还有一个额外的返回值，其作为第3个参数输入，代表高光反射的强度。

```shaderlab
float oneMinusReflectivity;
albedo = EnergyConservationBetweenDiffuseAndSpecular(albedo, _SpecularTint.rgb, oneMinusReflectivity);
```

`EnergyConservationBetweenDiffuseAndSpecular`源码为：

```
half SpecularStrength(half3 specular) {
	#if (SHADER_TARGET < 30)
		// SM2.0: instruction count limitation
		// SM2.0: simplified SpecularStrength
		// Red channel - because most metals are either monochrome
		// or with redish/yellowish tint
		return specular.r;
	#else
		return max(max(specular.r, specular.g), specular.b);
	#endif
}

// Diffuse/Spec Energy conservation
inline half3 EnergyConservationBetweenDiffuseAndSpecular (half3 albedo, half3 specColor, 
	out half oneMinusReflectivity) 
{
	oneMinusReflectivity = 1 - SpecularStrength(specColor);
	#if !UNITY_CONSERVE_ENERGY
		return albedo;
	#elif UNITY_CONSERVE_ENERGY_MONOCHROME
		return albedo * oneMinusReflectivity;
	#else
		return albedo * (half3(1, 1, 1) - specColor);
	#endif
}
```

基于物理的渲染能带来更真实的效果，而且unity对其有更好的支持。引用“*`UnityPBSLighting.cginc`*”文件，为下面渲染提供支持。

![include-pbs](..\res\include-pbs.png)

文件的中的`UNITY_BRDF_PBS()`方法，会返回一个RGBA的颜色，且其中A总等于1。这个方法接收8个参数：

```c++
// UnityLightingCommon.cginc文件中定义了UnityLight，UnityIndirect，包含了光照的一些数据
UnityLight light;
light.color = lightColor;
light.dir = lightDir;
light.ndotl = DotClamped(i.normal, lightDir);

// 这个结构用于处理非直射光的情况
UnityIndirect indirectLight;
// 漫反射与环境光有关，这里先不做处理
indirectLight.diffuse = 0;
// 高光反射和环境反射光有关，这里先不做处理
indirectLight.specular = 0;

return  UNITY_BRDF_PBS(
	// DiffuseAndSpecularFromMetallic()调整后的纹素值
    albedo,
    // DiffuseAndSpecularFromMetallic()返回的高光颜色
    specularTint,
    // DiffuseAndSpecularFromMetallic()返回的反射强度
    oneMinusReflectivity,
    // 粗糙度
    _Smoothness,
    // 法线
    i.normal,
    // 视角方向
    viewDir,
    // 光照数据
    light,
    // 非直射光数据
    indirectLight);
```

此时，整个脚本的源码为：

```c++
Shader "Test/My First Shader" {

	Properties {
		_MainTex("MainTex",2D) = "white" {}
		_Tint ("Tint",Color) = (1,1,1,1)
		// 让这个值使用Gamma空间的差值变化
		[Gamma] _Metallic ("Metallic", Range(0, 1)) = 0
		_Smoothness ("Smoothness", Range(0, 1)) = 0.5
	}

	SubShader {

		Pass {
			
			Tags {"LightMode" = "ForwardBase"}

			CGPROGRAM

			#pragma vertex vert
			#pragma fragment frag

			#include "UnityPBSLighting.cginc"
			#pragma target 3.0

			sampler2D _MainTex;
			float4 _MainTex_ST;
			fixed3 _Tint;
			float _Metallic;
			float _Smoothness;

			struct appdata {
				float4 vertex : POSITION;
				float3 normal : NORMAL;
				float2 uv : TEXCOORD0;
			};

			struct v2f {
				float4 pos : SV_POSITION;
				float3 normal : TEXCOORD0;
				float2 uv : TEXCOORD1;
				float3 worldPos : TEXCOORD2;
			};

			v2f vert(appdata v) {
				v2f o;
				o.pos = UnityObjectToClipPos(v.vertex);
				o.normal = UnityObjectToWorldNormal(v.normal);
				o.uv = TRANSFORM_TEX(v.uv,_MainTex);
				o.worldPos = mul((float3x3)unity_ObjectToWorld,v.vertex);
				return o;
			}

			fixed4 frag(v2f i) : SV_TARGET {

				i.normal = normalize(i.normal);

				fixed3 albedo = tex2D(_MainTex,i.uv).rgb * _Tint.rgb;
				float3 specularTint;
				float oneMinusReflectivity;
				albedo = DiffuseAndSpecularFromMetallic(
					albedo, _Metallic, specularTint, oneMinusReflectivity
				);
				
				float3 lightDir = _WorldSpaceLightPos0.xyz;
				float3 lightColor = _LightColor0.rgb;
				float3 viewDir = normalize(_WorldSpaceCameraPos - i.worldPos);

				UnityLight light;
				light.color = lightColor;
				light.dir = lightDir;
				light.ndotl = DotClamped(i.normal, lightDir);

				UnityIndirect indirectLight;
				indirectLight.diffuse = 0;
				indirectLight.specular = 0;

				return  UNITY_BRDF_PBS(
					albedo,
					specularTint,
					oneMinusReflectivity,
					_Smoothness,
					i.normal,
					viewDir,
					light,
					indirectLight);
			}

			ENDCG
		}

	}

}
```

