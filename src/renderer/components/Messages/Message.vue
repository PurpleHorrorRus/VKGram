<template>
    <div class="message-block" :class="{ 'my-message': message.out }">
        <div class="message_avatar" :class="{ 'my-message': message.out }">
            <img class="message_avatar_image" :src="profile.photo">
        </div>
        <div class="message" :class="{ nobg, 'my-message': message.out }">
            <div class="message__text">
                <div class="message__user">
                    <span class="message__user_label" v-text="profile.title" />
                </div>
                <span v-if="message.text" class="message_text" v-text="message.text" />
                <Attachments 
                    v-if="message.attachments.length"
                    :attachments="message.attachments"
                />
                <div class="message__text__content">
                    <span class="message__time" v-text="time" />
                    <div v-if="!message.read_state" class="message_unread" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { MessageType } from "~/types/Messages/MessageType";
import { CacheProfileType } from "~/types/Messages/CacheProfileType";

import Attachments from "~/components/Messages/attachments";

import misc from "~/assets/misc";

export default {
    name: "Message",
    components: { Attachments },
    props: {
        message: {
            type: MessageType,
            required: true
        },
        profile: {
            type: CacheProfileType,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            ID: "vk/GetID"
        }),
        time () {
            return misc.FormatTime(this.message.date);
        },
        nobg () {
            if (!this.message.attachments.length) return false;
            return this.message.attachments[0].type === "graffiti";
        }
    }
};
</script>

<style>
*,
:after, :before {box-sizing: border-box; }
.message-block { display: flex; }

.message {
  display: flex;
  align-items: center;
  position: relative;
  min-height: 30px;
  max-width: 330px;
  background-color: #fff;
  margin-bottom: 8px;
  border-radius: 6px;
  z-index: 2;
  box-shadow: 0 2px 1px 0 rgba(160, 172, 182, 0.5);
  width: max-content;
}
.message:hover { cursor: pointer; }

.message-block.my-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}
.message.my-message {
  background-color: #effdde;
  box-shadow: 0 2px 1px 0 rgba(93, 196, 82, 0.5);
}
.message.nobg {
  background: none;
  box-shadow: none;
  background-color: none;
}
.nobg .message__user_label {
    color: #fff;
}
.message.choosed {
  background: rgb(13, 103, 144);
}
.message.prevIsMine {
  margin-left: 35px;
}
.message.my-message.message.prevIsMine {
  margin-left: 0px;
  margin-right: 35px;
}

.message__user_label {
  font-size: 12pt;
  font-weight: 600;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  color: #000;
}

.message_text {
  width: 100%;
  display: inline-block;
  font-size: 10pt;
  color: #000;
}

.message__text,
.message__image__text .message__text__content {
  width: 100%;
  padding-top: 4px;
  padding-left: 10px;
  padding-right: 10px;
  z-index: 2;
}

.message__image,
.message__image__text {
  position: relative;
  z-index: 2;
}
.message__image {
  border-radius: 6px;
}
.message__image__content {
  border-radius: 6px;
  margin-bottom: -3px;
  max-width: 100%;
}

.message__time {
  display: block;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 14px;
  text-align: right;
  font-size: 12px;
  color: #a0acb6;
  float: right;
}
.my-message .message__time {
  color: #5dc452;
}
.message__image .message__time {
  display: inline-block;
  float: initial;
  position: absolute;
  bottom: 4px;
  right: 4px;
  padding: 4px;
  color: #fff;
  background-color: rgba(38, 50, 56, 0.5);
  border-radius: 6px;
  transition: opacity 0.2s linear;
  opacity: 0;
}
.message__image:hover .message__time {
  opacity: 1;
}

.message_unread {
  width: 5px;
  height: 5px;
  border-radius: 50px;
  background: #5dc452;
  display: block;
  padding-top: 4px;
  margin-top: 8px;
  margin-right: -10px;
  float: right;
}

.message_avatar {
  width: 30px;
  height: 30px;
  margin-right: 5px;
  float: left;
}

.message_avatar .message_avatar_image {
  width: 30px;
  height: 30px;
  border-radius: 50px;
}

.message_avatar.my-message {
  float: right;
  margin-right: 0px;
  margin-left: 5px;
}
</style>