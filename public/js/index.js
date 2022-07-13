window.onload = () => {
    const text1 = getElementById("diff-text-1").innerText;
    const text2 = getElementById("diff-text-2").innerText;
    const current = +getElementById("diff-file-current").innerText;
    const total = +getElementById("diff-file-total").innerText;

    // set page title
    document.title = `Code Diff - ${current}`;

    // TODO: control logic, throttle, UE
    window.addEventListener("mouseover", e => {
        let flag = true;
        if (flag) {
            setTimeout(() => {
                // middle-hover
                // const thresY = 300;
                // const windowHeight = window.innerHeight;
                // const mouseY = e.clientY;
                // const yTop = (windowHeight - thresY) / 2;
                // const yBottom = (windowHeight + thresY) / 2;
                // if (mouseY < yBottom && mouseY > yTop) {
                //     document.querySelectorAll(".ctrl-icon").forEach(dom => {
                //         dom.style.display = "block";
                //     });
                // } else {
                //     document.querySelectorAll(".ctrl-icon").forEach(dom => {
                //         dom.style.display = "none";
                //     });
                // }

                // side-hover
                const thresX = 200;
                const xLeft = thresX;
                const bodyWidth = document.body.clientWidth;
                const mouseX = e.clientX;
                const xRight = bodyWidth - thresX;
                if (mouseX < xLeft || (mouseX > xRight && mouseX < bodyWidth)) {
                    document.querySelectorAll(".ctrl-icon").forEach(dom => {
                        dom.style["background-color"] = "rgba(127, 127, 127, 0.1)";
                    });
                } else {
                    document.querySelectorAll(".ctrl-icon").forEach(dom => {
                        dom.style["background-color"] = "rgba(127, 127, 127, 0)";
                    });
                }
                flag = true;
            }, 100);
            flag = false;
        }
    });

    // set prev and next link attribute
    const prevDom = getElementById("prev-btn");
    const nextDom = getElementById("next-btn");
    if (current === 1) {
        prevDom.style.display = "none";
        prevDom.setAttribute("disabled", `true`);
    } else {
        prevDom.style.display = "inline";
        prevDom.setAttribute("href", `/index?page=${current - 1}`);
    }
    if (current === total) {
        nextDom.style.display = "none";
        nextDom.setAttribute("disabled", `true`);
    } else {
        nextDom.style.display = "inline";
        nextDom.setAttribute("href", `/index?page=${current + 1}`);
    }

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
};

function getElementById(id) {
    return document.getElementById(id);
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

function throttle(fn, delay) {
    let flag = true;
    return function () {
        if (flag) {
            setTimeout(() => {
                fn.call(this);
                flag = true;
            }, delay);
            flag = false;
        }
    };
}
