<template>
    <div class="stickers-category" @click="choose">
        <transition name="fade">
            <div v-if="active" class="stickers-active" />
        </transition>
        <img class="sticker-category-preview" :src="preview">
    </div>
</template>

<script>
import { join } from "path";
import { mapActions, mapGetters } from "vuex";

export default {
    props: {
        category: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            settings: "settings/Get",
            current: "stickers/Current"
        }),
        preview () {
            const { stickers } = this.settings;
            return join("file:///", stickers, this.category.name, this.category.preview);
        },
        active () { return this.current === this.category.name; }
    },
    methods: {
        ...mapActions({
            SetCurrent: "stickers/SetCurrent"
        }),
        choose () { this.SetCurrent(this.category.name); }
    }
};
</script>

<style>
.stickers-active {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 5px;
    background:rgb(0, 110, 255);
}
.stickers-category {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 100%;
    padding: 5px;
    user-select: none;
    transition: all .6s ease;
    margin-top: 2px;
}

.stickers-category:hover {
    cursor: pointer;
    background: rgb(46, 46, 46);
}

.sticker-category-preview {
    width: 100%;
    height: 100%;
}
</style>