```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using System.Text;

namespace ReferenceCollect 
{
    public class ReferenceCollectWindow : EditorWindow
    {
        string inputContent = "选取一个需要收集引用的页面";
        Vector2 scrollPos = Vector2.zero;

        [MenuItem("ReferenceCollect/OpenWindow")]  //添加菜单选项
        public static void ShowWindow()
        {
            EditorWindow window = EditorWindow.GetWindowWithRect<ReferenceCollectWindow>(new Rect(Screen.width/3,Screen.height/2,500, 500));
            window.Show();
        }

        public void OnGUI()
        {
            EditorGUILayout.BeginHorizontal();

            inputContent = EditorGUILayout.TextArea(inputContent,GUILayout.Width(400),GUILayout.Height(500));

            EditorGUILayout.BeginVertical();

            EditorGUILayout.Space();

            if (GUILayout.Button("生成字段"))
            {
                CollectReference();
            }

            if (GUILayout.Button("生成方法"))
            {
                CreateFunction();
            }

            EditorGUILayout.EndVertical();

            EditorGUILayout.EndHorizontal();
        }

        public void CollectReference()
        {
            GameObject selectObj = Selection.activeGameObject;
            if (selectObj == null)
            {
                inputContent = "当前所选物体为空";
                return;
            }

            StringBuilder stringBuilder = new StringBuilder();
            var arr = selectObj.GetComponentsInChildren<RectTransformID>(true);

            if(arr.Length == 0)
            {
                inputContent = "当前物体下没有RectTransformID类型";
                return;
            }

            stringBuilder.AppendLine("#region UI字段");
            foreach (var item in arr)
            {
                stringBuilder.AppendLine("public UIBuilderElementMeta " + item.name +";");
            }
            stringBuilder.AppendLine("#endregion");

            inputContent = stringBuilder.ToString();
            OnGUI();
        }

        public void CreateFunction()
        {
            GameObject selectObj = Selection.activeGameObject;
            if (selectObj == null)
            {
                inputContent = "当前所选物体为空";
                return;
            }

            StringBuilder stringBuilder = new StringBuilder();
            var arr = selectObj.GetComponentsInChildren<RectTransformID>(true);

            if (arr.Length == 0)
            {
                inputContent = "当前物体下没有RectTransformID类型";
                return;
            }

            stringBuilder.AppendLine("#region UI引用获取");
            stringBuilder.AppendLine("public void InitUI()");
            stringBuilder.AppendLine("{");
            foreach (var item in arr)
            {
                stringBuilder.AppendLine("    " + item.name + " = GetUI(\""+ item.name + "\");");
            }
            stringBuilder.AppendLine("}");
            stringBuilder.AppendLine("#endregion");

            inputContent = stringBuilder.ToString();
            OnGUI();
        }
    }
}
```

