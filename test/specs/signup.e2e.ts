import { expect, $ } from "@wdio/globals";
import registerUser from "../helpers/register-user.ts";

describe("Register", () => {
  it("should register with valid information", async () => {
    await registerUser("johndoe@" + Date.now() + "example.com");

    // On utilise l'id plutôt que la classe .dropdown
    // pour être sûr de récupérer le dropdown authentifié et pas le "invité"
    const authenticatedDropdown = await $("#authenticated-dropdown");
    await authenticatedDropdown.waitForDisplayed();

    // On récupère le .dropdown-toggle, pas n'importe lequel,
    // mais celui à l'intérieur de authenticatedDropdown
    const authenticatedDropdownToggle = await authenticatedDropdown.$(
      ".dropdown-toggle"
    );
    const toggleText = await authenticatedDropdownToggle.getText();
    expect(toggleText).toContain("John Doe");

    // Déconnexion après le test
    // Permet d'ouvrir le dropdown
    await authenticatedDropdownToggle.click();
    // const dropdownButtons = await $$(".dropdown .dropdown-menu button");
    // const logoutButton = dropdownButtons[dropdownButtons.length - 1];
    const logoutButton = await $(".signout-btn");
    await logoutButton.click();
  });

  it("should not register with invalid information", async () => {
    await registerUser("");

    $(".alert-danger").waitForExist({ timeout: 2000 });

    const alertDanger = await $(".alert-danger");
    const alertDangerText = await alertDanger.getText();
    expect(alertDangerText).toContain(
      "L'e-mail et le mot de passe sont requis"
    );
  });
});
