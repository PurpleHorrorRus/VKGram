import { CacheType } from "~/types/Messages/CacheType";
import { CacheObjectType } from "~/types/Messages/CacheObjectType";

import m_scripts from "~/assets/messages";

interface StateInterface {
    messages: Array<CacheType>
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
            const build = m_scripts.BuildHistory(history);
            if (state.messages[id]) {
                const { profiles } = state.messages[id];
                state.messages[id].profiles = profiles.concat(build.profiles);
            } else state.messages[id] = build;
        },
        SetCurrent (state, id: number) {
            if (state.messages[id]) {
                state.current = state.messages[id];
            }
        },
        AddMessage (state, { id, message, toStart = false, out_read = 0, in_read = 0 }) {
            if (state.messages[id]) {
                const build = m_scripts.BuildMessage(message, Number(out_read), Number(in_read));
                if (!toStart) state.messages[id].messages = [...state.messages[id].messages, build];
                else state.messages[id].messages = [build, ...state.messages[id].messages];
                state.messages[id].conversation.typing = false;
            }
        },
        SetOnline (state, { id, platform }) {
            if (state.messages[id]) {
                state.messages[id].conversation.online = true;
                state.messages[id].conversation.online_mobile = platform;
            }
        },
        SetOffline (state, { id, timestamp }) {
            if (state.messages[id]) {
                state.messages[id].conversation.last_seen = {
                    time: timestamp,
                    platform: state.messages[id].conversation.online_mobile || 7
                };
                state.messages[id].conversation.online = false;
                state.messages[id].conversation.online_mobile = false;
            }
        },
        Read (state, { id, msg_id }) {
            if (state.messages[id]) {
                const { messages } = state.messages[id];
                const index = messages.findIndex(m => m.id === msg_id);
                for (let i = index; i >= 0; i--) {
                    if (messages[i].read_state) break;
                    messages[i].read_state = true;
                }
                state.messages[id].messages = messages;
            }
        },
        Typing (state, id) {
            if (state.messages[id]) {
                state.messages[id].conversation.typing = true;
                setTimeout(() => state.messages[id].conversation.typing = false, 5 * 1000);
            }
        } 
    },
    actions: {
        AddMessage ({ commit }, data: object) { return commit("AddMessage", data); },
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
        },
        async MarkAsRead ({ getters, rootGetters }, id: number) {
            const { messages } = getters.Current;
            const { length } = messages;
            const last_message = messages[length - 1];
            if (!last_message.read_state) {
                const { id: start_message_id } = last_message;
                const vk = rootGetters["vk/GetVK"];
                await vk.call("messages.markAsRead", {
                    peer_id: id,
                    start_message_id
                });
            }
        }
    },
    getters: {
        Get: () => state.messages,
        Current: () => state.current
    }
};