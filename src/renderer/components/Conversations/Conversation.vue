<template>
    <div class="conversation" @click="open">
        <div class="avatar-area">
            <StatusIcons 
                v-if="conversation.online" 
                :online="conversation.online" 
                :platform="conversation.online_mobile" 
            />
            <img class="conversation-photo" :src="conversation.photo">
            <div v-if="isUnreadIn" class="conversation-unread-count">
                <span class="conversation-unread-count-label" v-text="conversation.unread_count" />
            </div>
        </div>
        <div class="content-area">
            <div class="content-area-info">
                <span class="converstaion-title" v-text="conversation.title" />
                <div class="conversation-message-block">
                    <span v-if="conversation.message.append_name" 
                          class="chat-name" 
                          v-text="conversation.message.append_name" 
                    />
                    <span v-if="conversation.message.attachments.length" 
                          class="conversation-attachments" 
                          v-text="formatAttachments" 
                    />
                    <span class="conversation-message" v-text="conversation.message.text" />
                </div>
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
import StatusIcons from "~/components/Messages/Status/StatusIcons";
import misc from "~/assets/misc";
export default {
    components: { StatusIcons },
    props: {
        conversation: {
            type: Object,
            required: true
        }
    },
    computed: {
        isUnread () { return this.isUnreadIn || this.isUnreadOut; },
        isUnreadIn () { return this.conversation.unread_count !== 0; },
        isUnreadOut () { 
            const { message } = this.conversation;
            const { out, read_state } = message;
            return out && !read_state; 
        },
        time () { return misc.FormatTime(this.conversation.message.date); },
        formatAttachments () { return this.conversation.message.attachments.join(", "); }
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
    position: relative;
}

.avatar-area #online-circle, .avatar-area i {
    position: absolute;
    bottom: 0px;
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

.conversation-message-block {
    display: block;
    max-width: 95%;
    width: max-content;
    white-space: nowrap;
}

.conversation-message {
    display: inline-block;
    width: max-content;
    max-width: 100%;
}

.conversation-attachments {
    display: inline-block;
    color: rgb(91, 169, 233);
    max-width: 100;
    width: max-content;
}

.chat-name {
    display: inline-block;
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