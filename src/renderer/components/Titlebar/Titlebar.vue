<template>
    <div id="titlebar">
        <div id="drag-region">
            <i id="titlebar-settings-icon" class="fas fa-cog" />
            <span id="label" v-text="'VKGram'" />
        </div>
        <div id="minimize" class="button" @click="minimize">
            <i class="far fa-window-minimize" />
        </div>
        <div v-if="!maximized" id="maximize" class="button" @click="maximize">
            <i class="fas fa-compress" />
        </div>
        <div v-else id="restore" class="button" @click="restore">
            <i class="fas fa-compress" />
        </div>
        <div id="close" class="button" @click="close">
            <i class="fas fa-times" />
        </div>
    </div>
</template>

<script>
import { remote } from "electron";

export default {
    data: () => ({ 
        maximized: false,
        hold: false
    }),
    computed: {
        window () { return remote.getCurrentWindow(); }
    },
    mounted () {
        return this.window.on("resize", () => {
            if (this.maximized && !this.hold) {
                this.maximized = false;
            }
        });
    },
    methods: {
        minimize () { return this.window.minimize(); },
        maximize () { 
            this.hold = true;
            this.maximized = true;
            this.window.maximize(); 
            return setTimeout(() => this.hold = false, 200);
        },
        restore () { 
            this.maximized = false;
            return this.window.restore(); 
        },
        close () { return this.window.close(); }
    }
};
</script>

<style>
#titlebar {
    display: grid;
    grid-template-columns: 1fr 45px 45px 45px;
    grid-template-rows: 100%;
    grid-template-areas: "drag-region minimize maximize close";
    height: 100%;
    width: 100%;
}

#titlebar * {
    display: inline;
    vertical-align: middle;
}

#titlebar #titlebar-settings-icon {
    margin-left: 5px;
    font-size: 9pt;
}

#titlebar-settings-icon:hover {
    cursor: pointer;
    color: rgb(117, 117, 252);
}

#titlebar #label {
    display: inline-block;
    font-family: Acme;
    user-select: none;
    margin: 5px;
    margin-left: 0px;
}

#drag-region { 
    grid-area: drag-region; 
    -webkit-app-region: drag;
}

.button {
    user-select: none;
    text-align: center;
    padding: 5px;
}

.button:hover {
    cursor: pointer;
    background: rgb(73, 73, 73);
}

.button i {
    font-weight: 400;
    text-align: center;
    font-size: 10pt;
}

#minimize { grid-area: minimize; }
#maximize { grid-area: maximize; }
#restore { grid-area: maximize; }
#close { grid-area: close; }
#close:hover { background: rgb(128, 0, 0); }
</style>