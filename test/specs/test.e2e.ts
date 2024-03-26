import { expect, browser, $ } from "@wdio/globals";

xdescribe("My Login application", () => {
  it("should login with valid credentials", async () => {
    // "Pattern" AAA (Arrange, Act, Assert)

    // Arrange => visiter la page de login
    await browser.url(`https://the-internet.herokuapp.com/login`);

    // Act => remplir les champs et cliquer sur le bouton
    // await $('#username').setValue('tomsmith')
    await $('input[name="username"]').setValue("tomsmith");
    await $("#password").setValue("SuperSecretPassword!");
    await $('button[type="submit"]').click();

    await browser.pause(5000);

    // Assertions => vérifier que le message de succès est affiché
    await expect($("#flash")).toBeExisting();
    await expect($("#flash")).toHaveTextContaining(
      "You logged into a secure area!"
    );
  });

  it("should NOT login with invalid credentials", async () => {
    // "Pattern" AAA (Arrange, Act, Assert)

    // Arrange => visiter la page de login
    await browser.url(`https://the-internet.herokuapp.com/login`);

    // Act => remplir les champs et cliquer sur le bouton
    // await $('#username').setValue('tomsmith')
    await $('input[name="username"]').setValue("admin");
    await $("#password").setValue("SuperSecretPassword!");
    await $('button[type="submit"]').click();

    await browser.pause(5000);

    // Assertions => vérifier que le message de succès est affiché
    await expect($("#flash")).toBeExisting();
    await expect($("#flash")).toHaveTextContaining(
      "Your username is invalid!"
    );
  });
});
