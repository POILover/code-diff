function diffAndDraw({ text1, text2 }) {
    // Diff and draw
    // use Diff because diff2html can't get full file diff patch
    const diffLinesResult = Diff.diffLines(text1, text2);
    const linesDiffString = generateUnifiedHeader() + resolveDiffLinesResult(diffLinesResult);
    const targetElement = getElementById("diff-ui");
    const configuration = {
        drawFileList: false,
        matching: "lines",
        highlight: true,
    };
    const diff2htmlUi = new Diff2HtmlUI(targetElement, linesDiffString, configuration);
    diff2htmlUi.draw();
    // TODO: highlight diy
    diff2htmlUi.highlightCode();
}

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
 * 2. if there is no '\n' in the end, like '   ddd\n</script>',
 *    we can consider it as the last line of file.
 *    If no change, seems add '  ' is enough,
 *    But if change, there will be two values which have no '\n' in the end, so a '\n' is needed to add at the former one to make two lines in html.
 *    Simply we can always add a '\n' after the both string in such situation.
 *
 */
function resolveDiffLinesResult(diffLinesResult) {
    return diffLinesResult
        .map(item => {
            const prefix = item.added ? "+ " : item.removed ? "- " : "  ";
            const valueArr = item.value.split("\n");
            const valueArrLastStr = valueArr[valueArr.length - 1];
            if (!valueArrLastStr.length) {
                valueArr.pop(); // delete tail's blank item.
            }
            return valueArr.map(v => `${prefix}${v}\n`).join("");
        })
        .join("");
}
