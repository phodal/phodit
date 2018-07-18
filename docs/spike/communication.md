Electron 通讯
---

[Electron 文档](https://electronjs.org/docs/api/ipc-main)

## [发送消息](https://electronjs.org/docs/api/ipc-main#%E5%8F%91%E9%80%81%E6%B6%88%E6%81%AF)

当然也有可能从主进程向渲染进程发送消息，查阅webContents.send 获取更多信息。

*   发送消息时，事件名称为`channel`。
*   回复同步信息时，需要设置`event.returnValue`。
*   将异步消息发送回发件人，需要使用`event.sender.send(...)`。

下面是在渲染和主进程之间发送和处理消息的一个例子：

```javascript
// 在主进程中.
const {ipcMain} = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})
```
  
```javascript
//在渲染器进程 (网页) 中。
const {ipcRenderer} = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
```
