<template>
    <div class="sticker_native">
        <img :src="image">
    </div>
</template>

<script>
export default {
    props: {
        sticker: {
            type: Object,
            required: true
        }
    },
    computed: {
        image () { 
            return this.sticker.images[2].url;
        }
    }
};
</script>

<style>
.sticker_native { width: 80%; }
.sticker_native img { width: 100%; }
</style>