function Config() {
    var self = this;
    // 导航地址信息
    self.navigationData = [
        { title: "主页", url: "/note/index.html" },
        { title: "知识", url: "/note/html/knowledge/knowledge.html" },
        { title: "随笔", url: "/note/html/note/note.html" }
    ]

    // 通用内容页面地址
    self.contentPagePath = "/note/html/content.html";

    var knowledgeRootPath = "/note/html/knowledge";
    // 知识页面信息
    self.knowledgeData = [
        {
            title: "语法",
            type: [
                { name: "Lua", url: `${knowledgeRootPath}/lua/lua.html` },
            ]
        }
    ]
}
var Config = new Config();
