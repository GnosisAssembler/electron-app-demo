const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const contextMenu = require('electron-context-menu');

// Handle setup events as quickly as possible
const setupEvents = require('../installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
	// squirrel event handled and app will exit in 1000ms, so don't do anything else
	return;
}

// Declare main window in the global scope, so that it will not get garbage collected
let mainWindow = null;

function createWindow() {
	// create the browser window but not display it yet
	mainWindow = new BrowserWindow({
		width: 1350,
		height: 800,
		icon: path.join(__dirname + '../../assets/icons/icon.png'),
		webPreferences: {
			nodeIntegration: true, // allow node api intergration
			contextIsolation: false, // dont run Electron APIs in a seperate Javascript context
			enableRemoteModule: true, // enable remote module
			//devTools: false,
			toolbar: false,
		},
		show: false,
	});

	// load the html file in the main window
	mainWindow.loadFile(`${__dirname}/views/index.html`);

	// display main window only when it's ready (with html loaded),
	// to avoid the small delay at the window opening
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});
	contextMenu({
		prepend: (params, browserWindow) => [],
	});

	// open devtools
	mainWindow.webContents.openDevTools();

	// close main window
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

// creates a new browser window only if when the application has
// no visible windows after being activated. For example, after
// launching the application for the first time, or re-launching the
// already running application.
app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

