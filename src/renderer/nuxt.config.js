/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
    mode: "spa", // or 'universal'
    build: {
        extend (config) {
            config.module.rules.push({
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]"
                }
            });
        }
    },
    head: {
        title: "vkgramnuxt"
    },
    loading: "components/loading.vue",
    css: ["~/assets/global.css"],
    plugins: [
        { ssr: true, src: "~/plugins/icons.js" },
        { ssr: true, src: "~/plugins/textarea.js" }
    ],
    buildModules: [
        "@nuxt/typescript-build"
    ],
    modules: [

    ]
};
