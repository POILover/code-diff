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
// unified diff patch header is also needed, see also https://www.gnu.org/software/diffutils/manual/html_node/Unified-Format.html
function generateUnifiedHeader(fromFile = "from.js", toFile = "to.js") {
    return `--- ${fromFile}\n+++ ${toFile}\n@@ -1,86 +1,145 @@\n`;
}


/**
 * 
 * @param { DiffArray } diffLinesResult 
 * @returns { String } unified diff patch
 * @description
 * merge diff result as unified diff patch (full size)
 * 
 * merge rules
 * 
 * 1. for common value, like '  aaa\n  bbbb\n  ccc\n',
 *    every piece of value before '\n' needs add '+ ' if added, '- ' if removed, '  ' if no change.
 * 
 * 2. if there is no '\n' in value, like '</script>', 
 *    we can consider it as the last line of file.
 *    If no change, seems add '  ' is enough,
 *    But if has change, like we will see two values which have no '\n', so a '\n' is needed to add at the former one to make two lines.
 *    Simply we can always add a '\n' after the string in such situation.
 * 
 * So the common rule seems like splitValueArrayLength===1 ? prefix + value + '\n' : prefix + splitStr + '\n'
 * 
 */
function resolveDiffLinesResult(diffLinesResult) {
    return diffLinesResult
        .map((item) => {
            let value = item.value;
            const valueArr = value.split("\n");
            valueArr.pop(); //delete tail's blank item, if last line, valueArr will contain nothing.
            const prefix = item.added ? "+ " : item.removed ? "- " : "  ";
            if (valueArr.length===0) {
                // last line
                return `${prefix}${value}\n`;
            } else {
                // not last line
                return valueArr
                    .map(v => `${prefix}${v}\n`)
                    .join("");
            }
        })
        .join("");
}