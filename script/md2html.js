function Md2Html() {
    var self = this;
    var rule = {
        // 标题
        header: {
            // 类型
            type: "header",
            // 匹配类型
            match: /^\s*#+\s+[^\n]+?\s*?\n/,
            // 清除额外标识获取内容
            clear: /(^\s*#+\s+)|(\s*\n$)/g
        },
        // 空行
        spaceLine: {
            type: "spaceLine",
            match: /^\s*\n/,
        },
        // 代码段
        code: {
            type: "code",
            match: /^\s*`{3}\S+\s*?\n(\s|\S)+?`{3}\n/,
            clear: /(^\s*`{3}\S+\s*\n)|(`{3}\n$)/g
        },
        // 段落
        paragraph: {
            type: "paragraph",
            match: /^s*[^\n]+?\n/,
            clear: /(^\s*)|(\s*\n$)/g
        },
        // 粗体
        bold: {
            type: "bold",
            match: /\*{2}[^\n]+?\*{2}/g,
            clear: /\s*\{2}\s*/g
        }
    }
    self.Parse = function (mdString) {
        // 删除头部的换行
        mdString = mdString.replace(/^\n+/, "");
        var tokens = [];
        // 从上到下一行一行识别
        while (mdString) {

            var cap;
            // 识别标题
            if (cap = rule.header.match.exec(mdString)) {
                mdString = mdString.substring(cap[0].length);
                tokens.push(ParseHeader(cap[0]));
                continue;
            }
            // 识别空行
            if (cap = rule.spaceLine.match.exec(mdString)) {
                mdString = mdString.substring(cap[0].length);
                tokens.push(ParseSpaceLine(cap[0]));
                continue;
            }
            // 识别代码段
            if (cap = rule.code.match.exec(mdString)) {
                mdString = mdString.substring(cap[0].length);
                tokens.push(ParseCode(cap[0]));
                continue;
            }
            // 识别段落
            if (cap = rule.paragraph.match.exec(mdString)) {
                mdString = mdString.substring(cap[0].length);
                tokens.push(ParseParagraph(cap[0]));
                continue;
            }
            
            break;
        }
        return GetResultByTokens(tokens);
    }
    // 识别标题
    function ParseHeader(content) {
        return {
            type: rule.header.type,
            text: content.replace(rule.header.clear, ""),
            headerNum: content.replace(/^\s+/).match(/#+/)[0].length
        }
    }

    // 识别空行
    function ParseSpaceLine(content) {
        return {
            type: rule.spaceLine.type
        }
    }

    // 识别代码段
    function ParseCode(content) {
        var codeText = content.replace(rule.code.clear,"");
        // 制表符替换
        codeText = codeText.replace(/\t/g,"    ");
        return {
            type: rule.code.type,
            text: codeText,
            // 获取代码类型
            codeType: content.match(/\s*`{3}\S+/)[0].replace(/\s|`/g,"")
        }
    }

    // 识别段落
    function ParseParagraph(content) {
        // 识别加粗
        content = content.replace(rule.bold.match,"")
        return {
            type: rule.paragraph.type,
            text: content.replace(rule.paragraph.clear, ""),
        }
    }

    function ParseBold(content) {
        var cap;
        if(cap = content.match(rule.bold.match)) {
            for (var i=0;i<cap.length;i++) {
                
            }
        }

        return 
    }

    // 组装Tokens得到最后结果
    function GetResultByTokens(tokens) {
        var result = "";
        for (var i = 0; i < tokens.length; i++) {
            switch (tokens[i].type) {
                case rule.header.type:
                    result += `<h${tokens[i].headerNum}>${tokens[i].text}</h${tokens[i].headerNum}>`
                    break;
                case rule.spaceLine.type:
                    // 暂时不处理空行
                    // result += `<br/>`
                    break;
                case rule.code.type:
                    result += `<pre><code class="language-${tokens[i].codeType}">${tokens[i].text}</code></pre>`
                    break;
                case rule.paragraph.type:
                    result += `<p>${tokens[i].text}</p>`;
                    break;
            }
        }
        return result;
    }
}

var Md2Html = new Md2Html();