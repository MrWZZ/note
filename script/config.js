function Config() {
    var self = this;
    // 导航地址信息
    self.navigationData = [
        { title: "主页", url: "/note/index.html" },
        { title: "知识", url: "/note/html/knowledge/knowledge.html" },
        { title: "笔记", url: "/note/html/note/note.html" },
        { title: "游戏", url: "/note/index.html" },
        { title: "工具", url: "/note/html/tool/tool.html" }
    ]

    // 通用内容页面地址
    self.contentPagePath = "/note/html/knowledge/content.html";

    var knowledgeRootPath = "/note/html/knowledge";
    // 知识页面信息
    self.knowledgeData = [
        {
            title: "语言",
            type: [
                { name: "C#", url: `${knowledgeRootPath}` },
                { name: "C++", url: "" },
                { name: "Lua", url: `${knowledgeRootPath}/lua/lua.html` },
                { name: "JavaScript", url: "" },
            ]
        },
        {
            title: "Unity3D",
            type: [
                { name: "Unity引擎", url: "" },
                { name: "UnityShader", url: `${knowledgeRootPath}/unityShader/unityShader.html` },
            ]
        }
    ]
}
var Config = new Config();
