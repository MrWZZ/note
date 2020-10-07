// 初始化主页面
function InitHomePage() {
    var nav = document.getElementById("nav");
    var data = Config.navigationData;
    for (var i = 0; i < data.length; i++) {
        var td = document.createElement("td");
        td.innerHTML = data[i].title;
        td.setAttribute("onclick", `window.location.href = "${data[i].url}"`);
        nav.appendChild(td);
    }
}

// init tool

// 初始化工具页面
function InitToolPageBody(pageData) {

    var iframe = document.createElement("iframe");
    iframe.src = "/note/html/common/content-page.html";
    iframe.style.display = "none";
    iframe.onload = function (event) {
        document.body.innerHTML = event.target.contentDocument.body.innerHTML;
        var content_title = document.getElementById("content_title");
        //pageName为目标页面下的数据，是在各个类目页面下自己加载的
        content_title.innerText = pageName;
        LoadToolPageToContent(pageData);
        //标签名字
        document.title = pageName;
    }
    document.body.appendChild(iframe);

}

function LoadToolPageToContent(pageData) {

    SetCategoryData(pageData.url);

    var content = document.getElementById("content");
    var iframe = document.createElement("iframe");
    iframe.src = pageData.url;
    iframe.style.display = "none";
    iframe.onload = function (event) {
        content.innerHTML = event.target.contentDocument.body.innerHTML;
        LoadScript(pageData.scriptUrl)
        document.body.removeChild(iframe);
    }
    document.body.appendChild(iframe);
}

function LoadScript(path) {
    var script = document.createElement("script");
    script.src = path;
    script.style.display = "none";
    script.onload = function (event) {
        document.body.removeChild(script);
    }
    document.body.appendChild(script);
}

// init content

// 初始化内容页面
function InitContentPage() {

    // 加载通用内容界面
    var iframe = document.createElement("iframe");
    iframe.src = Config.contentPagePath;
    iframe.style.display = "none";
    iframe.onload = function (event) {
        document.body.innerHTML = event.target.contentDocument.body.innerHTML;
        // 生成顶部导航
        CreateNavElement();
        // 生成左侧分类
        CreateCategoryElements();
        // 加载第一个界面
        LoadPageToContent(pages[0].url);
    }
    document.body.appendChild(iframe);
}

function LoadPageToContent(path) {
    // 设置界面已被选择
    SetCategoryData(path);
    var content = document.getElementById("content");
    var iframe = document.createElement("iframe");
    iframe.src = path;
    iframe.style.display = "none";
    iframe.onload = function (event) {
        // 设置左侧导航高度
        var category = document.getElementById("category");
        // 先重置高度
        category.style.height = `0px`;
        var parseText = marked(event.target.contentDocument.body.innerText);
        content.innerHTML = parseText;
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
        // 如果高度小于窗口高度，这设置为窗口高度
        if(content.scrollHeight < window.innerHeight) {
            var nav = document.getElementById("nav");
            category.style.height = `${window.innerHeight - nav.clientHeight}px`; 
        }
        else {
            category.style.height = `${content.scrollHeight}px`;
        }
        document.body.removeChild(iframe);
    }
    document.body.appendChild(iframe);
}

// 生成左侧的子页面分类控件
function CreateCategoryElements() {

    var category = document.getElementById("category");

    //pages为目标页面下的数据，是在各个类目页面下自己加载的
    for (var i = 0; i < pages.length; i++) {
        var cell = document.createElement("div");
        cell.innerText = pages[i].name;
        cell.contentLink = pages[i].url;
        cell.setAttribute("class", "category_cell");
        category.appendChild(cell);
    }
}

// 设置分类选择状态
function SetCategoryData(curPath) {

    var category = document.getElementById("category");

    for (var i = category.children.length - 1; i >= 0; i--) {

        if (curPath == pages[i].url) {
            category.children[i].setAttribute("class", "category_cell_select");
            category.children[i].onclick = null;
        }
        else {
            category.children[i].setAttribute("class", "category_cell");
            category.children[i].onclick = function (event) { LoadPageToContent(event.target.contentLink); }
        }
    }
}

//knowledge页面

// 初始化知识页面
function InitKnowledgePage() {
    CreateNavElement();
    CreateContentElement();
    FixCellPos();
    window.addEventListener("resize", FixCellPos);
}

// 生成导航按钮
function CreateNavElement() {
    var nav = document.getElementById("nav");
    var data = Config.navigationData;
    for (var i = 0; i < data.length; i++) {
        var navCell = document.createElement("div");
        navCell.innerHTML = data[i].title;
        navCell.setAttribute("class", "nav_cell");
        navCell.setAttribute("onclick", `window.location.href = "${data[i].url}"`);
        nav.appendChild(navCell);
    }
}

// 生成内容分类
function CreateContentElement() {
    var content = document.getElementById("doc");
    var knowledgeData = Config.knowledgeData;
    for (var i = 0; i < knowledgeData.length; i++) {

        var type = document.createElement("div");
        type.setAttribute("class", "category");
        content.appendChild(type);

        var title = document.createElement("div");
        title.setAttribute("class", "category_cell_select");
        title.innerText = knowledgeData[i].title;
        type.appendChild(title);

        for (var j = 0; j < knowledgeData[i].type.length; j++) {
            var cell = document.createElement("div");
            cell.innerText = knowledgeData[i].type[j].name;
            cell.setAttribute("class", "category_cell");
            cell.setAttribute("onclick", `window.location.href = "${knowledgeData[i].type[j].url}"`);
            type.appendChild(cell);
        }
    }
}

function FixCellPos() {
    var content = document.getElementById("doc");
    content.style.display = "block";

    var nav = document.getElementById("nav");
    var witdh = nav.clientWidth;

    var cellWidth = 300;
    var cellMargin = 15;

    var count = Math.floor(witdh / cellWidth);
    if (count > content.childElementCount) {
        count = content.childElementCount;
    }
    var needWidth = count * cellWidth + (count - 1) * cellMargin;

    //需要的宽度不足
    if (needWidth > witdh) {
        count = count - 1;
        needWidth = count * cellWidth + (count - 1) * cellMargin;
    }

    var minLeftSpan = 0;

    //最少为1个
    if (count <= 0) {
        count = 1;
        minLeftSpan = 0;
    }
    else {
        minLeftSpan = (witdh - needWidth) / 2;
    }

    var posArr = [];
    var elementIndex = 0;
    //首先填满第一行
    for (var rowIndex = 0; rowIndex < count; rowIndex++) {
        var curElement = content.children[elementIndex];

        var left = minLeftSpan + rowIndex * cellWidth + rowIndex * cellMargin;
        curElement.style.left = left + "px";
        curElement.style.top = nav.offsetHeight + cellMargin + "px";
        var curBottom = curElement.offsetTop + curElement.offsetHeight + cellMargin;
        posArr[rowIndex] = [left, curBottom];
        elementIndex++;
    }

    //填满剩下的
    for (var i = elementIndex; i < content.childElementCount; i++) {
        var posIndex = 0;
        var minY = posArr[0][1];
        //寻找最小Y值
        for (var j = 0; j < posArr.length; j++) {
            if (posArr[j][1] < minY) {
                minY = posArr[j][1];
                posIndex = j;
            }
        }

        var curElement = content.children[i];
        curElement.style.left = posArr[posIndex][0] + "px";
        curElement.style.top = posArr[posIndex][1] + "px";

        posArr[posIndex][1] += curElement.offsetHeight + cellMargin;
    }
}