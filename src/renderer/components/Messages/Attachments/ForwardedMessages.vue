<template>
    <div class="fwd_message">
        <div class="fwd_user">
            <img :src="profile.photo">
            <span class="fwd_username" v-text="profile.title" />
        </div>
        <div class="fwd_content">
            <span class="fwd_text" v-text="message.text" />
            <Attachments v-if="message.attachments.length" :attachments="message.attachments" />
            <Forwarded :messages="message.fwd_messages" />
        </div>
    </div>
</template>

<script>
import Attachments from "~/components/Messages/Attachments";
import { mapGetters } from "vuex";

export default {
    name: "ForwardedMessages",
    components: { Attachments, Forwarded: () => import("~/components/Messages/Forwarded") },
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            current: "messages/Current"
        }),
        profile () {
            const { profiles } = this.current;
            const index = profiles.findIndex(p => p.id === this.message.from_id);
            return profiles[index];
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
    color: #000;
    font-weight: bold;
}

.fwd_text {
    color: #000;
}

.fwd_user img {
    display: inline-block;
    vertical-align: middle;
    border-radius: 100px;
    width: 20px;
}

</style>