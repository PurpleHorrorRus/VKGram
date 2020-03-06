<template>
    <div id="search-landing">
        <div id="search-header">
            <i id="back" class="fas fa-arrow-left clickable" @click="Back" />
            <Search />
        </div>
        <div id="search-conversations">
            <Conversation
                v-for="conversation of conversations"
                :key="conversation.message.id"
                :conversation="conversation"
            />
        </div>
    </div>
</template>

<script>
import Search from "~/components/Misc/Search";
import Conversation from "~/components/Conversations/Conversation";
import c_scripts from "~/assets/conversations";

export default {
    components: { Search, Conversation },
    async asyncData ({ store, route }) {
        const { q } = route.params;
        const vk = store.getters["vk/GetVK"];
        const { vkr: search } = await vk.call("messages.search", { q, extended: 1 });
        const { items, profiles, groups, conversations } = search;
        let _сonversations = [];

        for (const item of items) {
            const index = conversations.findIndex(c => c.peer.id === item.peer_id);
            conversations[index].online = false;
            _сonversations = [..._сonversations, {
                conversation: conversations[index],
                last_message: item
            }];
        }

        store.commit("vk/SetMode", "history");
        
        const build = c_scripts.BuildConversations(_сonversations, groups, profiles);
        return { conversations: build };
    },
    methods: {
        Back () { return this.$router.back(); }
    }
};
</script>

<style>
#search-landing {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 50px 1fr;
    grid-template-areas: "search-header" "search-conversations";
    height: 100%;
}

#search-header {
    grid-area: search-header;
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "Back Search";
}

#back {
    grid-area: Back;
    margin: auto;
}

#search-conversations {
    grid-area: search-conversations;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>