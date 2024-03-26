import { expect, browser, $ } from "@wdio/globals";
import addProductsToCart from "../helpers/add-products-to-cart.ts";

import registerUser from "../helpers/register-user.ts";
import signoutUser from "../helpers/signout-user.ts";
import waitForProducts from "../helpers/wait-for-products.ts";

describe("Cart", () => {
  // Ce test comporte plusieurs problèmes
  // 1. bug de l'app qui fait qu'on ne peut ajouter des items au panier que connecté
  //    CORRIGÉ si vous avez mergé la dernière version de main
  // 2. composante aléatoire qui fait qu'on est pas sûr qu'un produit soit dispo
  it("user connected - should add items to cart", async () => {
    // ARRANGE => Setup avant les actions

    // Inscription/connexion
    await registerUser("johndoe@" + Date.now() + "example.com");

    // Attente de l'affichage des div .card
    // (dans le signup on était dans un formulaire, quand on le valide
    // on est redirigés vers l'accueil)
    await waitForProducts();

    // ACT
    // Appelle le helper permettant d'ajouter des produits au panier
    // Le helper renvoie le nombre d'items qu'il a réussi à ajouter
    const numInCart = await addProductsToCart();

    // Cibler le dropdown panier (2ème dropdown);
    const dropdowns = await $$(".dropdown");
    const cartDropdown = dropdowns[1];
    const dropdownToggle = await cartDropdown.$(".dropdown-toggle");
    // await dropdownToggle.click();
    const dropdownToggleText = await dropdownToggle.getText();
    console.log(">> dropdown text", dropdownToggleText);

    // ASSERT

    // expect(dropdownToggleText).toContain(numInCart.toString());
    expect(dropdownToggleText).toEqual(`Panier${numInCart}`);

    // DECONNECTER l'utilisateur après le test
    await signoutUser();
  });

  // Différence avec test précédent : on a supprimé les parties
  // incription/connexion et déconnexion
  it("user not connected - should add items to cart", async () => {
    // ARRANGE => Setup avant les actions
    // Va sur la page d'accueil
    await browser.url("http://localhost:5173");

    // Attente de l'affichage des div .card
    await waitForProducts();

    // ACT
    // Appelle le helper permettant d'ajouter des produits au panier
    const numInCart = await addProductsToCart();

    // Cibler le dropdown panier (2ème dropdown);
    const dropdowns = await $$(".dropdown");
    const cartDropdown = dropdowns[1];
    const dropdownToggle = await cartDropdown.$(".dropdown-toggle");
    // await dropdownToggle.click();
    const dropdownToggleText = await dropdownToggle.getText();
    console.log(">> dropdown text", dropdownToggleText);

    // ASSERT

    // expect(dropdownToggleText).toContain(numInCart.toString());
    expect(dropdownToggleText).toEqual(`Panier${numInCart}`);
  });
});
