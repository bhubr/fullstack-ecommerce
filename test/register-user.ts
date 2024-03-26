// helpers.ts
export default async function registerUser(fullName: string, email: string, password: string) {
  await browser.url(`http://localhost:5173/compte/inscription`);
  await $("#inputFullName").setValue(fullName);
  await $("#inputEmail").setValue(email);
  await $("#inputPassword").setValue(password);
  await $('button[type="submit"]').click();
}