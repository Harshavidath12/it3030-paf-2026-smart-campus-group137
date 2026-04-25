import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {

  test('User can sign up successfully', async ({ page }) => {
    // We use a unique email to avoid conflicts with existing users
    const uniqueEmail = `testuser_${Date.now()}@smartcampus.com`;

    await page.goto('/register');

    // Fill in the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'Test@123');

    // Submit
    await page.click('button[type="submit"]');

    // Expect to be redirected to login page after successful registration
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('User can login successfully', async ({ page }) => {
    await page.goto('/login');

    // Fill in the form with provided credentials
    await page.fill('input[name="email"]', 'vidathharshitha85@gmail.com');
    await page.fill('input[name="password"]', 'Vidath@123');

    // Submit
    await page.click('button[type="submit"]');

    // Based on the user role, wait for the redirect
    // Since vidathharshitha85@gmail.com has a USER role, it redirects to the home page (/)
    await expect(page).toHaveURL(/.*\//);

    // Verify home page loaded
    await expect(page.locator('h1')).toContainText('SMART CAMPUS', { ignoreCase: true });
  });

});
