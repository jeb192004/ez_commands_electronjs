const { contextBridge, ipcRenderer, clipboard } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.version.chrome,
  electron: () => process.versions.electron,
  close_app: () => ipcRenderer.invoke('close_app'),
  load_commands: (val) => ipcRenderer.invoke('load_commands', val),
  save_commands: (val) => ipcRenderer.invoke('save_commands', val),
  // we can also expose variables, not just functions
})