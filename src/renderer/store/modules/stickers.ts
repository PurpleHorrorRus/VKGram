import { readdirSync, lstatSync } from "fs";
import { join } from "path";

import { CategoryType } from "~/types/Messages/Stickers/CategoryType";

interface StateInterface {
    stickers: Array<CategoryType>
    current: string
}

const state: StateInterface = {
    stickers: [],
    current: ""
};

export default {
    namespaced: true,
    state,
    mutations: {
        Cache (state) {
            const { stickers: path } = this.getters["settings/Get"];

            const isDirectory = source => lstatSync(join(path, source)).isDirectory();
            const getDirectories = source => readdirSync(source)
                .map(name => name.replace(path, ""))
                .filter(isDirectory);

            const categories = getDirectories(path);
            
            for (const category of categories) {
                const images = readdirSync(join(path, category));
                const build = {
                    name: category,
                    stickers: images
                };
                state.stickers = [...state.stickers, build];
            }
        },
        SetCurrent (state, current) { state.current = current; }
    },
    actions: {
        Cache ({ commit }) { return commit("Cache"); },
        SetCurrent ({ commit }, current) { return commit("SetCurrent", current); }
    },
    getters: {
        Get: state => state.stickers,
        Current: state => state.current
    }
};