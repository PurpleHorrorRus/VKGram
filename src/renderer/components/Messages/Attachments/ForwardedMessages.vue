<template>
    <div class="fwd_message">
        <div class="fwd_user">
            <img :src="message.avatar">
            <span class="fwd_username" :style="{ color }" v-text="message.title" />
        </div>
        <div class="fwd_content">
            <span class="fwd_text" v-text="message.text" />
            <attachments v-if="message.attachments.length" :attachments="message.attachments" />
            <forwarded :messages="message.forwarded" />
        </div>
    </div>
</template>

<script>
import attachments from "~/components/Messages/Attachments";
import misc from "~/plugins/misc";

export default {
    name: "ForwardedMessages",
    components: { attachments, forwarded: () => import("~/components/forwarded") },
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    computed: {
        color () {
            const { id } = this.message;
            return misc.color(id);
        }
    }
};
</script>

<style>
.fwd_message {
    display: block;
    padding-left: 5px;
    margin-top: 5px;
}
.fwd_user {
    width: 100%;
    margin-bottom: 5px;
}

.fwd_user .fwd_username {
    display: inline-block;
    vertical-align: middle;
}

.fwd_user img {
    display: inline-block;
    vertical-align: middle;
    border-radius: 100px;
    width: 20px;
}

</style>