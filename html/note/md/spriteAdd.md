##图片合并


```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using System.IO;

public class ImageBuilder : MonoBehaviour {

    private const string InputPath = "/ImageBuilder/Input/";
    private const string OutputPath = "/ImageBuilder/Output/";

    private const int EmojiSize = 24;

    [MenuItem("ImageBuilder/Build")]
    public static void Build()
    {
        var inputFilePath = Application.dataPath + InputPath;
        if(!Directory.Exists(inputFilePath))
        {
            Debug.Log("输入路径不存在，已重新创建该路径，请将需要打包合图的图片（.png）放入该路径");
            Directory.CreateDirectory(inputFilePath);
            AssetDatabase.Refresh();
            return;
        }

        var filesPaht = Directory.GetFiles(inputFilePath, "*.png");

        var textureList = new List<Texture2D>();

        foreach (var path in filesPaht)
        {
            var filePath = path.Replace(Application.dataPath, "Assets");
            var asset = AssetDatabase.LoadAssetAtPath<Texture2D>(filePath);
            textureList.Add(asset);
        }

        Vector2 texSize = ComputeAtlasSize(textureList.Count);

        var newTex = new Texture2D((int)texSize.x, (int)texSize.y , TextureFormat.ARGB32, false);

        var x = 0;
        var y = (int)texSize.y - EmojiSize ;
        foreach (var texture in textureList)
        {
            var colorArr = texture.GetPixels32();
            newTex.SetPixels32(x, y, EmojiSize, EmojiSize, colorArr);
            x += EmojiSize;
            if (x >= texSize.x)
            {
                x = 0;
                y -= EmojiSize;
            }
        }

        // 写入
        byte[] bytes1 = newTex.EncodeToPNG();

        var outputFilePath = Application.dataPath + OutputPath;
        if(!Directory.Exists(outputFilePath))
        {
            Directory.CreateDirectory(outputFilePath);
        }

        string outputfile1 = outputFilePath + "emoji_tex.png";
        File.WriteAllBytes(outputfile1, bytes1);

        AssetDatabase.Refresh();
    }

    private static Vector2 ComputeAtlasSize(int count)
    {
        var Row = Mathf.CeilToInt(Mathf.Sqrt(count));
        return Vector2.one * Row * EmojiSize;
    }
}

```

