import { readFileSync, writeFileSync } from "fs";

const ReadJSON = dir => JSON.parse(readFileSync(dir, "UTF-8"));

const settings_path = "./config/settings.json";

export default {
    namespaced: true,
    state: () => ({
        settings: ReadJSON(settings_path)
    }),
    mutations: {
        Save (state, settings) {
            state.settings = settings;
            writeFileSync(settings_path, JSON.stringify(settings, null, 4));
        }
    },
    actions: {

    },
    getters: {
        Get: state => state.settings
    }
};