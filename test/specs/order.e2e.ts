import { expect, browser, $ } from "@wdio/globals";
import registerUser from "../register-user.ts";
import addProductsToCart from "../add-products-to-cart.ts";

describe("Order", () => {
  // Ce test comporte plusieurs problèmes
  // 1. bug de l'app qui fait qu'on ne peut ajouter des items au panier que connecté
  // 2. composante aléatoire qui fait qu'on est pas sûr qu'un produit soit dispo
  it("should pass an order", async () => {
    await registerUser(
      "John Doe",
      "johndoe@" + Date.now() + "example.com",
      "Abcd1234!"
    );

    await addProductsToCart(3);

    // Cibler le dropdown panier (2ème dropdown);
    const dropdowns = await $$(".dropdown");
    const cartDropdown = dropdowns[1];
    // Ce que j'avais oublié hier :
    // Il faut cliquer sur le dropdown pour que les éléments à l'intérieur soient visibles !!
    await cartDropdown.click();
    const cartDropdownButtons = await cartDropdown.$$("button");

    // Le dernier bouton est le bouton de commande
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
    await browser.pause(3000);
  });
});
