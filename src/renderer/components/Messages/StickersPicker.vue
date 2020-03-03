<template>
    <div v-if="stickers.length" id="sticker-picker">
        <i id="sticker-picker-icon" class="fas fa-smile" @mouseenter.self="turn" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data: () => ({
        show: false
    }),
    computed: {
        ...mapGetters({
            stickers: "stickers/Get"
        })
    },
    methods: {
        turn () {
            return this.$emit("turn");
        }
    }
    
};
</script>

<style>
#sticker-picker {
    grid-area: sticker-picker;
    padding-top: 15px;
    font-size: 15pt;
    text-align: center;
}

#sticker-picker-icon:hover {
    cursor: pointer;
    color: rgb(117, 117, 252);
}
</style>