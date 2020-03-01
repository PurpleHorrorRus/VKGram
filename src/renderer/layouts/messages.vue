<template>
    <div id="messages-landing">
        <div class="titlebar">
            <Titlebar />
        </div>
        <div class="main-container">
            <nuxt />
        </div>
    </div>
</template>

<script lang="ts">
import Titlebar from "~/components/Titlebar/Titlebar";

export default {
    components: { Titlebar }
};
</script>

<style>
#messages-landing {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 32px 1fr;
    grid-template-areas: "titlebar" "main-container";
}
</style>