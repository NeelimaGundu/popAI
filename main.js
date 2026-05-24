require('dotenv').config();
// Importing modules
const { app, BrowserWindow, ipcMain, globalShortcut, screen} = require('electron');

// Import ai.js
const askAI = require('./ai');

let win;

//  Writing a reusable function to instantiate windows
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    alwaysOnTop: true,
    frame: false,
    show: false
  })

  win.loadFile('index.html')
}

// Calling your function when the app is ready
app.whenReady().then(() => {
  createWindow();

  const ret = globalShortcut.register('CommandOrControl+Shift+P', () => {
    console.log('CommandOrControl+Shift+P is pressed');
  if (win.isVisible()) {
    win.hide();
  } else {
    // Clean, fixed pixel placement coordinates
      const targetX = 1050; 
      const targetY = 550;  

      win.setPosition(targetX, targetY);
      win.show();
      win.focus();

      win.webContents.focus();
  }
  });

  if (!ret) {
    console.log('Registration failed! The hotkey might be used by another app.');
  }

  win.on('focus', () => {
    globalShortcut.register('Escape', () => {
      if (win && win.isVisible()) {
        win.hide();
      }
    });
  });

  win.on('blur', () => {
    if (win) {
      win.hide();
    }
  });

  win.on('blur', () => {
    globalShortcut.unregister('Escape');
  });

  win.setVisibleOnAllWorkspaces(true, { visibleOnAllWorkspaces: true });

  win.setAlwaysOnTop(true, 'screen-saver');

  // Open a window if none are open (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

ipcMain.handle("ask-ai", async (event, question) => {
  console.log("Handler triggered! Received question:", question);
  try {
    const answer = await askAI(question);
    return answer;
  } catch (error) {
    console.error("CRITICAL ERROR INSIDE askAI FUNCTION:", error.message);
    return "Error generating response.";
  }
});

if (process.platform === 'darwin') {
  app.dock.hide();
} // Hide the dock icon on macOS
