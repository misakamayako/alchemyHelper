// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  queryAll(query) {
    ipcRenderer.send("queryAll", query);
    return new Promise((resolve) => {
      ipcRenderer.once("queryAllReply", (event, args) => {
        resolve(args);
      });
    });
  },
  getAllMaterial() {
    ipcRenderer.send("getAllMaterial");
    return new Promise((resolve) => {
      ipcRenderer.once("getAllMaterialReply", (event, args) => {
        resolve(args);
      });
    });
  },
  minimize() {
    ipcRenderer.send("minimize");
  },
  close() {
    ipcRenderer.send("close");
  },
  getCreatePath(id) {
    ipcRenderer.send("getCreatePath", id);
    return new Promise((resolve) => {
      ipcRenderer.once("gotCreatePath", (event, args) => {
        resolve(args);
      });
    });
  },
});
ipcRenderer.on("resize", () => {
  console.log("sdf");
  window.windowChange ? window.windowChange() : null;
});
