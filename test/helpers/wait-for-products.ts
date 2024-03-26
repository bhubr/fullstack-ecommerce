/**
 * Helper qui attend que les produits soient visibles
 */
export default async function waitForProducts() {
  const firstCard = await $(".card");
  await firstCard.waitForDisplayed({ timeout: 1000 });
}
