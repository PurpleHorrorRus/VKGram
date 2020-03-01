<template>
    <div class="conversation" @click="open">
        <div class="avatar-area">
            <div v-if="conversation.online > 0" class="conversation-online">
                <div v-if="!conversation.online_mobile" class="online-round" />
                <i v-else class="fa fa-mobile-alt" />
            </div>
            <img class="conversation-photo" :src="conversation.photo">
            <div v-if="isUnreadIn" class="conversation-unread-count">
                <span class="conversation-unread-count-label" v-text="conversation.unread_count" />
            </div>
        </div>
        <div class="content-area">
            <div class="content-area-info">
                <span class="converstaion-title" v-text="conversation.title" />
                <span class="conversation-message" v-html="conversation.message.text" /> 
            </div>
        </div>
        <div class="info-area">
            <span class="conversation-time" v-text="time" />
            <div v-if="isUnreadOut" class="conversation-unread">
                <div class="conversation-unread-round" />
            </div>
        </div>
    </div>
</template>

<script>
import misc from "~/assets/misc";
export default {
    props: {
        conversation: {
            type: Object,
            required: true
        }
    },
    computed: {
        isUnread () { return this.isUnreadIn || this.isUnreadOut; },
        isUnreadIn () { return this.conversation.unread_count !== 0; },
        isUnreadOut () { return this.conversation.out_read !== this.conversation.msg_id; },
        time () { return misc.FormatTime(this.conversation.message.date); }
    },
    methods: {
        open () {
            const { id } = this.conversation;
            this.$router.replace(`/messages/${id}`);
        }
    }
};
</script>

<style>
.conversation {
    display: grid;
    grid-template-columns: 50px minmax(10px, 1fr) 40px;
    grid-template-rows: 42px;
    grid-template-areas: "avatar-area content-area info-area";
    padding: 5px;
    user-select: none;
}

.conversation:hover {
    cursor: pointer;
    background: rgb(46, 46, 46);
}

.avatar-area { 
    grid-area: avatar-area; 
    display: inline-block;
}

.conversation-online {
    position: relative;
    display: block;
}

.conversation-online .online-round, .conversation-online i {
    position: absolute;
    bottom: 10px;
    left: 5px;
    background: rgb(0, 212, 149);
    width: 5px;
    height: 5px;
    border-radius: 50px;
    top: 35px;
}

.conversation-online i {
    font-size: 7pt;
    top: 30px;
    height: 10px;
    background: none;
    color: rgb(0, 212, 149);
}

.content-area { 
    grid-area: content-area; 
    display: inline-block;
}

.info-area { 
    grid-area: info-area;
    position: relative;
}

.conversation-unread-round {
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 100px;
    background: rgb(117, 117, 252);
}

.conversation-photo { 
    width: 40px;
    height: 40px;
    border-radius: 50px; 
}

.converstaion-title {
    display: block;
    width: max-content;
    max-width: 100%;
}

.conversation-message {
    display: block;
    width: max-content;
    max-width: 100%;
}

.chat-name {
    display: inline;
    color: #ccc;
}

.message-body {
    display: inline;
    max-width: 100%;
    color: #919191;
}

.conversation-attachment {
    color: #0d99de;
    display: inline;
}

.conversation span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.conversation-time {
    display: block; 
    text-align: right;
    font-size: 9pt; 
}

.conversation-unread {
    float: right;
    margin: 10px;
}

.conversation-unread-count {
    width: 12px;
    height: 12px;
    background: #ff0000;
    border-radius: 50px;
    position: relative;
    left: 60%;
    bottom: 35%;
    text-align: center;
}

.conversation-unread-count-label {
    display: block;
    width: 80%;
    max-width: 80%;
    font-size: 8pt;
    color: #fff;
    position: relative;
}
</style>