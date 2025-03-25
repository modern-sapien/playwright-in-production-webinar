import { test, expect } from '@playwright/test';
import fs from 'fs';

test('Checkly Doc Crawler', async ({ page }) => { 
    // Visit the page
    await page.goto('https://www.checklyhq.com/docs/cli/');
    
    // Extract text content
    const content = await page.evaluate(() => document.body.innerText);
    
    // Save to a text file
    fs.writeFileSync('knowledgebase/checkly_docs.txt', content, 'utf8');
    
    console.log('Content saved to checkly_docs.txt');
});
