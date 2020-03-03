<template>
    <div class="link" @click="open">
        <img class="link-preview" :src="photo">
        <div class="link-info">
            <span class="link-title" v-text="link.title" />
            <span class="link-caption" v-text="link.caption" />
        </div>
    </div>
</template>

<script>
import { shell } from "electron";

export default {
    props: {
        link: {
            type: Object,
            required: true
        }
    },
    computed: {
        photo () {
            if (!this.link.photo) return "";
            const sizes = ["r", "q", "p", "o", "z", "y", "x", "m", "s"];
            for (const size of sizes) {
                const index = this.link.photo.sizes.findIndex(s => s.type === size);
                if (~index) return this.link.photo.sizes[index].url;
            }
            return this.link.photo.sizes[0].url;
        }
    },
    methods: {
        open () { return shell.openExternal(this.link.url); }
    }
};
</script>

<style>
.link {
    border: 1px solid #ccc;
    border-radius: 10px;
}
.link-preview {
    display: block;
    width: 100%;
}
.link-info {
    background: rgb(255, 255, 255);
    border-radius: 0px 0px 10px 10px;
    padding: 15px;
}
.link-info span {
    color: rgb(0, 0, 0);
}

.link-info .link-title {
    font-size: 13pt;
    display: block;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.link-info .link-caption {
    font-size: 9pt;
    color: rgb(24, 24, 24);
}
</style>