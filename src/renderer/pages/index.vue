<template>
    <div id="index-page">
        <div id="header">
            <Search />
            <i id="settings-icon" class="fas fa-cog" />
        </div>
        <div id="conversations">
            <Conversation 
                v-for="conversation of conversations" 
                :key="conversation.id" 
                :conversation="conversation" 
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import Search from "~/components/Conversations/Search";
import Conversation from "~/components/Conversations/Conversation";
export default {
    components: { Search, Conversation },
    computed: {
        ...mapGetters({
            vk: "vk/GetVK",
            conversations: "conversations/Get"
        })
    },
    async mounted () {
        if (!this.vk) {
            await this.auth();
            this.cache();
            this.load();
        }
    },
    methods: {
        ...mapActions({
            auth: "vk/auth",
            load: "conversations/Load",
            cache: "stickers/Cache"
        })
    }
};
</script>

<style>
#index-page {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 50px 1fr;
    grid-template-areas: "header" "conversations";
}

#header {
    display: grid;
    grid-template-columns: 1fr 30px;
    grid-template-rows: 1fr;
    grid-template-areas: "Search Settings";
}

#header { grid-area: header; }
#conversations { grid-area: conversations; }

#settings-icon { 
    grid-area: Settings; 
    display: flex;
    align-items: center;
    vertical-align: middle;
    text-align: center;
    padding-left: 2px;
}

#settings-icon:hover {
    cursor: pointer;
    color: rgb(117, 117, 252);
}
</style>