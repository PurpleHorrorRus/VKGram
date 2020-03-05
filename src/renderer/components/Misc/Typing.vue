<template>
    <div class="typing">
        <i class="fas fa-pen typing-pen" />
        <span class="typing-text" v-text="'Набирает сообщение...'" />
    </div>
</template>

<script>
export default {

};
</script>

<style>

@keyframes slide {
    from {
        left: 0px
    }
    to {
        left: 5px
    }
}

.typing {
    display: inline-block;
    width: max-content;
    vertical-align: middle;
}

.typing * {
    font-size: 9pt;
    color: #969696;
}

.typing-pen {
    position: relative;
    display: inline-block;
    width: 15px;
    animation: slide .6s infinite;
}

.typing-text {
    vertical-align: middle;
}
</style>