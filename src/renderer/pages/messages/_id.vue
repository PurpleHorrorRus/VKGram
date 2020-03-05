<template>
    <div id="messages-page" :class="{ screenshot: screenshots.length || screenshots_query > 0 }">
        <div id="account-container">
            <div id="back-container">
                <i class="fas fa-arrow-left clickable" @click="Back" />
            </diV>
            <div id="avatar-container">
                <img id="photo" :src="current.conversation.photo">
            </div>
            <div id="title-container">
                <span id="messages-title" v-text="current.conversation.title" />
                <div v-if="!current.conversation.typing" id="status-top">
                    <div v-if="current.conversation.last_seen" id="last-seen">
                        <Status :lastSeen="last_seen" />
                    </div>
                </div>
                <Typing v-else />
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
        <div v-if="screenshots.length" id="screenshots-container">
            <img
                v-for="(screenshot, index) of screenshots"
                :key="index"
                class="screenshot"
                :src="screenshot.sizes[0].url"
                @click="RemoveScreenshot(index)"
            >
        </div>
        <div id="input-container">
            <Input 
                @send="Send"
                @AddScreenshot="AddScreenshot"
            />
            <StickersPicker @turn="turnStickers" />
        </div>
        <transition name="fade">
            <StickersBlock 
                v-if="stickers" 
                @closePanel="stickers = false" 
            />
        </transition>
    </div>
</template>

<script>
import { writeFileSync, unlinkSync } from "fs";
import { clipboard } from "electron";

import Status from "~/components/Messages/Status/Status";
import Typing from "~/components/Misc/Typing";
import Message from "~/components/Messages/Message";
import Input from "~/components/Messages/Input";
import StickersPicker from "~/components/Messages/StickersPicker";
import StickersBlock from "~/components/Messages/Stickers/Block";
import { mapActions, mapGetters } from "vuex";

import misc from "~/assets/misc";

export default {
    layout: "messages",
    components: { Status, Typing, Message, Input, StickersPicker, StickersBlock },
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
        store.dispatch("messages/MarkAsRead", id);

        return { 
            id,
            loading_messages: false, 
            stickers: false, 
            screenshots: [], 
            screenshots_query: 0 
        };
    },
    computed: {
        ...mapGetters({
            vk: "vk/GetVK",
            current: "messages/Current"
        }),
        last_seen () {
            const { time } = this.current.conversation.last_seen;
            const platform = this.current.conversation.last_seen.platform || this.current.conversation.online_mobile;
            return { time: misc.FormatTime(time), platform };
        }
    },
    watch: {
        // eslint-disable-next-line object-shorthand
        "current.messages": function (newVal) {
            const { out } = newVal[newVal.length - 1];
            if (out === 1) return this.ScrollToEnd(true);
            else {
                const scrollY = this.$refs.msgs.scrollTop;
                const height = this.$refs.msgs.clientHeight;
                const _h = this.$refs.msgs.scrollHeight;
                if (scrollY + height === _h) this.ScrollToEnd(true);
                return this.MarkAsRead(this.id);
            }
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
            Cache: "messages/Cache",
            MarkAsRead: "messages/MarkAsRead"
        }),
        Profile (from_id) {
            const { profiles } = this.current;
            const UserIndex = profiles.findIndex(p => p.id === Math.abs(from_id));
            if (~UserIndex) return profiles[UserIndex];
        },
        async AddScreenshot () {
            const availableFormats = clipboard.availableFormats("clipboard");
            if (availableFormats.includes("image/png") || availableFormats.includes("image/jpeg")) {
                this.screenshots_query++;
                const path = `./tmp${misc.GetRandom(10000, 99999)}.png`;
                const screenshot = clipboard.readImage("clipboard").toDataURL();
                writeFileSync(path, screenshot.replace(/^data:image\/png;base64,/, ""), "base64");
                const { uploader: server } = this.vk;
                const { url } = await server.getUploadURL("photos.getMessagesUploadServer", { type: "photo" });
                const { vkr: fileData } = await server.uploadFile(url, path, "photo", {});
                unlinkSync(path);

                let { vkr: saved } = await this.vk.post("photos.saveMessagesPhoto", {
                    photo: fileData.photo,
                    server: fileData.server,
                    hash: fileData.hash
                });

                saved = saved[0];
                saved.sizes = saved.sizes.sort((a, b) => a.width + a.height > b.width + b.height).reverse();

                this.screenshots = [...this.screenshots, saved];
                this.screenshots_query--;
                return this.$emit("SetScreenshots", this.screenshots);
            }
        },
        ClearScreenshots () {
            this.screenshots_query = 0;
            return this.screenshots = [];
        },
        RemoveScreenshot (index) { this.screenshots.splice(index, 1); },
        Send (message) {
            if (!message && !this.screenshots.length) return;
            const random_id = misc.GetRandom(100000, 999999);
            const { conversation } = this.current;
            const { id, type } = conversation;   
            const _t = type === "user" || type === "chat";
            let to_send = {
                peer_id: _t ? id : -id,
                random_id,
                message
            };
            if (this.screenshots.length) {
                const attachment = this.screenshots.map(s => `photo${s.owner_id}_${s.id}`).join(",");
                to_send = Object.assign(to_send, { attachment });
                this.ClearScreenshots();
            }
            this.vk.post("messages.send", to_send); 
        },
        Back () { return this.$router.replace("/"); },
        turnStickers () { return this.stickers = true; },
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

#messages-page.screenshot {
    grid-template-columns: 100%;
    grid-template-rows: 40px 1fr 100px minmax(40px, auto);
    grid-template-areas: "account-container" "messages-main" "screenshots-container" "input-container";
}

#account-container {
    grid-area: account-container;
    display: grid;
    grid-template-columns: 40px 40px 1fr;
    grid-template-rows: 100%;
    grid-template-areas: "back-container avatar-container title-container";
    border-bottom: 1px solid rgb(66, 66, 66);
    z-index: 1;
}

#back-container {
    grid-area: back-container;
    margin: auto;
}

#avatar-container {
    grid-area: avatar-container;
    margin: auto;
    user-select: none;
}

#avatar-container #photo {
    width: 30px;
    height: 30px;
    border-radius: 50px;
}

#title-container {
    grid-area: title-container;
    user-select: none;
    margin-top: 7px;
    margin-left: 5px;
}

#status-top {
    display: inline-block;
    vertical-align: middle;
}

#messages-title { vertical-align: middle; }
#last-seen { 
    display: inline-block;
    vertical-align: middle;
}

#last-seen span, #last-seen i { font-size: 9pt; }

#messages-main {
    grid-area: messages-main;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 0;
    padding: 5px;
}

#screenshots-container {
    grid-area: screenshots-container;
    padding: 10px;
    border-top: 1px solid rgb(92, 92, 92);
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
}

#screenshots-container .screenshot {
    width: auto;
    height: 100%;
    margin-right: 10px;
    user-select: none;
}

#screenshots-container .screenshot:hover {
    cursor: pointer;
}

#input-container {
    grid-area: input-container;
    display: grid;
    grid-template-columns: 1fr 40px;
    grid-template-rows: 1fr;
    grid-template-areas: "input sticker-picker";
    border-top: 1px solid rgb(92, 92, 92);
}
</style>