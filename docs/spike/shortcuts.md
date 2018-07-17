快捷键
===

https://electronjs.org/docs/tutorial/keyboard-shortcuts


菜单
---

```javascript
const {Menu, MenuItem} = require('electron')
const menu = new Menu()

menu.append(new MenuItem({
  label: 'Print',
  accelerator: 'CmdOrCtrl+P',
  click: () => { console.log('time to print stuff') }
}))
```

全局
---

```
const {app, globalShortcut} = require('electron')
  
app.on('ready', () => {
  globalShortcut.register('CommandOrControl+X', () => {
    console.log('CommandOrControl+X is pressed')
  })
})
```

BrowserWindow
---

[Mousetrap](https://github.com/ccampbell/mousetrap)

```javascript
//  gmail 风格序列
Mousetrap.bind('g i', () => { console.log('go to inbox') })
Mousetrap.bind('* a', () => { console.log('select all') })

// konami 代码
Mousetrap.bind('up up down down left right left right b a enter', () => {
  console.log('konami code')
})
```

