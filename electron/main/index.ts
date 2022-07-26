import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron'
import { release } from 'os'
import { join } from 'path'
import aria2 from './aria2'
// import devtools from '@vue/devtools'


// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
    // /dist
    dist: join(__dirname, '../..'),
    // /dist or /public
    public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: any;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
const indexHtml = join(ROOT_PATH.dist, 'index.html')

async function createWindow() {
    // 关闭默认标题栏
    Menu.setApplicationMenu(null)

    win = new BrowserWindow({
        title: '小莫网盘下载器',
        icon: join(ROOT_PATH.public, 'favicon.ico'),
        width: 800,
        height: 500,
        minWidth: 530,
        minHeight: 460,
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false
    })

    if (app.isPackaged) {
        win.loadFile(indexHtml)
    } else {
        win.loadURL(url)
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }: any) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })

    // 打开开发者工具
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools()


        require('electron-debug')({
            // devToolsMode: 'right',
            showDevTools: true
        })

        let installExtension = require('electron-devtools-installer')
        installExtension.default(installExtension.VUEJS_DEVTOOLS)
            .then(() => { })
            .catch((err: any) => {
                console.log('Unable to install `vue-devtools`: \n', err)
            })

    }

    // 启动 aria2
    await aria2.startAria2()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
        },
    })

    if (app.isPackaged) {
        childWindow.loadFile(indexHtml, { hash: arg })
    } else {
        childWindow.loadURL(`${url}/#${arg}`)
        // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
    }
})


// 窗口最小化
ipcMain.on('window-min', function () {
    if (win) {
        win.minimize();
    }
})
//窗口最大化
ipcMain.on('window-max', function () {
    if (win) {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize();
        }
    }
})
//关闭窗口
ipcMain.on('window-close', function () {
    if (win) {
        aria2.stopAria2();
        win.close();
    }
})

// 选择文件夹
ipcMain.handle('select-folder', (event, arg) => {
    const { dialog } = require('electron');
    let path = dialog.showOpenDialogSync({ title: "选择下载保存目录", properties: ['openDirectory', 'showHiddenFiles'] })
    return path
})

