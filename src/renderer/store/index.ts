import { Store } from "vuex";
import vk from "~/store/modules/vk";
import settings from "~/store/modules/settings";
import conversations from "~/store/modules/conversations";
import messages from "~/store/modules/messages";
import stickers from "~/store/modules/stickers";

export default () => new Store({
    state: () => ({}),
    mutations: {},
    actions: {
        start ({ dispatch }) {
            dispatch("vk/auth");
        }
    },
    getters: {},
    modules: { vk, settings, conversations, messages, stickers }
});
