import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Guide to the Galaxies|tracker-app/i);
  await expect(page.locator("body")).toContainText(/Guide to the Galaxies/i);
});
