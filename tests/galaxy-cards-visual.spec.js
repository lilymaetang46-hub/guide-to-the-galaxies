import { test, expect } from "@playwright/test";

test("support-style galaxy cards render in the shared preview path", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1567, height: 779 });
  await page.goto("/dev/cards-preview");

  await expect(page.getByText("Support Inbox")).toBeVisible();
  await expect(page.getByText("Recent Nudges")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Period" })).toBeVisible();
  await expect(page.getByText("Cycle history")).toBeVisible();

  await page.screenshot({
    path: testInfo.outputPath("galaxy-cards-preview.png"),
    fullPage: true,
  });
});
