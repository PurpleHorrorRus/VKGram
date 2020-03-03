<template>
    <div class="photo">
        <img :src="url" @click="openFull">
    </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
    props: {
        photo: {
            type: Object,
            required: true
        }
    },
    computed: {
        url () {
            // r, q, p, o, z, y, x, m, s
            const sizes = ["r", "q", "p", "o", "z", "y", "x", "m", "s"];
            for (const size of sizes) {
                const index = this.photo.sizes.findIndex(s => s.type === size);
                if (~index) return this.photo.sizes[index].url;
            }
            return this.photo.sizes[0].url;
        }
    },
    methods: { openFull () { return ipcRenderer.send("openFull", this.url); } }
};
</script>

<style>.photo, .photo > img { width: 100%; }</style>