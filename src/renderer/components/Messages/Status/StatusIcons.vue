<template>
    <div 
        v-if="isWeb && online" 
        id="online-circle" 
        :class="{ online }"
    />
    <i v-else-if="isApple" :class="{ online }" class="fab fa-apple" />
    <i v-else-if="isAndroid" :class="{ online }" class="fab fa-android" />
    <i v-else :class="{ online }" class="fa fa-mobile-alt" />
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
        isApple () { return ~misc.platforms.apple.indexOf(this.platform); },
        isAndroid () { return ~misc.platforms.android.indexOf(this.platform); },
        isWeb () { return ~misc.platforms.web.indexOf(this.platform); }
    }
};
</script>

<style scoped>
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