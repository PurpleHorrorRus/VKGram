import { readFileSync } from "fs";
import easyvk from "easyvk";

import sound from "~/assets/message.mp3";

function ReadJSON (dir: string) {
    const content = readFileSync(dir, "UTF-8");
    const json = JSON.parse(content);
    return json;
}

interface StateInterface {
    vk: any | null
    longpoll: Object | null
    mode: string
};

const state: StateInterface = {
    vk: null,
    longpoll: null,
    mode: "normal"
};

export default {
    namespaced: true,
    state,
    mutations: {
        SetVK (state, vk: object) { state.vk = vk; },
        SetLongPoll (state, longpoll: object) { state.longpoll = longpoll; },
        SetMode (state, mode) { state.mode = mode; }
    },
    actions: {
        auth: ({ commit, dispatch }) => {
            return new Promise(async (resolve, reject) => {
                const VKAuthData: object = ReadJSON("./config/vk.json");
                const AuthObject: object = Object.assign(VKAuthData, { 
                    api_v: "5.103",
                    session_file: "./config/.vksession"
                });
                const vk: object = await easyvk(AuthObject).catch(reject);
                commit("SetVK", vk);
                await dispatch("LPConnect");
                return resolve(vk);
            });
        },
        LPConnect: ({ commit, dispatch }) => {
            return new Promise(async (resolve, reject) => {
                const getMessage: any = async (id: number) => {
                    const { vkr: message } = await vk.post("messages.getById", { 
                        message_ids: id, 
                        extended: 1, 
                        fields: "photo_max" 
                    });
                    return message;
                };
                const vk: any = state.vk;
                if (vk) {
                    const { connection: longpoll } = await vk.longpoll.connect().catch(reject);

                    longpoll.on("message", async (data: Array<number>) => {
                        const message_id: number = data[1];
                        const to: number = data[3];

                        const { items } = await getMessage(message_id);
                        const item: any = { 
                            last_message: Object.assign(items[0], { 
                                read_state: items[0].read_state || false 
                            })
                        };

                        const my = item.last_message.out;
                        if (!my) {
                            commit("conversations/AddUnread", to, { root: true });
                            const notification = new Audio(String(sound));
                            notification.play();
                        }

                        commit("conversations/SetMessage", { id: to, item }, { root: true });
                        commit("conversations/Move", to, { root: true });

                        commit("messages/AddMessage", { id: to, message: items[0] }, { root: true });

                        return data;
                    });

                    longpoll.on("friendOnline", data => {
                        const id = -data[1];
                        const platform = data[2];
                        commit("conversations/SetOnline", { id, platform }, { root: true });
                        commit("messages/SetOnline", { id, platform }, { root: true });
                    });

                    longpoll.on("friendOffline", data => {
                        const id = -data[1];
                        const timestamp = data[3];
                        commit("conversations/SetOffline", id, { root: true });
                        commit("messages/SetOffline", { id, timestamp }, { root: true });
                    });

                    longpoll.on("changeFlags", data => {
                        const msg_id = data[1];
                        const flag = data[2];
                        const to = data[3];
                        if (flag === 1) { // Read message
                            commit("conversations/RemoveUnread", to, { root: true });
                            setTimeout(() => {
                                commit("conversations/Read", to, { root: true });
                                commit("messages/Read", { id: to, msg_id }, { root: true });
                            }, 200);
                        }
                    });

                    longpoll.on("typeInDialog", data => {
                        const to = data[1];
                        commit("conversations/Typing", to, { root: true });
                        commit("messages/Typing", to, { root: true });
                    });

                    longpoll.on("error", () => dispatch("vk/LPConnect"));

                    commit("SetLongPoll", longpoll);
                    return resolve(longpoll);
                } else return reject(new Error("VK is null"));
            });
        },
        SetMode ({ commit }, mode) { return commit("SetMode", mode); }
    },
    getters: { 
        GetVK: () => state.vk,
        GetID: () => state.vk.session.user_id,
        GetMode: () => state.mode
    }
};