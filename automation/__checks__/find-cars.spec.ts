import { expect, test } from '@playwright/test';

 // Set cookies before navigation
 const cookieString = 'TS018f14b1=015c8fe40e32fb396664ce467fb404e8c90853ea21140293aec110a3ad029da84627aa0ab55a5a5112a768b0ca466453bc967e0ee8; _sp_enable_dfp_personalized_ads=false; _sp_su=false; TS019b5c0d=015c8fe40eeb33757ec7cac40b08dfe648602be91bd00159583fd92262394e3edae37ce6af3237928ab5a7be47c949c1719d13495b; TS66c34ba1027=08e5e65cc0ab2000b38e982be574010cdeae36be21b9be6959b0a90109c16a0428f5fd42465f4f3408ea257348113000e22b0055924747661d5e52f274570d47f3fa363e909c8562ecdc121aad4f8462be557a8051cd34b88c335cdc957560b0; euconsent-v2=CQO03QAQO03QAAGABBENBiFgAAAAAAAAACRQAAAAAAAA.YAAAAAAAAAAA; consentUUID=2afc1edd-aafb-4b49-9718-e7561c10a2b9_42; consentDate=2025-03-25T14:43:29.332Z';

test('test', async ({ page, context }) => {
  
  const cookies = cookieString.split(';').map(pair => {
    const [name, value] = pair.trim().split('=');
    return { name, value, domain: '.autobazar.eu', path: '/' };
  });

  const clickAway = page.getByText('Čo dnes hľadáte?')

  await context.addCookies(cookies);

  await page.goto('https://www.autobazar.eu/');

  // Find the car brand
  await page.getByRole('button', { name: 'Značka' }).click();
  await page.getByRole('textbox', { name: 'Hľadať značku' }).click();
  await page.getByRole('textbox', { name: 'Hľadať značku' }).fill('Volvo');
  await page.getByRole('option', { name: /Volvo/ }).click();
  await page.getByRole('button', { name: 'Potvrdiť' }).click();
  await clickAway.click();
  await page.waitForTimeout(2000);
  await clickAway.click();

  // Find and click XC90
  await page.getByText(/Všetky modely/).first().click();
  await page.getByText(/XC90/).first().click();
  await page.getByRole('button', { name: 'Potvrdiť' }).click();
  
  // select price and km range
  await page.locator('select[name="priceTo"]').selectOption('60000');
  await page.waitForTimeout(3000);
  
  await page.getByPlaceholder('Km do').fill('100000');
  await page.waitForTimeout(3000);
  
  await page.getByRole('button', { name: 'Zobraziť výsledky:' }).click();
  await page.getByRole('button', { name: /Potvrdiť/ }).click();

  // Get all car listings
  const cars = await page.evaluate(() => {
    const carElements = document.querySelectorAll('.relative.flex.min-h-\\[122px\\]');
    return Array.from(carElements).map(car => {
      // Extract price
      const priceElement = car.querySelector('.text-\\[20px\\].font-semibold');
      const price = priceElement?.textContent?.trim() || '';

      // Extract model
      const modelElement = car.querySelector('.short-text-dots');
      const model = modelElement?.textContent?.trim() || '';

      // Extract link
      const linkElement = car.querySelector('a[target="_blank"]') as HTMLAnchorElement;
      const link = linkElement?.href || '';

      // Extract main photo
      const photoElement = car.querySelector('img[alt*="Volvo"]') as HTMLImageElement;
      const photo = photoElement?.src || '';

      return {
        price,
        model,
        link,
        photo
      };
    });
  });

  // Write results to a JSON file
  const fs = require('fs');
  await fs.promises.writeFile('cars.json', JSON.stringify(cars, null, 2));

  // Log the results to verify data is being collected
  console.log('Found cars:', cars.length);
  console.log('Data:', cars);
});