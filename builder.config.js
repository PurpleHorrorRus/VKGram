/* eslint-disable no-template-curly-in-string */
const ICONS_DIR = "build/icons/";

const windowsOS = {
    win: {
        icon: ICONS_DIR + "512x512.ico",
        publisherName: "Maxim <purplehorrorrus@gmail.com>",
        target: "nsis"
    },

    nsis: {
        differentialPackage: true
    }
};

// const linuxOS = {
//   linux: {
//     icon: ICONS_DIR,
//     target: 'deb'
//   }
// }

// const macOS = {
//   mac: {
//     target: 'dmg',
//     icon: ICONS_DIR + 'con.icns'
//   },
//   dmg: {
//     contents: [
//       {
//         x: 410,
//         y: 150,
//         type: 'link',
//         path: '/Applications'
//       },
//       {
//         x: 130,
//         y: 150,
//         type: 'file'
//       }
//     ]
//   }
// }

module.exports = {
    asar: true,
    productName: "VKGram",
    appId: "org.purplehorrorrus.vkgram",
    artifactName: "vkgram-${version}.${ext}",
    directories: {
        output: "build"
    },
    // default files: https://www.electron.build/configuration/contents
    files: [
        "package.json",
        {
            from: "dist/main/",
            to: "dist/main/"
        },
        {
            from: "dist/renderer",
            to: "dist/renderer/"
        },
        {
            from: "src/resources/",
            to: "dist/resources/"
        }
    ],
    ...windowsOS
    // ...linuxOS,
    // ...macOS
};
