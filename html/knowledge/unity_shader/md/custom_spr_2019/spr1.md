本项目于Unity2019.3.7下记录。

打开 Edit / Project Settings，切换到 Player 面板，找到 Other Settings 栏目，将 Color Space 切换成 linear 模式。

这里测试4个类型的Shader：

1. Standard ，Rendering Mode 为 Opaque
2. Standard ，Rendering Mode 为 Transparent
3. Unlit / Color 
4. Unlit / Transparent

新建这些类型的材质，并在场景中生成一些物体使用这些材质。

本目录resource文件夹下提供了一张Transparent用的纹理sphere-alpha-map.png。

新建一个文件夹“CustomRP/Runtime“，保存我们自己定义的渲染管道文件。

在Runtime下新建`CustomRenderPipelineAsset`类，保存我们自己的管道设置。

```csharp
using UnityEngine;
using UnityEngine.Rendering;

[CreateAssetMenu(menuName = "Rendering/Custom Render Pipeline")]
public class CustomRenderPipelineAsset : RenderPipelineAsset
{
	// 这个文件的主要目的是给Unity提供一个实例，该实例用于确定要如何渲染物体
    protected override RenderPipeline CreatePipeline()
    {
        return new CustomRenderPipeline();
    }
}
```

通过这个文件生成的菜单新建一个文件“CustomRP“，打开 Graphics 项目设置，将Scriptable Render Pipeline Settings设置为这个文件。这时，Unity将使用我们自定义的管道进行渲染，而当前我们并没有编写渲染流程，所有渲染将不会显示。

在Runtime下新建`CustomRenderPipeline`类，这个文件将会使用`CustomRenderPipelineAsset`提供的实例来进行物体的渲染。

```csharp
using UnityEngine;
using UnityEngine.Rendering;

public class CustomRenderPipeline : RenderPipeline
{
    CameraRenderer renderer = new CameraRenderer();

    // Unity每一帧都会调用这个实例的方法来渲染物体
    // context:进行渲染的上下文
    // cameras:场景中的相机数组
    protected override void Render(ScriptableRenderContext context, Camera[] cameras)
    {
        foreach (Camera camera in cameras)
        {
            renderer.Render(context, camera);
        }
    }

}
```

每个相机的渲染应该要做到独立，我们新建一个`CameraRenderer `类，让他负责要如何渲染自己看到的画面。

```csharp
using UnityEngine;
using UnityEngine.Rendering;

public partial class CameraRenderer
{
    
    ScriptableRenderContext context;

    Camera camera;

    // 给buffer起一个名字，以便我们能在frame debugger里面观察渲染流程
    const string bufferName = "Render Camera";

    // 对context的操作会设置他操作的buffer，对其提交后才能生效渲染
    // 有些操作命令可以直接操作context的buffer，有些则不行
    // 这里需要声明一个新的buffer来缓存其他的操作命令
    CommandBuffer buffer = new CommandBuffer
    {
        name = bufferName
    };

    // 保存上下文的剔除结果
    CullingResults cullingResults;

    // 配置需要渲染的Shader Pass
    // SRPDefaultUnlit 代表Unity中默认的Unlit类下的Shader
    static ShaderTagId unlitShaderTagId = new ShaderTagId("SRPDefaultUnlit");

    public void Render(ScriptableRenderContext context, Camera camera)
    {
        this.context = context;
        this.camera = camera;

        PrepareBuffer();
        PrepareForSceneWindow();
        // 如果不能获取到相机的剔除数据，则不对该相机渲染
        if (!Cull())
        {
            return;
        }

        Setup();
        DrawVisibleGeometry();
        DrawUnsupportedShaders();
        DrawGizmos();
        Submit();
    }

    // 设置渲染配置配置信息
    void Setup()
    {
        // 设置相机的渲染属性，如相机的变换矩阵，正交透视，清除配置等
        context.SetupCameraProperties(camera);
        // 相机的清楚模式，当场景有多个相机时，如果ClearRenderTarget方法参数都是true的话，就会完全清除上一个相机所渲染的内容
        // 所以要根据clearFlags来确定要如何混合多个相机的渲染结果
        // CameraClearFlags 枚举是有顺序的，除了Nothing外，值高的包含了值低的模式
        CameraClearFlags flags = camera.clearFlags;
        // 在每一帧渲染之前，我们应该清除上一帧的渲染内容
        // 这个放在应该放在BeginSample之前，因为ClearRenderTarget内部也用了BeginSample(bufferName)进行监视，会多出来一个bufferName层级
        // ClearRenderTarget会在frame debugger中执行一条Draw GL命令，该命令采用Unity内置 Hidden/InternalClear Shader渲染整个屏幕的图片，并进行清除操作
        // 我们应该在这个方法执行之前先写入相机的属性配置(执行SetupCameraProperties方法），这样能让清除进行合并（Clear(color+Z+stencil)），提高清除的速度
        buffer.ClearRenderTarget(
            flags <= CameraClearFlags.Depth,
            flags == CameraClearFlags.Color,
            flags == CameraClearFlags.Color ? camera.backgroundColor.linear : Color.clear
        );
        buffer.BeginSample(SampleName);
        ExecuteBuffer();
    }

    // 独立一个方法来负责渲染看到的东西
    void DrawVisibleGeometry()
    {
        // 排序设置
        var sortingSettings = new SortingSettings(camera) {
            // 不透明物体是前向后渲染
            criteria = SortingCriteria.CommonOpaque
        };
        // 绘制设置
        var drawingSettings = new DrawingSettings(
                unlitShaderTagId, sortingSettings
            );
        var filteringSettings = new FilteringSettings(
                // 配置需要渲染的队列
                RenderQueueRange.opaque
            );

        // 渲染我们能看到的几何物体
        context.DrawRenderers(
            cullingResults, ref drawingSettings, ref filteringSettings
        );

        // ScriptableRenderContext内置的一个方法可以渲染天空盒
        context.DrawSkybox(camera);

        // 渲染透明的物体应该放在DrawSkybox之后，因为渲染透明物体是不会写入深度数据，会被Skybox覆盖
        sortingSettings.criteria = SortingCriteria.CommonTransparent;
        drawingSettings.sortingSettings = sortingSettings;
        filteringSettings.renderQueueRange = RenderQueueRange.transparent;

        context.DrawRenderers(
            cullingResults, ref drawingSettings, ref filteringSettings
        );
    }

    // 提交我们进行的渲染操作
    void Submit()
    {
        buffer.EndSample(SampleName);
        ExecuteBuffer();
        // DrawVisibleGeometry里面进行的设置只是对context进行了缓冲，我们需要提交对他的更改才能让渲染生效
        context.Submit();
    }

    // 执行我们自己定义的buffer流数据
    void ExecuteBuffer()
    {
        context.ExecuteCommandBuffer(buffer);
        buffer.Clear();
    }

    // 对相机进行剔除操作，不显示在相机视野外的物体
    bool Cull()
    {
        // 对相机自身调用剔除操作，该操作可能会因为相机的属性配置而失败
        if (camera.TryGetCullingParameters(out ScriptableCullingParameters p))
        {
            // 根据相机的剔除数据，对上下文进行剔除操作
            cullingResults = context.Cull(ref p);
            return true;
        }
        return false;
    }
}
```

