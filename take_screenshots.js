import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to http://localhost:5173/');
  await page.goto('http://localhost:5173/');
  
  // Wait for the app to load
  await page.waitForSelector('.app-title');

  // Go to Equations page using keyboard shortcut
  console.log('Pressing 7 to go to Equations page');
  await page.keyboard.press('7');
  
  // Wait for Equations panel to appear
  await page.waitForSelector('.panel-title');
  
  // Wait for the 3D scene to render
  await new Promise(r => setTimeout(r, 2000));
  
  // Screenshot 1: Initial state
  const ss1Path = path.join(__dirname, 'public/screenshots/23-day10-equations-initial.png');
  await page.screenshot({ path: ss1Path });
  console.log(`Saved ${ss1Path}`);
  
  // Change inputs to make it singular (e.g. det = 0)
  // Let's set row 2 equal to row 1
  // Row 1 inputs are indices 3, 4, 5
  // Row 0 inputs are indices 0, 1, 2
  // We'll just type '1', '1', '1' into row 2
  console.log('Changing inputs to create singular matrix');
  const inputs = await page.$$('.eq-coeff');
  // Row 2 is inputs 3, 4, 5
  
  // Clear and type into row 2
  for (let i = 3; i <= 5; i++) {
    await inputs[i].click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await inputs[i].type('1');
  }
  
  // Wait for React to process and scene to update
  await new Promise(r => setTimeout(r, 1000));
  
  // Screenshot 2: Singular state
  const ss2Path = path.join(__dirname, 'public/screenshots/24-day10-equations-singular.png');
  await page.screenshot({ path: ss2Path });
  console.log(`Saved ${ss2Path}`);
  
  // Screenshot 3: Open shortcuts overlay
  console.log('Pressing ? to open shortcut overlay');
  await page.keyboard.press('?');
  await new Promise(r => setTimeout(r, 1000));
  const ss3Path = path.join(__dirname, 'public/screenshots/25-day10-shortcut-overlay.png');
  await page.screenshot({ path: ss3Path });
  console.log(`Saved ${ss3Path}`);

  await browser.close();
})();
