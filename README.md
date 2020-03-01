# VKGram

> VKGram is a messenger for VK that allows you to send custom stickers

## Install

``` bash
# clone repo
git clone https://github.com/PurpleHorrorRus/VKGram

# install dependencies
yarn install
```

Then open ./config/ and rename file vk.example.json to vk.json. Open it and edit, put your username and password.

``` bash
# run
yarn dev
```

---

## Contributing

If you want to open Pull Request, make sure first you write code by my ESLint rules.

## Dependecies

This project was generated with [electron-nuxt](https://github.com/michalzaq12/electron-nuxt) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://github.com/michalzaq12/electron-nuxt/blob/master/README.md).

Interaction with the VK API is performed using [EasyVK](https://github.com/ciricc/easyvk)
