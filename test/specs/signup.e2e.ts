import { expect, browser, $ } from "@wdio/globals";

describe("Register", () => {
  it("should register with valid information", async () => {
    await browser.url(`http://localhost:5173/compte/inscription`);

    await $("#inputFullName").setValue("John Doe");
    await $("#inputEmail").setValue("johndoe@" + Date.now() + "example.com");
    await $("#inputPassword").setValue("Abcd1234!");
    await $('button[type="submit"]').click();

    // await browser.pause(5000);

    console.log(
      ">>> Toggle text",
      await (await $(".dropdown-toggle")).getText()
    );
    const firstDropdownToggle = await $(".dropdown-toggle");
    const firstDropdownToggleText = await firstDropdownToggle.getText();
    expect(firstDropdownToggleText).toContain("John Doe");
  });

  xit("should not register with invalid information", async () => {
    await browser.url(`http://localhost:5173/compte/inscription`);

    await $("#inputFullName").setValue("John Doe");
    await $("#inputPassword").setValue("Abcd1234!");

    await $('button[type="submit"]').click();

    // await browser.pause(5000);

    $(".alert-danger").waitForExist({ timeout: 2000 });
    console.log(">>>> OK !!!!");
  });
});
