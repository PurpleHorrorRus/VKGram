<template>
    <div id="sticker-block" @mouseleave="$emit('closePanel')">
        <div id="stickers" ref="stickers" @mouseup="Hide" @wheel="HandleScroll">
            <transition name="fade">
                <div v-if="show_full" id="sticker-full">
                    <img class="sticker-full-image" :src="full">
                </div>
            </transition>
            <span id="sticker-current-label" class="nowrap" v-text="current" />
            <div id="stickers-list">
                <Sticker
                    v-for="(sticker, index) of SelectedPack" 
                    :key="index"
                    :sticker="sticker"
                    @closePanel="$emit('closePanel')"
                    @mousedown.native="Show(sticker)"
                    @mouseup.native="Hide"
                    @mousemove.native="Edit(sticker)"
                />
            </div>
        </div>
        <div id="stickers-categories" @mousemove="Hide">
            <Category
                v-for="category of Categories"
                :key="category.name"
                :category="category"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Sticker from "~/components/Messages/Stickers/Sticker";
import Category from "~/components/Messages/Stickers/Category";

export default {
    components: { Sticker, Category },
    data: () => ({
        allow: true,
        allow_scroll: true,
        hold: false,
        show_full: false,
        full: ""
    }),
    computed: {
        ...mapGetters({
            settings: "settings/Get",
            stickers: "stickers/Get",
            current: "stickers/Current"
        }),
        SelectedPack () {
            if (!this.current) this.SetCurrent(this.stickers[0].name);
            const index = this.stickers.findIndex(s => s.name === this.current) || 0;
            return this.stickers[index].stickers;
        },
        Categories () {
            return this.stickers.map(s => {
                return {
                    name: s.name,
                    preview: s.stickers[0]
                };
            });
        }
    },
    methods: {
        ...mapActions({
            SetCurrent: "stickers/SetCurrent"
        }),
        HandleScroll (e) {
            if (!this.allow_scroll) return;
            const scrollY = this.$refs.stickers.scrollTop;
            const height = this.$refs.stickers.clientHeight;
            const _h = this.$refs.stickers.scrollHeight;

            if (scrollY === 0 && e.deltaY < 0) {
                const cats = this.Categories; // :3
                let index = cats.findIndex(c => c.name === this.current);
                if (~index) {
                    if (index - 1 < 0) index = cats.length - 1;
                    else index -= 1;
                    this.SetCurrent(cats[index].name);
                    this.$refs.stickers.scrollTop = 0;
                }
            } else if (scrollY + height === _h && e.deltaY > 0) {
                const cats = this.Categories; // :3
                let index = cats.findIndex(c => c.name === this.current);
                if (~index) {
                    if (index + 1 >= cats.length) index = 0;
                    else index += 1;
                    this.SetCurrent(cats[index].name);
                    this.$refs.stickers.scrollTop = 0;
                }
            }
            this.allow_scroll = false;
            setTimeout(() => this.allow_scroll = true, 600);
        },
        LoadFull (sticker) {
            const { stickers } = this.settings;
            const src = `file:///${stickers}/${this.current}/${sticker}`;
            this.full = src;
        },
        Show (sticker) {
            this.hold = true;
            if (this.show_full) return this.LoadFull(sticker);
            return setTimeout(() => {
                if (this.hold) {
                    this.LoadFull(sticker);
                    this.show_full = true;
                    this.allow = false;
                }
            }, 200);
        },
        Edit (sticker) {
            if (this.full && this.hold) this.LoadFull(sticker);
        },
        Hide () {
            this.hold = false;
            this.full = "";
            this.show_full = false;
            setTimeout(() => this.allow = true, 1000);
        }
    }
};
</script>

<style>
#sticker-block {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 70px;
    grid-template-areas: "stickers" "stickers-categories";
    position: absolute;
    bottom: 10%;
    right: 15px;
    width: 85%;
    height: 70%;
    border-radius: 10px;
    background: #0e0e0e;
}

#stickers { 
    grid-area: stickers;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 10px;
}

#sticker-full {
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    width: 100%;
    height: 79%;
    user-select: none;
    pointer-events: none;
}

#sticker-full img {
    margin: auto;
    width: auto;
    height: 65%;
}

#sticker-current-label {
    font-family: Roboto;
    display: block;
    padding: 10px;
    user-select: none;
}

#stickers-categories { 
    grid-area: stickers-categories; 
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
    white-space: nowrap;
    border-top: 1px solid #ccc;
}
</style>