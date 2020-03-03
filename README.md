# VKGram

> VKGram is a messenger for VK that allows you to send custom stickers

## Install

``` bash
# clone repo
git clone https://github.com/PurpleHorrorRus/VKGram

# install dependencies
yarn
```

Then open ./config/ and rename file vk.example.json to vk.json. Open it and edit, put your username and password.

``` bash
# run
yarn dev

# tests
yarn test
```

## Upload stickers

Open ./config/ and rename file settings.example.json to settings.json. Open it and edit, put **FULL PATH** by example. Then open ./stickers/ folder and copy & paste folders with sticker packs inside.

Example: ./stickers/MyPack/sticker0.png

Folder names categories and file names of stickers can be any

This is a temporary solution, then I will simplify everything

---

## Contributing

If you want to open Pull Request, make sure first you write code by my ESLint rules.

## Dependecies

This project was generated with [electron-nuxt](https://github.com/michalzaq12/electron-nuxt) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://github.com/michalzaq12/electron-nuxt/blob/master/README.md).

Interaction with the VK API is performed using [EasyVK](https://github.com/ciricc/easyvk)
