window.onload = () => {
    const text1 = getElementById("diff-text-1").innerText;
    const text2 = getElementById("diff-text-2").innerText;
    const current = +getElementById("diff-file-current").innerText;
    const total = +getElementById("diff-file-total").innerText;

    // set page title
    document.title = `Code Diff - ${current}`;

    // add pc control
    addPcControl({ total, current });

    // add mobile control
    addMobileControl({ total, current });

    // diff and draw
    diffAndDraw({ text1, text2 });
};

function getElementById(id) {
    return document.getElementById(id);
}