新建一个`CameraRenderer.Editor`文件作为``CameraRenderer`的分部类，里面编写只在编辑器环境下需要渲染的东西。

```csharp
using UnityEditor;
using UnityEngine;
using UnityEngine.Profiling;
using UnityEngine.Rendering;

public partial class CameraRenderer
{
    partial void PrepareBuffer();
    partial void DrawGizmos();
    partial void PrepareForSceneWindow();
    partial void DrawUnsupportedShaders();

#if UNITY_EDITOR

    string SampleName { get; set; }

    // Unity 自带默认Shader Pass
    static ShaderTagId[] legacyShaderTagIds = {
        new ShaderTagId("Always"),
        new ShaderTagId("ForwardBase"),
        new ShaderTagId("PrepassBase"),
        new ShaderTagId("Vertex"),
        new ShaderTagId("VertexLMRGBM"),
        new ShaderTagId("VertexLM")
    };

    static Material errorMaterial;

    partial void PrepareBuffer()
    {
        Profiler.BeginSample("Editor Only");
        // 使用camera.name会有GC
        buffer.name = SampleName = camera.name;
        Profiler.EndSample();
    }

    // 绘制物体的Gizmos图标
    partial void DrawGizmos()
    {
        if (Handles.ShouldRenderGizmos())
        {
            context.DrawGizmos(camera, GizmoSubset.PreImageEffects);
            context.DrawGizmos(camera, GizmoSubset.PostImageEffects);
        }
    }

    // 绘制Scene窗口所用的相机
    partial void PrepareForSceneWindow()
    {
        if (camera.cameraType == CameraType.SceneView)
        {
            // UI物体使用的是坐标是世界空间的，SceneWindow相机绘制时，对UI物体进行适配
            ScriptableRenderContext.EmitWorldGeometryForSceneView(camera);
        }
    }

    // 绘制我们自己管道不支持的Shader
    partial void DrawUnsupportedShaders()
    {
        if (errorMaterial == null)
        {
            errorMaterial = new Material(Shader.Find("Hidden/InternalErrorShader"));
        }

        var drawingSettings = new DrawingSettings(legacyShaderTagIds[0], new SortingSettings(camera))
        {
            // 使用Unity自带的错误Shader来渲染这些不被我们支持的Shader
            overrideMaterial = errorMaterial
        };
        for (int i = 1; i < legacyShaderTagIds.Length; i++)
        {
            // SetShaderPassName可以设置需要绘制的Pass名称
            drawingSettings.SetShaderPassName(i, legacyShaderTagIds[i]);
        }

        var filteringSettings = FilteringSettings.defaultValue;
        context.DrawRenderers(
            cullingResults, ref drawingSettings, ref filteringSettings
        );
    }

#else

    const string SampleName = bufferName;

#endif

}
```

