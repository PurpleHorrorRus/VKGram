<template>
    <div class="sticker" @click="Send">
        <div class="sticker-image" :style="{ background: `url('${path}') 0% 0% / cover` }" />
    </div>
</template>

<script>
import { join } from "path";
import misc from "~/assets/misc";
import { mapGetters } from "vuex";

export default {
    props: {
        sticker: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            vk: "vk/GetVK",
            settings: "settings/Get",
            current: "stickers/Current",
            current_conversation: "messages/Current"
        }),
        path () {
            const { stickers } = this.settings;
            return `file:///${stickers}/${this.current}/${this.sticker}`;
        }
    },
    methods: {
        async Send () {
            if (!this.$parent.allow) return;
            this.$emit("closePanel");

            const { stickers } = this.settings;

            const { uploader: server } = this.vk;
            const { url } = await server.getUploadURL("docs.getUploadServer", { type: "graffiti" });
            const { vkr: fileData } = await server.uploadFile(url, 
                join(stickers, this.current, this.sticker), "file", {});

            const saved = await this.vk.call("docs.save", {
                file: fileData.file,
                title: `VKGram_sticker_${this.sticker}`,
                tags: "VKMSG",
                v: "5.103"
            });
            const { vkr: response } = saved;
            const { graffiti } = response;
            const field = `graffiti${this.vk.session.user_id}_${graffiti.id}`;

            const { id, type } = this.current_conversation.conversation;
            const random_id = misc.GetRandom(100000, 999999);
            const _t = type === "user" || type === "chat";
            
            const to_send = {
                peer_id: _t ? id : -id,
                random_id,
                attachment: field
            };
            await this.vk.post("messages.send", to_send); 

            return this.vk.call("docs.delete", {
                owner_id: this.vk.session.user_id,
                doc_id: graffiti.id
            });
        },
        PrepareImage (img) {
            const fname = img.split("/");
            let image = fname[fname.length - 1];
            if (~image.indexOf("?")) image = image.slice(0, image.indexOf("?"));
            if (~image.indexOf("#")) image = image.slice(0, image.indexOf("#"));
            if (~image.indexOf("&")) image = image.slice(0, image.indexOf("&"));
            return image;
        }
    }
};
</script>

<style>
.sticker {
    display: inline-block;
    width: 73px;
    height: 73px;
    padding: 5px;
    user-select: none;
    transition: all .6s ease;
}

.sticker:hover {
    cursor: pointer;
    background: rgb(46, 46, 46);
}

.sticker-image {
    width: 100%;
    height: 100%;
}
</style>