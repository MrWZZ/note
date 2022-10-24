# 获取深度图

```c++

#include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/DeclareDepthTexture.hlsl"

float2 normalizedScreenSpaceUV = GetNormalizedScreenSpaceUV(input.positionCS);
float rawDepth = SampleSceneDepth(normalizedScreenSpaceUV);
float depth = LinearEyeDepth(rawDepth, _ZBufferParams);

```