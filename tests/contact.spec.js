const { test, expect } = require('@playwright/test');

// Update BASE to your local dev server if needed (e.g., http://localhost:3000)
const BASE = process.env.BASE_URL || 'http://localhost:8080';

test.describe('Contact form accessibility and submission', () => {
  test('form fields have proper ARIA attributes and errors appear', async ({ page }) => {
    // Capture page console for debugging
    page.on('console', msg => console.log('PAGE LOG>', msg.text()));
    await page.goto(BASE + '/index.html');
    await expect(page.locator('#contactForm')).toBeVisible();

    // Ensure aria-describedby present
    await expect(page.locator('#fullName')).toHaveAttribute('aria-describedby', 'nameError');

    // Submit empty form -> should show errors
    await page.click('#submitButton');
    await expect(page.locator('#nameError')).not.toBeEmpty();
    await expect(page.locator('#emailError')).not.toBeEmpty();

    // Fill minimal valid data
    await page.fill('#fullName', 'QA Tester');
    await page.fill('#email', 'tester@example.com');
    await page.fill('#phone', '+1234567890');
    await page.fill('#company', 'Test Co');
    await page.fill('#message', 'Testing automated submission.');

    // Intercept network to simulate success
    await page.route('**/api/contacts', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }));

    await page.click('#submitButton');
    await expect(page.locator('#formStatus')).toHaveText(/Message sent successfully/i, { timeout: 5000 });
  });
});
