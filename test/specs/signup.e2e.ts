import { expect, browser, $ } from "@wdio/globals";
import { registerUser } from "../register-user.ts";

describe("Register", () => {
  it("should register with valid information", async () => {
    await registerUser("John Doe", "johndoe@" + Date.now() + "example.com", "Abcd1234!");

    await browser.pause(5000);

    const firstDropdownToggle = await $(".dropdown-toggle");
    const firstDropdownToggleText = await firstDropdownToggle.getText();
    expect(firstDropdownToggleText).toContain("John Doe");

    // Déconnexion après le test
    await firstDropdownToggle.click();
    const dropdownButtons = await $$(".dropdown .dropdown-menu button");
    const logoutButton = dropdownButtons[dropdownButtons.length - 1];
    await logoutButton.click();
  });

  it("should not register with invalid information", async () => {
    await registerUser("John Doe", "", "Abcd1234!");

    $(".alert-danger").waitForExist({ timeout: 2000 });

    const alertDanger = await $(".alert-danger");
    const alertDangerText = await alertDanger.getText();
    expect(alertDangerText).toContain("L'e-mail et le mot de passe sont requis");
  });
});
