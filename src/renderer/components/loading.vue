<template lang="html">
    <div v-if="loading" class="page-loader">
        <i class="fas fa-circle-notch fa-spin" />
    </div>
</template>

<script>
export default {
    data: () => ({
        loading: false
    }),
    methods: {
        start () { return this.loading = true; },
        finish () { return this.loading = false; }
    }
};
</script>

<style scoped>
i { color: #fff; }
.page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    text-align: center;
    padding-top: 200px;
    font-size: 30px;
    font-family: sans-serif;
    z-index: 1;
}
</style>