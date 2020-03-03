<template>
    <div class="wall">
        <div class="wall-info">
            <i :icon="['fa', 'retweet']" />
            <img class="wall-avatar" :src="wall.from.photo_50">
            <span class="wall-title" v-text="title" />
        </div>
        <div class="wall-content">
            <span v-if="wall.text" class="wall-text" v-text="wall.text" />
            <Attachments v-if="atts" :attachments="atts" />
        </div>
    </div>
</template>

<script>
import Attachments from "~/components/Messages/Attachments";

export default {
    name: "Wall",
    components: { Attachments },
    props: {
        wall: {
            type: Object,
            required: true
        }
    },
    computed: {
        title () {
            const { from } = this.wall;
            if (this.wall.from_id < 0) return from.name;
            else return `${from.first_name} ${from.last_name}`;
        },
        atts () { return this.wall.attachments || this.wall.copy_history[0].attachments; }
    }
};
</script>

<style>
.wall {
    border-left: 2px solid rgb(0, 134, 187);
    padding-left: 5px;
}
.wall-info {
    display: block;
    width: max-content;
    margin-bottom: 5px;
}
.wall-info svg { 
    display: inline-block;
    vertical-align: middle;
    color: #000;
}
.wall-info .wall-avatar {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 50px;
}

.wall-info .wall-title {
    display: inline-block;
    vertical-align: middle;
    width: auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #0087ff; 
}

.wall-content .wall-text {
    display: block;
    margin-bottom: 5px;
    font-size: 9pt;
    color: #000;
}
</style>