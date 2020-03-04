<template>
    <div id="attachments-block">
        <div v-for="(attachment, index) of attachments" :key="index" class="attachment">
            <Sticker v-if="attachment.type == 'sticker'" :sticker="attachment.sticker" />
            <Photo v-if="attachment.type == 'photo'" :photo="attachment.photo" />
            <Video v-if="attachment.type == 'video'" :video="attachment.video" />
            <Wall v-if="attachment.type == 'wall'" :wall="attachment.wall" />
            <Graffiti v-if="attachment.type == 'graffiti'" :graffiti="attachment.graffiti" />
            <AudioMessage 
                v-if="attachment.type == 'audio_message'" 
                ref="audio_message" 
                :audio_message="attachment.audio_message" 
                :ended="!audio_message"
                @playAudioMessage="playAudioMessage" 
                @pauseAudioMessage="pauseAudioMessage" 
                @resumeAudioMessage="resumeAudioMessage" 
            />
            <Link v-if="attachment.type == 'link'" :link="attachment.link" />
        </div>
    </div>
</template>

<script>
import Sticker from "~/components/Messages/Attachments/Sticker";
import Photo from "~/components/Messages/Attachments/Photo";
import Video from "~/components/Messages/Attachments/Video";
import Wall from "~/components/Messages/Attachments/Wall";
import Graffiti from "~/components/Messages/Attachments/Graffiti";
import AudioMessage from "~/components/Messages/Attachments/AudioMessage";
import Link from "~/components/Messages/Attachments/Link";

export default {
    name: "Attachments",
    components: { Sticker, Photo, Video, Wall, Graffiti, AudioMessage, Link },
    props: {
        attachments: {
            type: Array,
            required: true
        }
    },
    data: () => ({ audio_message: undefined, audio_message_seek: 0 }),
    methods: {
        playAudioMessage () {
            this.audio_message = this.attachments[0].audio_message;
            const { link_mp3: url } = this.audio_message;
            
            this.audio_message = new Audio(url);
            this.audio_message.onended = () => {
                this.audio_message = undefined;
                return this.audio_message_seek = 0;
            };
            
            return this.audio_message.play();
        },
        pauseAudioMessage () {
            if (this.audio_message) {
                this.audio_message_seek = this.audio_message.currentTime;
                return this.audio_message.pause();
            }
        },
        resumeAudioMessage () {
            if (this.audio_message) {
                this.audio_message.play();
                return this.audio_message.currentTime = this.audio_message_seek;
            }
        }
    }
};
</script>