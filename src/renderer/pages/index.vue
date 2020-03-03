<template>
    <div id="index-page">
        <Conversation 
            v-for="conversation of conversations" 
            :key="conversation.id" 
            :conversation="conversation" 
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import Conversation from "~/components/Conversations/Conversation";
export default {
    components: { Conversation },
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
    width: 100%;
    height: 100%;
}
</style>