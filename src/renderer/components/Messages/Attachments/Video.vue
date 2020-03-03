<template>
    <div class="video">
        <iframe :src="video.player" allowfullscreen />
    </div>
</template>

<script>
export default {
    name: "Video",
    props: {
        video: {
            type: Object,
            required: true
        }
    }
};
</script>

<style>
.video, .video iframe { 
    width: 100%;
    border: none; 
}
</style>