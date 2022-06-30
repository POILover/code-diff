window.onload = () => {
    const diffDom1 = document.getElementById("diff-text-1").innerText;
    const diffDom2 = document.getElementById("diff-text-2").innerText;
    // use Diff because diff2html can't get full file diff patch
    const diffLinesResult = Diff.diffLines(diffDom1, diffDom2);
    const linesDiffString =
        generateUnifiedHeader() + resolveDiffLinesResult(diffLinesResult);
    console.log(diffLinesResult, linesDiffString)
    const targetElement = document.getElementById("diff-ui");
    const configuration = {
        drawFileList: true,
        matching: "lines",
        highlight: true,
    };
    const diff2htmlUi = new Diff2HtmlUI(
        targetElement,
        linesDiffString,
        configuration
    );
    diff2htmlUi.draw();
    diff2htmlUi.highlightCode();
};

// funny that diff2html-ui chooses language from suffix of the file name to highlight code.
// unified diff patch header is also needed, see https://www.gnu.org/software/diffutils/manual/html_node/Unified-Format.html
function generateUnifiedHeader(fromFile="from.js", toFile="to.js") {
    return `--- ${fromFile}\n+++ ${toFile}\n@@ -1,86 +1,145 @@\n`;
}

// merge diff result as unified diff patch (full size)
// TODO: need debug
function resolveDiffLinesResult(diffLinesResult) {
    return diffLinesResult
        .map((item, itemIdx) => {
            let value = item.value;
            const valueArr = value.split("\n");
            const valueArrMaxIndex = valueArr.length - 1;
            if (item.added) {
                return valueArr
                    .map((v, vIdx) => (vIdx === valueArrMaxIndex ? v : (`+ ` + v)))
                    .join("\n");
            }
            if (item.removed) {
                return valueArr
                    .map((v, vIdx) => (vIdx === valueArrMaxIndex ? v : (`- ` + v)))
                    .join("\n");
            }
            return valueArr
                .map((v, vIdx) => ((vIdx === valueArrMaxIndex)&&itemIdx!==diffLinesResult.length-1 ? v : (`  ` + v)))
                .join("\n");
        })
        .join("");
}