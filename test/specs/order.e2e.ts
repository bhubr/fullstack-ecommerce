import { expect, browser, $ } from "@wdio/globals";
import addProductsToCart from "../helpers/add-products-to-cart.ts";
import registerUser from "../helpers/register-user.ts";
import waitForProducts from "../helpers/wait-for-products.ts";

// "Flow" passer une commande

// - Se connecter / créer un compte
// - Ajouter des produits au panier
// - Cliquer sur dropdown puis sur le dernier bouton du menu, "commander"
// - Remplir le formulaire
//   - adresse
//   - infos de paiement - CB
// - Cliquer sur "finaliser la commande"

describe("Order", () => {
  it("should pass an order", async () => {
    // ARRANGE
    await registerUser("johndoe@" + Date.now() + "example.com");
    await waitForProducts();

    // ACT
    await addProductsToCart();

    // Cibler le dropdown panier (2ème dropdown)
    const cartDropdown = await $("#cart-dropdown");
    // Ce que j'avais oublié hier :
    // Il faut cliquer sur le dropdown pour que les éléments à l'intérieur soient visibles !!
    await cartDropdown.click();
    // await browser.pause(5000);

    const cartDropdownButtons = await cartDropdown.$$("button");
    const orderButton = cartDropdownButtons[cartDropdownButtons.length - 1];
    await orderButton.click();

    await $("#address").setValue("1 place du Capitole");
    await $("#postalCode").setValue("31000");
    await $("#city").setValue("Toulouse");
    await $("#phone").setValue("0612345678");

    await $("#cardHolder").setValue("John Doe");
    await $("#cardNumber").setValue("1234 1234 1234 1234");
    await $("#cvv").setValue("123");
    // ATTENTION pourrait ne plus marcher dans le futur
    await $("#expiration").setValue("12/25");

    const submitBtn = $('button[type="submit"]');
    await submitBtn.click();
    await browser.pause(1000);

    // ASSERT
    // Récupérer la "bannière" indiquant que la commande a bien
    // été passée
    const alert = await $(".alert-success");
    await alert.waitForDisplayed();
    const alertText = await alert.getText();
    expect(alertText).toBe("Votre commande a été passée avec succès")

    // Cette assertion n'est pas forcément très utile
    const currentUrl = await browser.getUrl();
    expect(currentUrl).toMatch(/\/commandes\/\d{6}-\d{5}/);
    console.log(">>> url after order submit", currentUrl);
  });
});
