import { expect, browser, $ } from '@wdio/globals'

describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await browser.url(`http://localhost:5173/compte/inscription`)

        await $('#inputFullName').setValue('John Doe')
        await $('#inputEmail').setValue('johndoe@example.com')
        await $('#inputPassword').setValue('Abcd1234!')
        await $('button[type="submit"]').click()

        // Sleep 10 seconds
        await browser.pause(10000)

        // await expect($('#flash')).toBeExisting()
        // await expect($('#flash')).toHaveTextContaining(
        //     'You logged into a secure area!')
    })
})

