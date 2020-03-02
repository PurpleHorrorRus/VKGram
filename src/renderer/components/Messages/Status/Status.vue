<template>
    <div v-if="!online" id="status-offline">
        <span id="messages-last-seen" v-text="lastSeen.time" />
        <StatusIcons :online="online" :platform="lastSeen.platform" />
    </div>
    <div v-else id="status-online">
        <StatusIcons :online="online" :platform="lastSeen.platform" />
    </div>
</template>

<script>
import StatusIcons from "~/components/Messages/Status/StatusIcons";

import { mapGetters } from "vuex";

export default {
    components: { StatusIcons },
    props: {
        lastSeen: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            current: "messages/Current"
        }),
        online () { return this.current.conversation.online === 1; }
    }
};
</script>

<style>
#status-online span, #status-online i { color: rgb(128, 255, 185); }
#status-offline span, #status-offline i { color: rgb(110, 110, 110); }
</style>