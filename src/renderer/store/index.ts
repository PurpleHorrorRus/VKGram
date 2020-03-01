import { Store } from "vuex";
import vk from "~/store/modules/vk";
import conversations from "~/store/modules/conversations";
import messages from "~/store/modules/messages";

export default () => new Store({
    state: () => ({}),
    mutations: {},
    actions: {
        start ({ dispatch }) {
            dispatch("vk/auth");
        }
    },
    getters: {},
    modules: { vk, conversations, messages }
});
