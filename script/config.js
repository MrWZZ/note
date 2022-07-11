function Config() {
    var self = this;
    // 导航地址信息
    self.navigationData = [
        { title: "主页", url: "/note/index.html" },
        { title: "知识", url: "/note/html/knowledge/knowledge.html" },
        { title: "随笔", url: "/note/html/note/index/note.html" }
    ]

    // 通用内容页面地址
    self.contentPagePath = "/note/html/content.html";

    var knowledgeRootPath = "/note/html/knowledge";
    // 知识页面信息
    self.knowledgeData = [
        {
            title: "语法",
            type: [
                { name: "Lua", url: `${knowledgeRootPath}/lua/index/lua.html` },
            ]
        },
        {
            title: "编程思想",
            type: [
                { name: "数据结构和算法", url: `${knowledgeRootPath}/algorithms/index/algorithms.html` },
                { name: "压缩算法", url: `${knowledgeRootPath}/compressionAlgorithm/index/compressionAlgorithm.html` },
            ]
        },
        {
            title: "Unity",
            type: [
                { name: "Unity Tool", url: `${knowledgeRootPath}/unityTool/index/unityTool.html` },
                { name: "Unity Shader", url: `${knowledgeRootPath}/unityShader/index/unityShader.html` },
            ]
        },
        {
            title: "3D Max",
            type: [
                { name: "随笔", url: `${knowledgeRootPath}/3dmax/index/3dmax.html` },
            ]
        },
    ]
}
var Config = new Config();
