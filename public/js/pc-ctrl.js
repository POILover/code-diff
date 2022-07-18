function addPcControl({ total, current }) {
    const prevDom = getElementById("pc-prev-btn");
    const nextDom = getElementById("pc-next-btn");

    // add keyboard control
    document.body.addEventListener("keydown", e => {
        const { ctrlKey, code } = e;
        if (ctrlKey && (code === "ArrowLeft" || code === "ArrowRight")) {
            // NOTE: this logic is coupling with *Dom.display, TODO: need to refactor
            if (code === "ArrowLeft") {
                if (prevDom && prevDom.display !== "none") {
                    prevDom.click();
                }
            } else {
                if (nextDom && nextDom.display !== "none") {
                    nextDom.click();
                }
            }
        }
    });

    // TODO: control logic, throttle, UE
    // window.addEventListener("mouseover", e => {
    //     let flag = true;
    //     if (flag) {
    //         setTimeout(() => {
    //             // middle-hover
    //             // const thresY = 300;
    //             // const windowHeight = window.innerHeight;
    //             // const mouseY = e.clientY;
    //             // const yTop = (windowHeight - thresY) / 2;
    //             // const yBottom = (windowHeight + thresY) / 2;
    //             // if (mouseY < yBottom && mouseY > yTop) {
    //             //     document.querySelectorAll(".pc-ctrl-icon").forEach(dom => {
    //             //         dom.style.display = "block";
    //             //     });
    //             // } else {
    //             //     document.querySelectorAll(".pc-ctrl-icon").forEach(dom => {
    //             //         dom.style.display = "none";
    //             //     });
    //             // }

    //             // side-hover
    //             const thresX = 200;
    //             const xLeft = thresX;
    //             const bodyWidth = document.body.clientWidth;
    //             const mouseX = e.clientX;
    //             const xRight = bodyWidth - thresX;
    //             if (mouseX < xLeft || (mouseX > xRight && mouseX < bodyWidth)) {
    //                 document.querySelectorAll(".pc-ctrl-icon").forEach(dom => {
    //                     dom.style["background-color"] = "var(--ctrlColor)";
    //                 });
    //             } else {
    //                 document.querySelectorAll(".pc-ctrl-icon").forEach(dom => {
    //                     dom.style["background-color"] = "var(--ctrlHideColor)";
    //                 });
    //             }
    //             flag = true;
    //         }, 100);
    //         flag = false;
    //     }
    // });

    // set prev and next link attribute
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
}
