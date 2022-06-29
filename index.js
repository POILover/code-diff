const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res)=>{
    res.setHeader('Content-Type', "text/html");
    const insertText1 = escapeChars(readAsyncFile("./src/file/b.ignore.html"));
    const insertText2 = escapeChars(readAsyncFile("./src/file/b.html"));
    res.write(insertDomToTemplate({insertText1, insertText2}));
    res.end();
});

server.listen(9527, "127.0.0.1", () => {
    console.log("server is running at 9527.")
})

const template = readAsyncFile("./src/template.html");

function insertDomToTemplate(obj){
    const keys = Object.keys(obj);
    const len = keys.length;
    return template.replace(/\{\{(.+?)\}\}/g, (_, content)=>{
        for(let i=0;i<len;i++){
            const key = keys[i];
            if(content.trim() === key){
                return obj[key]
            }
        }
    })
}

function readAsyncFile(filePath){
    return fs.readFileSync(filePath, "utf8");
}

function escapeChars(str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/'/g, '&acute;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/\|/g, '&brvbar;');
    return str;
}