<template>
    <div id="index-page">
        <div class="header">
            <Search />
            <i id="settings-icon" class="fas fa-cog" @click="openSettings" />
        </div>
        <div class="conversations">
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

import Search from "~/components/Misc/Search";
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
        this.SetMode("normal");
        if (!this.vk) {
            await this.auth();
            this.cache();
            this.load();
        }
    },
    methods: {
        ...mapActions({
            auth: "vk/auth",
            SetMode: "vk/SetMode",
            load: "conversations/Load",
            cache: "stickers/Cache"
        }),
        openSettings () { return this.$router.push("/settings/"); }
    }
};
</script>

<style>
#index-page {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 50px 1fr;
    grid-template-areas: "header" "conversations";
    height: 100%;
}

.header {
    grid-area: header;
    display: grid;
    grid-template-columns: 1fr 30px;
    grid-template-rows: 1fr;
    grid-template-areas: "Search Settings";
}

.conversations { 
    grid-area: conversations;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}

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