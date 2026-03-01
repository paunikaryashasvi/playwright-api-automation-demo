import { test, expect } from '@playwright/test';

// Mock test for GET /booking using browser-side fetch

test('Mocked [GET] Retrieve list of bookings', async ({ page }) => {
  await page.route('**/booking', async route => {
    // Mock response data
    const mockBookings = [
      { bookingid: 1 },
      { bookingid: 2 },
      { bookingid: 3 }
    ];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockBookings)
    });
  });

  // Use browser-side fetch to trigger the mocked request
  const data = await page.evaluate(async () => {
    const response = await fetch('https://restful-booker.herokuapp.com/booking');
    return await response.json();
  });

  expect(data.length).toBe(3);
  expect(data[0]).toHaveProperty('bookingid');
});

// Mock test for POST /booking

test('Mocked [POST] Create a booking', async ({ page }) => {
  await page.route('**/booking', async route => {
    if (route.request().method() === 'POST') {
      const mockResponse = {
        bookingid: 123,
        booking: {
          firstname: 'Test',
          lastname: 'User',
          totalprice: 100,
          depositpaid: true,
          bookingdates: {
            checkin: '2024-04-01',
            checkout: '2024-04-10'
          },
          additionalneeds: 'Lunch'
        }
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    } else {
      await route.continue();
    }
  });

  // Use browser-side fetch to trigger the mocked POST request
  const postData = {
    firstname: 'Test',
    lastname: 'User',
    totalprice: 100,
    depositpaid: true,
    bookingdates: {
      checkin: '2024-04-01',
      checkout: '2024-04-10'
    },
    additionalneeds: 'Lunch'
  };

  const data = await page.evaluate(async (postData) => {
    const response = await fetch('https://restful-booker.herokuapp.com/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return await response.json();
  }, postData);

  expect(data).toHaveProperty('bookingid');
  expect(data.booking.firstname).toBe('Test');
});
