function download(path) {
    let link = document.createElement("a");
    link.setAttribute("href", path);
    link.setAttribute("download", "");
    link.click();
}

export default download;