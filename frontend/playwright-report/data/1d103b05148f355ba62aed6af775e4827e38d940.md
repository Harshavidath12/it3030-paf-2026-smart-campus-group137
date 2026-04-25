# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication Flows >> User can sign up successfully
- Location: tests\auth.spec.js:5:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/register
Call log:
  - navigating to "http://localhost:5173/register", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication Flows', () => {
  4  | 
  5  |   test('User can sign up successfully', async ({ page }) => {
  6  |     // We use a unique email to avoid conflicts with existing users
  7  |     const uniqueEmail = `testuser_${Date.now()}@smartcampus.com`;
  8  | 
> 9  |     await page.goto('/register');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/register
  10 | 
  11 |     // Fill in the form
  12 |     await page.fill('input[name="name"]', 'Test User');
  13 |     await page.fill('input[name="email"]', uniqueEmail);
  14 |     await page.fill('input[name="password"]', 'Test@123');
  15 | 
  16 |     // Submit
  17 |     await page.click('button[type="submit"]');
  18 | 
  19 |     // Expect to be redirected to login page after successful registration
  20 |     await expect(page).toHaveURL(/.*\/login/);
  21 |   });
  22 | 
  23 |   test('User can login successfully', async ({ page }) => {
  24 |     await page.goto('/login');
  25 | 
  26 |     // Fill in the form with provided credentials
  27 |     await page.fill('input[name="email"]', 'vidathharshitha85@gmail.com');
  28 |     await page.fill('input[name="password"]', 'Vidath@123');
  29 | 
  30 |     // Submit
  31 |     await page.click('button[type="submit"]');
  32 | 
  33 |     // Based on the user role, wait for the redirect
  34 |     // Since vidathharshitha85@gmail.com has a USER role, it redirects to the home page (/)
  35 |     await expect(page).toHaveURL(/.*\//);
  36 | 
  37 |     // Verify home page loaded
  38 |     await expect(page.locator('h1')).toContainText('SMART CAMPUS', { ignoreCase: true });
  39 |   });
  40 | 
  41 | });
  42 | 
```