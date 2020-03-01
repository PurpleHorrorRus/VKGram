import { readFileSync } from "fs";
import easyvk from "easyvk";

function ReadJSON (dir: string) {
    const content = readFileSync(dir, "UTF-8");
    const json = JSON.parse(content);
    return json;
}

interface StateInterface {
    vk: any | null,
    longpoll: Object | null
};

const state: StateInterface = {
    vk: null,
    longpoll: null
};

export default {
    namespaced: true,
    state,
    mutations: {
        SetVK (state, vk: object) { state.vk = vk; },
        SetLongPoll (state, longpoll: object) { state.longpoll = longpoll; }
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
                        const item: object = { last_message: items[0] };

                        commit("conversations/SetMessage", { id: to, item }, { root: true });
                        commit("conversations/Move", to, { root: true });

                        commit("messages/AddMessage", { id: to, message: items[0] }, { root: true });

                        return data;
                    });

                    longpoll.on("friendOnline", data => {
                        const id = -data[1];
                        const platform = data[2];
                        return commit("conversations/SetOnline", { id, online_mobile: platform }, { root: true });
                    });

                    longpoll.on("friendOffline", data => {
                        const id = -data[1];
                        return commit("conversations/SetOffline", id, { root: true });
                    });

                    longpoll.on("error", () => dispatch("vk/LPConnect"));

                    commit("SetLongPoll", longpoll);
                    return resolve(longpoll);
                } else return reject(new Error("VK is null"));
            });
        }
    },
    getters: { 
        GetVK: () => state.vk,
        GetID: () => state.vk.session.user_id
    }
};