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
                state.conversations[ConversationIndex].typing = false;
            }
        },
        SetOnline (state, { id, platform }) {
            const conversations: any = state.conversations;
            if (conversations.length) {
                const UserIndex = conversations.findIndex(c => c.id === id);
                if (~UserIndex) {
                    state.conversations[UserIndex].online = true;
                    state.conversations[UserIndex].online_mobile = platform;
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
            if (~ConversationIndex) state.conversations[ConversationIndex].unread_count++;
        },
        RemoveUnread (state, id: number) {
            const ConversationIndex = state.conversations.findIndex(c => c.id === id);
            if (~ConversationIndex) state.conversations[ConversationIndex].unread_count = 0;
        },
        Read (state, id: number) {
            const ConversationIndex = state.conversations.findIndex(c => c.id === id);
            if (~ConversationIndex) {
                state.conversations[ConversationIndex].message.read_state = true;
                console.log("User / Group has read a message", state.conversations[ConversationIndex]);
            }
        },
        Move (state, id) {
            const ConversationIndex = state.conversations.findIndex(c => c.id === id);
            if (~ConversationIndex) state.conversations = misc.ArrayMove(state.conversations, ConversationIndex, 0);
        },
        Typing (state, id) {
            const ConversationIndex = state.conversations.findIndex(c => c.id === id);
            if (~ConversationIndex) {
                state.conversations[ConversationIndex].typing = true;
                setTimeout(() => state.conversations[ConversationIndex].typing = false, 5 * 1000);
                console.log("User / Group is typing...", state.conversations[ConversationIndex]);
            }
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