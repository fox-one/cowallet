# CoWallet

CoWallet is a cooperative crypto wallet on Mixin Network.

## Notice

CoWallet is a front-end web application, it doesn't manage your assets. All cryptos are managed by Mixin Network with its multisig features.

If you delete a vault from CoWallet, no multisig address or assets in it will be deleted. If you are one of the vault members, you can restore the access of the vault anytime by creating a vault with the same parameters (members' id, threshod).

## How to use?

### Use CoWallet in Mixin Messenger

- Search '7000103970' at [Mixin Messenger](https://mixin.one/messenger), add it as contact;
- Create a group and add it as a group member.

### Use CoWallet in a web browser

Visit https://cowallet.fox.one/

## Features

- [x] Integrate with Mixin Messenger Group
- [x] Deposit and withdrawal crypto
- [x] Dark theme
- [x] Import and export vaults
- [x] Create wallet with Mixin Messenger Friends
- [x] Revoke signature requests
- [x] Beancount support
- [x] Better cache
- [x] Better error handlers
- [x] Fiat currency config
- [x] Desktop layout
- [x] Support to export and import wallet config
- [ ] [Fennec](https://github.com/fox-one/fennec) support
- [ ] Kernel v1 transaction support

## How to Build

```bash
# install dependencies
$ yarn

# load env, see https://github.com/fox-one/cowallet/blob/master/src/.env.example
# change the file to .env modify the API_BASE and CLIENT_ID
$ source src/.env

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```
