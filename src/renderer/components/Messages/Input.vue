<template>
    <div id="input">
        <textarea-autosize
            id="input-field"
            ref="input"
            v-model="value"
            placeholder="Ваше сообщение..."
            :min-height="40"
            :max-height="100"
            @keydown.native="press"
            @keyup.native="unpress"
        />
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data: () => ({
        value: "",
        shift: false,
        ctrl: false,
        loading: false
    }),
    computed: {
        ...mapGetters({
            vk: "vk/GetVK"
        })
    },
    mounted () { return this.$refs.input.$el.focus(); },
    methods: {
        press (e) {
            const { keyCode } = e;
            if (keyCode === 13) {
                if (!this.shift) {
                    if (this.loading) return;
                    e.preventDefault();

                    const message = this.value.trim();
                    this.value = "";

                    return this.$emit("send", message);
                }
            } else if (keyCode === 17) this.ctrl = true;
            else if (keyCode === 86) {
                if (!this.ctrl) return;
                return this.$emit("AddScreenshot");
            }
        },
        unpress (e) {
            const { keyCode } = e;
            if (keyCode === 16) this.shift = false;
            if (keyCode === 17) this.ctrl = false;
        }
    }
};
</script>

<style>
#input {
    grid-area: input;
    display: block;
    width: 100%;
    height: 100%;
    padding: 5px;
}

#input-field {
    display: block;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    outline: none;
    color: #fff;
    font-family: Roboto;
}

#sticker-picker-icon {
    display: inline-block;
}
</style>