export default async function signoutUser() {
  // On utilise l'id plutôt que la classe .dropdown
    // pour être sûr de récupérer le dropdown authentifié et pas le "invité"
    const authenticatedDropdown = await $("#authenticated-dropdown");
    await authenticatedDropdown.waitForDisplayed();

    // On récupère le .dropdown-toggle, pas n'importe lequel,
    // mais celui à l'intérieur de authenticatedDropdown
    const authenticatedDropdownToggle = await authenticatedDropdown.$(
      ".dropdown-toggle"
    );

    // Permet d'ouvrir le dropdown
    await authenticatedDropdownToggle.click();
    const logoutButton = await $(".signout-btn");
    await logoutButton.click();
}