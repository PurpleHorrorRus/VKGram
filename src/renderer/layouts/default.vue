<template>
    <div id="__vkgram">
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

<style lang="scss">
$base-color: #171717;
html, body, #__nuxt, #__vkgram, #__layout, #__app { 
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: $base-color;
  margin: 0 !important;
  overflow: hidden;
}

#__vkgram {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 32px 1fr;
    grid-template-areas: "titlebar" "main-container";
}
</style>
