export default async function registerUser(email: string) {
  await browser.url(`http://localhost:5173/compte/inscription`);

  const inputFullName = await $("#inputFullName");
  await inputFullName.waitForDisplayed();

  await $("#inputFullName").setValue("John Doe");
  await $("#inputEmail").setValue(email);
  await $("#inputPassword").setValue("Abcd1234!");
  await $('button[type="submit"]').click();
}
