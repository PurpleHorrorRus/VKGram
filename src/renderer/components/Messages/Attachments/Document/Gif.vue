<template>
    <div class="document-gif" @click="playing = !playing">
        <div v-if="!playing" class="not-playing">
            <img class="gif-preview" :src="preview">
            <div class="gif-bar" v-text="'Gif'" />
        </div>
        <img v-else class="gif-preview" :src="document.url">
    </div>
</template>

<script>
export default {
    name: "Gif",
    props: {
        document: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        playing: false
    }),
    computed: {
        preview () {
            const sizes = ["r", "q", "p", "o", "z", "y", "x", "m", "s"];
            const { photo } = this.document.preview;
            const { sizes: _s } = photo;
            for (const size of sizes) {
                const index = _s.findIndex(s => s.type === size);
                if (~index) return _s[index].src;
            }
            return _s[0].src;
        }
    },

};
</script>

<style>
.document-gif {
    position: relative;
    width: 100%;
    user-select: none;
}

.document-gif:hover .gif-bar {
    color: rgb(117, 117, 252);
}

.gif-preview {
    width: 100%;
}

.gif-bar {
    position: absolute;
    left: 0px;
    bottom: 3px;
    height: 20px;
    background: rgba(0, 0, 0, .5);
    font-family: Roboto;
    color: #fff;
    text-align: left;
    padding: 5px;
}

</style>