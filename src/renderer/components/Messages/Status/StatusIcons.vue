<template>
    <div v-if="platform === 1" id="online-circle" />
    <i v-else-if="platform === 2" class="fab fa-apple" />
    <i v-else-if="platform === 4" class="fab fa-android" />
    <i v-else class="fa fa-mobile-alt" />
</template>

<script>
export default {
    props: {
        platform: {
            type: Number,
            required: true
        }
    }
};
</script>

<style>
#online-circle {
    display: inline-block;
    width: 5px;
    height: 5px;
    background:rgb(128, 255, 185);
    border-radius: 50px;
}
</style>