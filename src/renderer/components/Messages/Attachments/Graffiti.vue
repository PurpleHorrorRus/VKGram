<template>
    <div class="graffiti">
        <img class="graffiti-image" :src="graffiti.url">
    </div>
</template>

<script>
export default {
    name: "Graffiti",
    props: {
        graffiti: {
            type: Object,
            required: true
        }
    }
};
</script>

<style>
.graffiti {
    width: 100%;
}

.graffiti .graffiti-image {
    width: 100%;
    height: 100%;
}
</style>