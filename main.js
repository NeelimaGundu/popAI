require('dotenv').config();
// Importing modules
const { app, BrowserWindow, ipcMain, globalShortcut} = require('electron');

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
    }
  })

  win.loadFile('index.html')
}

// Calling your function when the app is ready
app.whenReady().then(() => {
  createWindow();

  const ret = globalShortcut.register('CommandOrControl+Shift+Space', () => {
    console.log("Global Shortcut CommandOrControl+Shift+Space Pressed!");

    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });

  if (!ret) {
    console.log('Registration failed! The hotkey might be used by another app.');
  }

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
