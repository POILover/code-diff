const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res)=>{
    res.setHeader('Content-Type', "text/html");
    // fs.readFile("./html/index.html", (err, data)=>{
    //     if(err){
    //         res.write(err);
    //     }else{
    //         res.write(data);
    //         res.end();
    //     }
    // })
    // fs.readFile("./html/file/a.html", "utf8", (err, data)=>{
    //     if(err){
    //         console.log(err);
    //         return;
    //     }
    //     console.log(data);
        
    // })
    insertDomToTemplate("insert","");
    res.write("<div>hello</div>")
});
server.listen(9527, "127.0.0.1", () => {
    console.log("server is running at 9527.")
})

const tmeplate = fs.readFileSync("./html/template.html", "utf8");
function insertDomToTemplate(placeholder, dom){
    tmeplate.replace(/\{\{(.+?)\}\}/g, (...args)=>{
        console.log(args)
    })
}