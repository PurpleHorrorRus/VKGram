<template>
    <div class="document">
        <Gif v-if="document.ext === 'gif'" :document="document" />
        <File v-else :document="document" />
    </div>
</template>

<script>

export default {
    name: "Document",
    components: {
        Gif: () => import("~/components/Messages/Attachments/Document/Gif"),
        File: () => import("~/components/Messages/Attachments/Document/File")
    },
    props: {
        document: {
            type: Object,
            required: true
        }
    }
};
</script>

<style>
</style>