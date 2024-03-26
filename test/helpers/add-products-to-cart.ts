/**
 * Helper permettant d'ajouter plusieurs produits
 * au panier (pourra être réutilisé)
 */
export default async function addProductsToCart(): number {
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
    } catch (err) {}
  }
  return numInCart;
}
