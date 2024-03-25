import { expect, browser, $ } from "@wdio/globals";

describe("Cart", () => {
  // Ce test comporte plusieurs problèmes
  // 1. bug de l'app qui fait qu'on ne peut ajouter des items au panier que connecté
  // 2. composante aléatoire qui fait qu'on est pas sûr qu'un produit soit dispo
  it("should add items to cart", async () => {
    // Debut cc -------
    await browser.url(`http://localhost:5173/compte/inscription`);

    await $("#inputFullName").setValue("John Doe");
    await $("#inputEmail").setValue("johndoe@" + Date.now() + "example.com");
    await $("#inputPassword").setValue("Abcd1234!");
    await $('button[type="submit"]').click();
    // Fin cc -------

    // Attente de l'affichage des div .card
    const firstCard = await $(".card");
    await firstCard.waitForDisplayed({ timeout: 1000 });

    // $   => document.querySelector
    // $$  => document.querySelectorAll
    // Récupération de toutes les .card
    const cards = await $$(".card");

    // Pour l'instant on n'a ajouté aucun produit
    // Variable qui permet de tracer le nombre de produits qu'on a vraiment réussi
    // à ajouter au panier
    let numInCart = 0;
    for (let i = 0; i < 3; i++) {
      const card = cards[i];
      const cardButton = await card.$("button");
      // intercepter une erreur au cas où le produit ne serait pas disponible
      // bouton Panier désactivé et donc non cliquable
      try {
        await cardButton.click();
        numInCart++;
      } catch (err) {
      }
    }

    // Cibler le dropdown panier (2ème dropdown);
    const dropdowns = await $$(".dropdown");
    const cartDropdown = dropdowns[1];
    const dropdownToggle = await cartDropdown.$(".dropdown-toggle");
    // await dropdownToggle.click();
    const dropdownToggleText = await dropdownToggle.getText();
    console.log(">> dropdown text", dropdownToggleText);

    // expect(dropdownToggleText).toContain(numInCart.toString());
    expect(dropdownToggleText).toEqual(`Panier${numInCart}`);
  });
});
