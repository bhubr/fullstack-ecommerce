import { expect, $ } from "@wdio/globals";
import registerUser from "../register-user.ts";

describe("Register", () => {
  it("should register with valid information", async () => {
    await registerUser(
      "John Doe",
      "johndoe@" + Date.now() + "example.com",
      "Abcd1234!"
    );

    // await browser.pause(1000);

    // Utiliser le sélecteur '.dropdown' n'est pas fiable ici, car entre les modes invité et authentifié,
    // on a un dropdown au même endroit, mais avec un contenu différent.
    // Ici on utilise un sélecteur plus spécifique pour le dropdown "authentifié".
    const authenticatedDropdown = await $("#authenticated-dropdown");
    await authenticatedDropdown.waitForExist();
    const dropdownText = await authenticatedDropdown.getText();
    expect(dropdownText).toContain("John Doe");

    // Déconnexion après le test
    // Récupération du bouton "toggle" pour ouvrir le dropdown
    const authenticatedDropdownToggle = await authenticatedDropdown.$(".dropdown-toggle");
    await authenticatedDropdownToggle.click();
    // Récupération de la liste des boutons dans le menu du dropdown
    const dropdownButtons = await authenticatedDropdown.$$(".dropdown-menu button");
    // Le bouton de déconnexion est le dernier de la liste
    const logoutButton = dropdownButtons[dropdownButtons.length - 1];
    await logoutButton.click();
  });

  it("should not register with invalid information", async () => {
    await registerUser("John Doe", "", "Abcd1234!");

    const alert = await $(".alert-danger");
    await alert.waitForExist();
    const alertText = await alert.getText();
    expect(alertText).toContain(
      "L'e-mail et le mot de passe sont requis"
    );
  });
});
