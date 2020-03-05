<template>
    <div class="forwarded">
        <ForwardedMessage 
            v-for="(message, index) of messages" 
            :key="index" 
            :message="message" 
        />
    </div>
</template>

<script>
import ForwardedMessage from "~/components/Messages/Attachments/ForwardedMessages";
import { mapGetters } from "vuex";

export default {
    name: "Forwarded",
    components: { ForwardedMessage },
    props: {
        messages: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            current: "messages/Current"
        })
    }
};
</script>

<style>
.forwarded {
    border-left: 2px solid rgb(0, 134, 187);
    padding-left: 5px;
}
</style>