import { expect, browser, $ } from "@wdio/globals";

describe("Register", () => {
  it("should register with valid information", async () => {
    await browser.url(`http://localhost:5173/compte/inscription`);

    const inputFullName = await $("#inputFullName");
    await inputFullName.waitForDisplayed();

    await $("#inputFullName").setValue("John Doe");
    await $("#inputEmail").setValue("johndoe@" + Date.now() + "example.com");
    await $("#inputPassword").setValue("Abcd1234!");
    await $('button[type="submit"]').click();

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
    await browser.url(`http://localhost:5173/compte/inscription`);

    await $("#inputFullName").setValue("John Doe");
    await $("#inputPassword").setValue("Abcd1234!");

    await $('button[type="submit"]').click();

    $(".alert-danger").waitForExist({ timeout: 2000 });

    const alertDanger = await $(".alert-danger");
    const alertDangerText = await alertDanger.getText();
    expect(alertDangerText).toContain(
      "L'e-mail et le mot de passe sont requis"
    );
  });
});
