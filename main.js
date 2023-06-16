const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const url = require('url')

// This launches the app for URLs like this: specter://?param1=open&param2=custody
const isDefaultProtocolClient = app.isDefaultProtocolClient('specter')
if (!isDefaultProtocolClient) {
  app.setAsDefaultProtocolClient('specter')
}

// Global variables
let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    show: true,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  mainWindow.loadFile('index.html')

  // Load the CSS file
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8'))
  })
}

app.whenReady().then(() => {
  createWindow()
})

app.on('open-url', (_, data) => {
  // Parse the URL to extract the query parameters
  const urlObj = url.parse(data, true)
  console.log('urlObj', urlObj)
  const query = urlObj.query

  // Access the query parameters as key-value pairs
  const param1 = query['param1']
  const param2 = query['param2']

  // Do something with the query parameters
  if (param1 === 'open' && param2 === 'custody') {
    mainWindow.loadFile('custody.html')
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
