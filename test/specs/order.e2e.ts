import { expect, browser, $ } from "@wdio/globals";

describe("Order", () => {
  // Ce test comporte plusieurs problèmes
  // 1. bug de l'app qui fait qu'on ne peut ajouter des items au panier que connecté
  // 2. composante aléatoire qui fait qu'on est pas sûr qu'un produit soit dispo
  it("should pass an order", async () => {
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
    for (let i = 0; i < 6; i++) {
      const card = cards[i];
      const cardButton = await card.$("button");
      // intercepter une erreur au cas où le produit ne serait pas disponible
      // bouton Panier désactivé et donc non cliquable
      try {
        await cardButton.click();
        numInCart++;
        console.log(">> added to cart, now has", numInCart, "items")
      } catch (err) {
      }
    }

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
    
    const submitBtn = $('button[type="submit"]')
    await submitBtn.click();
    await browser.pause(3000);
  });
});
