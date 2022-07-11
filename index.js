const express = require("express");
const app = express();
const fs = require("fs");
const fileNameList = fs.readdirSync("./src/file/compare");
const total = fileNameList.length;

app.get("/index", (req, res) => {
    const urlParsed = parseUrl(req.url);
    const { urlPath, urlQuery } = urlParsed;
    if (urlPath === "/index") {
        const current = urlQuery.page;
        res.setHeader("Content-Type", "text/html");
        if (current) {
            // try {
            const fileName = fileNameList[current - 1];
            const insertText1 = escapeChars(readAsyncFile(`./src/file/ignore/${fileName}`));
            const insertText2 = escapeChars(readAsyncFile(`./src/file/compare/${fileName}`));
            res.send(insertDomToTemplate({ current, total, insertText1, insertText2 }));
            // } catch {
            //     res.send("wrong file");
            // }
        } else {
            res.send("no file");
        }
    }
});

const path = require("path");
app.use("/static", express.static(path.join(__dirname, "public")));

// error handlers need after static
app.use(function (_, res) {
    res.status(404).sendFile(path.resolve(__dirname, "./src/error-page/404.html"));
});

const port = 9526;
app.listen(port, () => {
    console.log(`Example app listening on http://127.0.0.1:${port}`);
});
const template = readAsyncFile("./src/template.html");

function insertDomToTemplate(obj) {
    const keys = Object.keys(obj);
    const len = keys.length;
    return template.replace(/\{\{(.+?)\}\}/g, (_, content) => {
        for (let i = 0; i < len; i++) {
            const key = keys[i];
            if (content.trim() === key) {
                return obj[key];
            }
        }
    });
}

function readAsyncFile(filePath) {
    return fs.readFileSync(filePath, "utf8");
}

function escapeChars(str) {
    // str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    // str = str.replace(/'/g, '&acute;');
    // str = str.replace(/"/g, '&quot;');
    // str = str.replace(/\|/g, '&brvbar;');
    return str;
}

function parseUrl(url) {
    const [urlPath, queryString] = url.split("?");
    const urlQuery = {};
    if (queryString) {
        const queryArr = queryString.split("&");
        queryArr.forEach(q => {
            const [qk, qv] = q.split("=");
            urlQuery[qk] = qv;
        });
    }
    return { urlPath, urlQuery };
}
