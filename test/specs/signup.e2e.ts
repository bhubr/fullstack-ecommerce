import { expect, browser, $ } from "@wdio/globals";

describe("Register", () => {
  it("should register with valid information", async () => {
    await browser.url(`http://localhost:5173/compte/inscription`);

    await $("#inputFullName").setValue("John Doe");
    await $("#inputEmail").setValue("johndoe@example.com");
    await $("#inputPassword").setValue("Abcd1234!");
    await $('button[type="submit"]').click();

    await browser.pause(5000);

    expect($(".dropdown-toggle").getText()).toContain("John Doe");
  });

  it("should not register with invalid information", async () => {
    await browser.url(`http://localhost:5173/compte/inscription`);

    await $("#inputFullName").setValue("John Doe");
    await $("#inputPassword").setValue("Abcd1234!");

    await $('button[type="submit"]').click();

    await browser.pause(5000);

    $(".alert-danger").waitForExist({ timeout: 2000 });
    console.log(">>>> OK !!!!");
  });
});
