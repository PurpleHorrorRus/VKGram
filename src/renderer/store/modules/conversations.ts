import misc from "~/assets/misc";
import c_scripts from "~/assets/conversations";
import { ConversationMessageType } from "~/types/Conversations/ConversationMessageType";

interface StateInterface {
    conversations: Array<Object>
};

const state: StateInterface = {
    conversations: []
};

export default {
    namespaced: true,
    state,
    mutations: {
        SetConversations (state, conversations: Array<object>) { 
            state.conversations = conversations; 
        },
        SetMessage (state, { id, item }) {
            const ConversationIndex = state.conversations.findIndex(c => c.id === id);
            if (~ConversationIndex) {
                const build: ConversationMessageType = c_scripts.BuildConversationMessage(item);
                state.conversations[ConversationIndex].message = build;
            }
        },
        SetOnline (state, { id, online_mobile }) {
            const conversations: any = state.conversations;
            if (conversations.length) {
                const UserIndex = conversations.findIndex(c => c.id === id);
                if (~UserIndex) {
                    state.conversations[UserIndex].online = true;
                    state.conversations[UserIndex].online_mobile = online_mobile === 1;
                    console.log("User Online", state.conversations[UserIndex]);
                }
            }
        },
        SetOffline (state, id: number) {
            const conversations: any = state.conversations;
            if (conversations.length) {
                const UserIndex = conversations.findIndex(c => c.id === id);
                if (~UserIndex) {
                    state.conversations[UserIndex].online = false;
                    state.conversations[UserIndex].online_mobile = false;
                    console.log("User Offline", state.conversations[UserIndex]);
                }
            }
        },
        AddUnread (state, id: number) {
            const ConversationIndex = state.conversations.findIndex(c => c.id === id);
            if (~ConversationIndex) state.conversations.unread_count++;
        },
        Move (state, id) {
            const ConversationIndex = state.conversations.findIndex(c => c.id === id);
            if (~ConversationIndex) state.conversations = misc.ArrayMove(state.conversations, ConversationIndex, 0);
        }
    },
    actions: {
        Load ({ commit }) {
            return new Promise(async (resolve, reject) => {
                const vk = this.getters["vk/GetVK"];
                if (vk) {
                    const { vkr: response } = await vk.call("messages.getConversations", { extended: 1 });
                    const { items, groups, profiles } = response; 
                    const conversations = c_scripts.BuildConversations(items, groups, profiles);
                    commit("SetConversations", conversations);
                    return resolve(conversations);
                } else return reject(new Error("VK is null"));
            });
        }
    },
    getters: {
        Get: () => state.conversations
    }
};