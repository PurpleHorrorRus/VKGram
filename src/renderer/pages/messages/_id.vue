<template>
    <div id="messages-page">
        <div id="account-container">
            <div id="back-container">
                <i class="fas fa-arrow-left clickable" @click="Back" />
            </diV>
            <div id="avatar-container">
                <img id="photo" :src="current.conversation.photo">
            </div>
            <div id="title-container">
                <span id="messages-title" v-text="current.conversation.title" />
                <div v-if="current.conversation.last_seen" id="last-seen">
                    <Status :lastSeen="last_seen" />
                </div>
            </div>
        </div>
        <div id="messages-main" ref="msgs">
            <Message 
                v-for="message of current.messages" 
                :key="message.id" 
                :message="message" 
                :profile="Profile(message.from_id)" 
            />
        </div>
        <div id="input-container">
            <Input @send="Send" />
        </div>
    </div>
</template>

<script>
import Message from "~/components/Messages/Message";
import Input from "~/components/Messages/Input";
import Status from "~/components/Messages/Status/Status";
import { mapActions, mapGetters } from "vuex";

import misc from "~/assets/misc";

export default {
    layout: "messages",
    components: { Message, Input, Status },
    async asyncData ({ store, route }) {
        const { id } = route.params;

        const messages = store.getters["messages/Get"];
        if (!messages[id]) {
            const vk = store.getters["vk/GetVK"];
            let { vkr: history } = await vk.call("messages.getHistory", { 
                peer_id: id,
                fields: "photo_50,online,last_seen",
                extended: 1
            });
            history = JSON.parse(JSON.stringify(history));
            await store.dispatch("messages/Cache", { id, history });
        }

        store.commit("messages/SetCurrent", id);

        return { loading_messages: false };
    },
    computed: {
        ...mapGetters({
            vk: "vk/GetVK",
            current: "messages/Current"
        }),
        last_seen () {
            const { time, platform } = this.current.conversation.last_seen;
            return { time: misc.FormatTime(time), platform };
        }
    },
    watch: {
        // eslint-disable-next-line object-shorthand
        "current.messages": function (newVal) {
            const { out } = newVal[newVal.length - 1];
            if (out === 1) return this.ScrollToEnd(true);
        }
    },
    updated () { return this.$nextTick(() => this.ScrollToEnd()); },
    mounted () { 
        this.ScrollToEnd(true);
        return this.$refs.msgs.addEventListener("scroll", this.HandleScroll); 
    },
    methods: {
        ...mapActions({
            AddMessage: "messages/AddMessage",
            Cache: "messages/Cache"
        }),
        Profile (from_id) {
            const { profiles } = this.current;
            const UserIndex = profiles.findIndex(p => p.id === Math.abs(from_id));
            if (~UserIndex) return profiles[UserIndex];
        },
        Send (message) {
            const random_id = misc.GetRandom(100000, 999999);
            const { conversation } = this.current;
            const { id } = conversation;    
            this.vk.post("messages.send", {
                peer_id: id,
                random_id,
                message
            }); 
        },
        Back () { return this.$router.replace("/"); },
        async LoadMore () {
            this.loading_messages = true;

            const { length: offset } = this.current.messages; 
            const { id } = this.current.conversation;

            const params = { user_id: id, offset, extended: 1, fields: "photo_50" };
            let { vkr: history } = await this.vk.post("messages.getHistory", params);
            history = JSON.parse(JSON.stringify(history));

            this.Cache({ id, history });

            const { out_read, in_read } = this.current.conversation;

            for (const msg of history.items) {
                this.AddMessage({ id, message: msg, toStart: true, out_read, in_read });
            }

            const scrollY = this.$refs.msgs.scrollTop;
            if (scrollY === 0) this.$refs.msgs.scrollTop += 100;

            return setTimeout(() => this.loading_messages = false, 200);
        },
        HandleScroll () {
            const scrollY = this.$refs.msgs.scrollTop;
            if (scrollY <= 500 && !this.loading_messages) return this.LoadMore();
        },
        ScrollToEnd (force = false) {
            if (this.loading_messages) return;
            const scrollY = this.$refs.msgs.scrollTop;
            const height = this.$refs.msgs.scrollHeight;
            const handle = 600;
            const _h = height - scrollY;
            if (_h < handle || force) { 
                const offset = this.$refs.msgs.lastElementChild.offsetTop;
                return this.$refs.msgs.scrollTop = offset;
            }
        }
    }
};
</script>

<style>
#messages-page {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 40px 1fr minmax(40px, auto);
    grid-template-areas: "account-container" "messages-main" "input-container";
    height: 100%;
}

#account-container {
    grid-area: account-container;
    display: grid;
    grid-template-columns: 40px 40px 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "back-container avatar-container title-container";
    border-bottom: 1px solid rgb(66, 66, 66);
    z-index: 1;
}

#back-container {
    grid-area: back-container;
    padding: 10px;
}

#avatar-container {
    grid-area: avatar-container;
    padding: 3px;
    user-select: none;
}

#avatar-container #photo {
    width: 30px;
    height: 30px;
    border-radius: 50px;
}

#title-container {
    grid-area: title-container;
    padding-top: 10px;
    user-select: none;
}

#messages-title { vertical-align: middle; }
#last-seen { 
    display: inline-block;  
    margin-left: 5px;
    vertical-align: middle;
}

#last-seen span, #last-seen i { font-size: 9pt; }

#messages-main {
    grid-area: messages-main;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 0;
    padding: 5px;
    height: 100%;
}

#input-container {
    grid-area: input-container;
}
</style>