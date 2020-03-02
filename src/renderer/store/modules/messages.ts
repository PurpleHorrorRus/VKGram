import { CacheType } from "~/types/Messages/CacheType";
import { CacheObjectType } from "~/types/Messages/CacheObjectType";

import m_scripts from "~/assets/messages";

interface StateInterface {
    messages: Array<CacheType>,
    current: CacheObjectType | object
}

const state: StateInterface = {
    messages: [],
    current: {}
};

export default {
    namespaced: true,
    state,
    mutations: {
        Cache (state, { id, history }) {
            state.messages[id] = m_scripts.BuildHistory(history);
        },
        SetCurrent (state, id: number) {
            if (state.messages[id]) {
                state.current = state.messages[id];
            }
        },
        AddMessage (state, { id, message, toStart = false }) {
            if (state.messages[id]) {
                const build = m_scripts.BuildMessage(message);
                if (!toStart) state.messages[id].messages = [...state.messages[id].messages, build];
                else state.messages[id].messages = [build, ...state.messages[id].messages];
            }
        },
        SetOnline (state, { id, online_mobile }) {
            if (state.messages[id]) {
                state.messages[id].profile.online = true;
                state.messages[id].profile.online_mobile = online_mobile;
            }
        },
        SetOffline (state, id: number) {
            if (state.messages[id]) {
                state.messages[id].profile.online = false;
                state.messages[id].profile.online_mobile = false;
            }
        }
    },
    actions: {
        Cache ({ commit }, { id, history }) {
            return new Promise(async (resolve, reject) => {
                /*
                    Кэшируем ваш профиль, если его не существует в ответе VK
                    Это баг самого VK API, в некоторых диалогах это действие не требуется
                */
                let { profiles } = history;
                if (!profiles) profiles = [];

                const ID = this.getters["vk/GetID"];
                const MyProfileIndex = profiles.findIndex(p => p.id === ID);
                if (!~MyProfileIndex) {
                    const vk = this.getters["vk/GetVK"];
                    let { vkr: user } = await vk.call("users.get", {
                        user_ids: ID,
                        fields: "photo_50"
                    }).catch(e => reject(new Error(e)));
                    user = user[0];
                    user = JSON.parse(JSON.stringify(user));
                    history.profiles = [...profiles, user];
                }
                commit("Cache", { id, history });
                return resolve();
            });
        }
    },
    getters: {
        Get: () => state.messages,
        Current: () => state.current
    }
};