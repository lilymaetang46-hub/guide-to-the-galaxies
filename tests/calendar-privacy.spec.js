import { test, expect } from "@playwright/test";

test("tracker calendar preview hides private period notes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1600 });
  await page.goto("/dev/cards-preview");

  const selectedDaySection = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Selected Day" }) });

  await expect(selectedDaySection.getByText("Period day 1")).toBeVisible();
  await expect(selectedDaySection.getByText("medium flow")).toBeVisible();
  await expect(selectedDaySection.getByText("Heating pad helped in the evening.")).toHaveCount(0);
});
