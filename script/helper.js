// init tool

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

function InitContentPageBody(firstContentPath) {
    window.addEventListener("resize", ChangeTableDisplay);
    var iframe = document.createElement("iframe");
    iframe.src = "/note/html/common/content-page.html";
    iframe.style.display = "none";
    iframe.onload = function (event) {
        document.body.innerHTML = event.target.contentDocument.body.innerHTML;
        var content_title = document.getElementById("content_title");
        //pageName为目标页面下的数据，是在各个类目页面下自己加载的
        content_title.innerText = pageName;
        LoadPageToContent(firstContentPath);
        //标签名字
        document.title = pageName;
    }
    document.body.appendChild(iframe);
}

function LoadPageToContent(path) {

    SetCategoryData(path);

    var content = document.getElementById("content");
    var iframe = document.createElement("iframe");
    iframe.src = path;
    iframe.style.display = "none";
    iframe.onload = function (event) {
        var newContent = marked(event.target.contentDocument.body.innerText);
        content.innerHTML = newContent;
        ChangeTableDisplay();
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
        document.body.removeChild(iframe);
    }
    document.body.appendChild(iframe);
}

function ChangeTableDisplay() {
    var tableArr = document.getElementsByClassName("md_table");
    for (var i = 0; i < tableArr.length; i++) {
        if (tableArr[i].offsetWidth > tableArr[i].parentElement.offsetWidth) {
            tableArr[i].style.display = "block";
        }
        else {
            tableArr[i].style.display = "table";
        }
    }
}

function SetCategoryData(curPath) {

    //pages为目标页面下的数据，是在各个类目页面下自己加载的
    var category = document.getElementById("category");
    
    for(var i=category.children.length-1;i>=0;i--) {
        category.removeChild(category.children[i]);
    }
    
    for(var i=0;i<pages.length;i++) {
        var cell = document.createElement("div");
        cell.innerText = pages[i].name;
        if(curPath == pages[i].url) {
            cell.setAttribute("class","category_cell_select");
        }
        else{
            cell.contentLink = pages[i].url;
            cell.setAttribute("class","category_cell");
            cell.onclick = function(event) {LoadPageToContent(event.target.contentLink)}
        }
        category.appendChild(cell);
    }
}

//knowledge页面

function InitKnowledgePage() {
    CreateContentElement();
    FixCellPos();
    window.addEventListener("resize",FixCellPos);
}

function CreateContentElement() {
    var content = document.getElementById("doc");

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
            cell.setAttribute("class", "category_cell");
            cell.innerText = knowledgeData[i].type[j].name;
            cell.contentUrl = knowledgeData[i].type[j].url;
            cell.onclick = function (event) { window.location.href = event.target.contentUrl; };
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
        posArr[rowIndex] = [left,curBottom];
        elementIndex++;
    }

    //填满剩下的
    for(var i = elementIndex;i<content.childElementCount;i++) {
        var posIndex = 0;
        var minY = posArr[0][1];
        //寻找最小Y值
        for(var j=0;j<posArr.length;j++) {
            if(posArr[j][1] < minY)  {
                minY = posArr[j][1];
                posIndex = j;
            }
        }

        var curElement = content.children[i];
        curElement.style.left = posArr[posIndex][0] + "px";
        curElement.style.top = posArr[posIndex][1] + "px";

        posArr[posIndex][1] +=  curElement.offsetHeight + cellMargin;
    } 
}