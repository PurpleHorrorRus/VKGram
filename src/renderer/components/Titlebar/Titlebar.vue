<template>
    <div id="titlebar">
        <div id="drag-region">
            <span id="label" v-text="'VKGram'" />
        </div>
        <div id="minimize" class="button" @click="minimize">
            <minimize />
        </div>
        <div v-if="!maximized" id="maximize" class="button" @click="maximize">
            <maximize />
        </div>
        <div v-else id="restore" class="button" @click="restore">
            <restore />
        </div>
        <div id="close" class="button" @click="close">
            <close />
        </div>
    </div>
</template>

<script>
import minimize from "./minimize.svg";
import maximize from "./maximize.svg";
import restore from "./restore.svg";
import close from "./close.svg";
import { remote } from "electron";

export default {
    components: { minimize, maximize, restore, close },
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

#titlebar #label {
    display: inline-block;
    font-family: Acme;
    user-select: none;
    margin: 5px;
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

.button svg {
    font-size: 7pt;
    width: 10px;
    height: 15px;
    fill: #fff;
}

#minimize { grid-area: minimize; }
#maximize { grid-area: maximize; }
#restore { grid-area: maximize; }
#close { grid-area: close; }
#close:hover { background: rgb(128, 0, 0); }
</style>