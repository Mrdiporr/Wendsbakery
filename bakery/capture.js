const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport to mobile size
    await page.setViewport({ width: 400, height: 850, isMobile: true });
    
    console.log('Navigating to localhost:3000...');
    // Wait until there are no more than 0 network connections for at least 500 ms
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    console.log('Capturing PDF...');
    // Generate a long PDF based on the content height
    await page.pdf({ 
      path: 'C:\\Users\\TV\\Desktop\\wendysbakehouse\\Wendy_Bakehouse_Mobile_Preview.pdf', 
      printBackground: true,
      width: '400px',
      height: '1800px', // approximate height
      pageRanges: '1'
    });
    
    console.log('Capturing PNG...');
    // Generate a full-page PNG (often better for scrolling on a phone like a real website)
    await page.screenshot({ 
      path: 'C:\\Users\\TV\\Desktop\\wendysbakehouse\\Wendy_Bakehouse_Mobile_Preview.png', 
      fullPage: true 
    });

    await browser.close();
    console.log('Successfully generated preview files on Desktop/wendysbakehouse!');
  } catch (error) {
    console.error('Error generating preview:', error);
  }
})();
