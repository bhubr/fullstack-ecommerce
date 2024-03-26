export default async function addProductsToCart(productsCount: number = 3): Promise<number> {
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
  for (let i = 0; i < productsCount; i++) {
    const card = cards[i];
    const cardButton = await card.$("button");
    // intercepter une erreur au cas où le produit ne serait pas disponible
    // bouton Panier désactivé et donc non cliquable
    try {
      await cardButton.click();
      // Petite attente pour laisser le temps au panier d'être mis à jour sur le serveur
      await browser.pause(500);
      numInCart++;
      console.log(">> added to cart, now has", numInCart, "items");
    } catch (err) {}
  }
  return numInCart;
}
