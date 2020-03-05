<template>
    <div class="status">
        <div 
            v-if="isWeb && online" 
            id="online-circle" 
            :class="{ online }"
        />
        <div v-if="!isWeb" class="status-icon">
            <i v-if="isApple" :class="{ online }" class="fab fa-apple" />
            <i v-else-if="isAndroid" :class="{ online }" class="fab fa-android" />
            <i v-else :class="{ online }" class="fa fa-mobile-alt" />
        </div>
    </div>
</template>

<script>
import misc from "~/assets/misc";

export default {
    props: {
        platform: {
            type: Number,
            required: true
        },
        online: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        isApple () { return misc.platforms.apple.includes(this.platform); },
        isAndroid () { return misc.platforms.android.includes(this.platform); },
        isWeb () { return misc.platforms.web.includes(this.platform); }
    }
};
</script>

<style scoped>
.status { 
    display: inline-block;
    margin-left: 5px;
}
.status.conversation-status {
    display: inline;
    margin-left: 0px;
}
i { font-size: 9pt; }
.online { color: rgb(128, 255, 185); }
#online-circle {
    display: inline-block;
    width: 5px;
    height: 5px;
    background: rgb(128, 255, 185);
    border-radius: 50px;
    vertical-align: middle;
}
</style>