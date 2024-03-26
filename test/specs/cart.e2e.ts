import { expect, browser, $ } from "@wdio/globals";
import registerUser from "../register-user.ts";
import addProductsToCart from "../add-products-to-cart.ts";

describe("Cart", () => {
  // Ce test comporte plusieurs problèmes
  // 1. bug de l'app qui fait qu'on ne peut ajouter des items au panier que connecté
  // 2. composante aléatoire qui fait qu'on est pas sûr qu'un produit soit dispo
  it("should add items to cart", async () => {
    await registerUser(
      "John Doe",
      "johndoe@" + Date.now() + "example.com",
      "Abcd1234!"
    );
    const numInCart = await addProductsToCart(3);

    await browser.pause(15000);

    // Cibler le dropdown panier (2ème dropdown);
    const cartDropdown = await $("#cart-dropdown")
    await cartDropdown.waitForExist();
    // Bouton "toggle" pour ouvrir le dropdown
    const dropdownToggle = await cartDropdown.$(".dropdown-toggle");
    const dropdownToggleText = await dropdownToggle.getText();

    // Le bouton toggle contient "Panier" et une "pill" (badge) avec le nombre d'items
    // Le contenu texte (attribut `textContent`) de la balise .dropdown-toggle doit être "Panier" suivi du nombre d'items.
    expect(dropdownToggleText).toEqual(`Panier${numInCart}`);
  });
});
