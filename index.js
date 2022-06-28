const http = require("http");
const fs = require("fs");
const Diff = require("diff");
const Diff2Html = require("diff2html");
hljs = require('highlight.js/lib/common');
const server = http.createServer((req, res)=>{
    console.log(req.url)
    res.setHeader('Content-Type', "text/html");
    const diffDom1 = readAsyncFile("./src/file/b.ignore.html");
    const diffDom2 = readAsyncFile("./src/file/b.html");
    const diffResult = Diff.createPatch('fileName', diffDom1, diffDom2, "oldHeader", "newHeader");
    const diffResultDom = Diff2Html.html(diffResult, {
        drawFileList: true,
        matching: "lines",
        outputFormat: "side-by-side",
      });
    const style = readAsyncFile("./src/css/diff2html.min.css") + readAsyncFile("./src/css/github.css");
    if(req.url!=="/"){
        
    }
    // hljs.highlight(diffResultDom, {language:'html'}).value
    // res.write(insertDomToTemplate(hljs.highlight(diffResultDom, {language:'html'}).value, style));
    res.write(insertDomToTemplate(diffResultDom, style));
    
});

server.listen(9527, "127.0.0.1", () => {
    console.log("server is running at 9527.")
})

const template = readAsyncFile("./src/template.html");
function insertDomToTemplate(dom, style){
    return template.replace(/\{\{(.+?)\}\}/g, (_, content)=>{
        if(content.trim() === "insertStyle"){
            return style
        }
        if(content.trim() === "insertDom"){
            return dom
        }
    })
}

function readAsyncFile(filePath){
    return fs.readFileSync(filePath, "utf8");
}
