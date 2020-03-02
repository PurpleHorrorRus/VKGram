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

<script lang="ts">
export default {
    data: () => ({
        value: "",
        shift: false,
        ctrl: false,
        loading: false
    }),
    methods: {
        press (e) {
            const { keyCode } = e;
            if (keyCode === 13) {
                if (!this.shift) {
                    if (this.loading) return;
                    e.preventDefault();

                    const message: string = this.value.trim();
                    if (!message) return;

                    this.value = "";
                    
                    return this.$emit("send", message);
                }
            }
        },
        unpress (e) {
            const { keyCode } = e;
            if (keyCode === 16) this.shift = false;
            if (keyCode === 171) this.ctrl = false;
        }
    }
};
</script>

<style>
#input {
    display: block;
    width: 100%;
    height: 100%;
    padding: 5px;
    border-top: 1px solid rgb(92, 92, 92);
    
}

#input-field {
    display: block;
    width: 90%;
    height: 100%;
    background: none;
    border: none;
    outline: none;
    color: #fff;
    font-family: Roboto;
}
</style>