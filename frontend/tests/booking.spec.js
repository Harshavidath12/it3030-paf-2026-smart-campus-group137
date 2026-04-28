import { test, expect } from '@playwright/test';

test.describe('Booking Functionality', () => {

  test.beforeEach(async ({ page }) => {
    // Login before each test
    console.log('Logging in...');
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vidathharshitha85@gmail.com');
    await page.fill('input[name="password"]', 'Vidath@123');
    await page.click('button[type="submit"]');
    
    // Verify login was successful and redirected to home
    await expect(page).toHaveURL('http://localhost:5173/', { timeout: 10000 });
    console.log('Login successful');
  });

  test('User can create a new booking successfully', async ({ page }) => {
    console.log('Navigating to booking page...');
    // Navigate directly to the booking page with a resource ID
    await page.goto('/book?resourceId=1683');

    // Wait for the form to appear
    const heading = page.getByRole('heading', { name: /Request a New Booking/i });
    await expect(heading).toBeVisible({ timeout: 15000 });
    console.log('Booking page loaded');

    // Fill in a random future booking date to avoid conflicts (between 1 and 30 days from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
    const dateStr = futureDate.toISOString().split('T')[0];
    await page.fill('input[name="bookingDate"]', dateStr);

    // Select Start Time
    // MUI Selects can be tricky, click the label or the div
    await page.getByLabel('Start Time').click();
    await page.getByRole('option', { name: '9:00 AM' }).click();

    // Select End Time
    await page.getByLabel('End Time').click();
    await page.getByRole('option', { name: '10:00 AM' }).click();

    // Fill Purpose
    await page.fill('input[name="purpose"]', 'Playwright Automated Test Session');

    // Fill Expected Attendees
    await page.fill('input[name="expectedAttendees"]', '5');

    // Submit the booking request
    console.log('Submitting booking...');
    await page.getByRole('button', { name: /Submit Booking Request/i }).click();

    // Verify success redirect to /my-bookings
    await expect(page).toHaveURL(/.*\/my-bookings/, { timeout: 15000 });
    console.log('Redirected to my-bookings');
    
    // Check for success toast
    await expect(page.getByText('Booking created successfully!')).toBeVisible();
  });

  test('Booking form validation - required fields', async ({ page }) => {
    console.log('Testing validation...');
    await page.goto('/book?resourceId=1683'); // Use resourceId to avoid any 'no resource' issues

    // Wait for form
    await expect(page.getByRole('heading', { name: /Request a New Booking/i })).toBeVisible();

    // Try to submit without filling purpose or date
    await page.getByRole('button', { name: /Submit Booking Request/i }).click();

    // Check if we are still on the same page (submission should have been blocked)
    await expect(page).toHaveURL(/.*\/book/);
    
    // Verify that 'Purpose' field is still there and has 'required' attribute
    const purposeInput = page.locator('input[name="purpose"]');
    await expect(purposeInput).toHaveAttribute('required', '');
    console.log('Validation test passed');
  });

});
