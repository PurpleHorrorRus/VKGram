<template>
    <div class="audio_message">
        <i v-if="!play || ended" class="fas fa-play-circle" @click="_play" />
        <i v-else class="fas fa-pause-circle" @click.self="_play" />
        <div class="waveform">
            <div 
                v-for="(wv, index) of audio_message.waveform" 
                :key="index" class="waveform-item" 
                :style="{ height: ((wv / 1.5) + 2) + 'px' }" 
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // eslint-disable-next-line vue/prop-name-casing
        audio_message: {
            type: Object,
            required: true
        },
        ended: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data: () => ({
        play: false,
        determinate: false
    }),
    watch: {
        ended (newVal) {
            if (newVal) {
                this.play = false;
                this.determinate = false;
            }
        }
    },
    methods: {
        _play () {
            if (this.play) {
                this.$emit("pauseAudioMessage");
            } else if (!this.determinate) {
                this.determinate = true;
                this.$emit("playAudioMessage");
            } else this.$emit("resumeAudioMessage");
            return this.play = !this.play;
        }
    }
};
</script>

<style>
.audio_message {
    margin-top: 5px;
    padding: 5px;
}

.audio_message i {
    display: inline-block;
    vertical-align: middle;
    color: #039fff;
    font-size: 17pt;
}

.audio_message i:hover { cursor: pointer; }

.audio_message .waveform {
    display: inline-block;
    vertical-align: middle;
}

.audio_message .waveform .waveform-item {
    background: #039fff;
    width: 2px;
    display: inline-block;
    width: 1px;
}

</style>