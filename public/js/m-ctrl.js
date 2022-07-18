function addMobileControl({ total, current }) {
    // set prev and next link attribute
    const prevDom = getElementById("m-prev-btn");
    const nextDom = getElementById("m-next-btn");
    if (current === 1) {
        prevDom.setAttribute("disabled", `true`);
    } else {
        prevDom.style.display = "inline";
        prevDom.setAttribute("href", `/index?page=${current - 1}`);
    }
    if (current === total) {
        nextDom.setAttribute("disabled", `true`);
    } else {
        nextDom.style.display = "inline";
        nextDom.setAttribute("href", `/index?page=${current + 1}`);
    }
}
