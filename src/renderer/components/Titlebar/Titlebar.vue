<template>
    <div style="background: rgb(27, 27, 27); height: 32px; grid-area: titlebar; border-radius: 7px 7px 0px 0px;">
        <div class="window-title">
            <span class="meridius-label" v-text="'VKGram'" />
        </div> 
        <div id="region">
            <div id="electron-titlebar" class="drag maximize minimize">
                <div style="width: 100%; height: 100%; position: absolute;">
                    <div class="drag" style="position: absolute; width: 100%; height: 100%; top: 0px; left: 0px;" />
                </div>
                <div class="button button-close" @click="close">
                    <img class="button-img-close" :src="close_button">
                </div>
                <div class="button button-minimize" @click="minimize">
                    <img class="button-img-minimize" :src="minimize_button">
                </div>
                <div v-if="!maximized" class="button button-maximize" @click="maximize">
                    <img class="button-img-maximize" :src="maximize_button">
                </div>
                <div v-else class="button button-restore" @click="restore">
                    <img class="button-img-restore" :src="restore_button">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import captionButtons from "~/components/Titlebar/caption-buttons.svg";
import close from "~/components/Titlebar/close.svg";
import maximize from "~/components/Titlebar/maximize.svg";
import minimize from "~/components/Titlebar/minimize.svg";
import restore from "~/components/Titlebar/restore.svg";
import { mapGetters, mapActions } from "vuex";

const platform = process.platform;

export default {
    data: () => ({ maximized: false }),
    computed: {
        ...mapGetters({
            settings: "settings/getSettings"
        }),
        close_button () { 
            if (platform === "linux") return close;
            else return captionButtons + "#close";
        },
        minimize_button () { 
            if (platform === "linux") return minimize;
            else return captionButtons + "#minimize";
        },
        maximize_button () { 
            if (platform === "linux") return maximize;
            else return captionButtons + "#maximize";
        },
        restore_button () { 
            if (platform === "linux") return restore;
            else return captionButtons + "#restore";
        }
    },
    created () {
        const win = require("electron").remote.getCurrentWindow();
        win.on("maximize", () => this.maximized = true);
        win.on("restore", () => this.maximized = false);
        this.buttons_path = `${window.location.protocol}//${window.location.host}/${this.buttons_path}`;
        document.body.parentNode.setAttribute("electron-titlebar-platform", platform);
        for (const elem of document.querySelectorAll("#electron-titlebar > .button")) {
            elem.addEventListener("mouseover", () => elem.classList.add("hover"));
            elem.addEventListener("mouseout", () => elem.classList.remove("hover"));
        }
    },
    methods: {
        ...mapActions({
            saveSettings: "settings/saveSettings"
        }),
        minimize () {
            const window = require("electron").remote.getCurrentWindow();
            return window.minimize();
        },
        maximize () {
            const window = require("electron").remote.getCurrentWindow();
            window.maximize();
            return this.maximized = true;
        },
        restore () {
            const window = require("electron").remote.getCurrentWindow();
            window.unmaximize();
            return this.maximized = false;
        },
        close () {
            const window = require("electron").remote.getCurrentWindow();
            return window.close();
        },
        expand () {
            this.settings.expand = !this.settings.expand;
            return this.saveSettings(this.settings);
        }
    }
};
</script>

<style>
#expand-icon {
    position: relative;
    transition: all .5s ease;
    width: max-content;
    display: inline-block;
    margin-right: 6px;
    vertical-align: middle;
    pointer-events: all;
}

#expand-icon svg:hover {
    color: rgb(117, 117, 252);
    cursor: pointer;
}

#electron-titlebar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 40px;
    -webkit-user-select: none;
    cursor: default;
    pointer-events: none;
    z-index: 0;
}

#region {
    position: absolute;
    height: 31px;
    width: 97%;
    right: 0px;
}

.window-title {
    position: absolute;
    color: white;
    font-size: 17pt;
    user-select: none;
    display: inline;
}

.meridius-label {
    font-family: 'Acme', sans-serif;
    display: inline-block;
    vertical-align: middle;
    font-size: 17pt;
}

html[electron-titlebar-platform=win32] .window-title {
    left: 12px;
    font-size: 13pt;
}

html[electron-titlebar-platform=linux] .window-title {
    left: 24px;
}

#electron-titlebar .drag {
    -webkit-app-region: drag;
}

#electron-titlebar > .button img {
    position: absolute;
    cursor: default;
    -webkit-app-region: no-drag;
}

html.darwin #electron-titlebar > .button {
    display: none;
}

#electron-titlebar > .button {
    position: absolute;
    cursor: default;
    pointer-events: all;
    -webkit-app-region: no-drag;
}

/* no-maximize or no-minimize */

#electron-titlebar.no-minimize > .button-minimize {
    display: none !important;
}

#electron-titlebar.no-maximize > .button-maximize {
    display: none !important;
}

html[electron-titlebar-platform=linux] #electron-titlebar > .button {
    top: 5px;
    width: 16px;
    height: 16px;
}

html[electron-titlebar-platform=linux] #electron-titlebar > .button.hover {
    background-color: rgba(196, 196, 196, 0.4);
}

html[electron-titlebar-platform=linux] #electron-titlebar > .button:active {
    background-color: rgba(168, 168, 168, 0.5);
}

/* normal */

html[electron-titlebar-platform=linux] #electron-titlebar > .button-close {
    left: 5px;
}

html[electron-titlebar-platform=linux] #electron-titlebar > .button-maximize {
    right: 5px;
}

html[electron-titlebar-platform=linux] #electron-titlebar > .button-minimize {
    right: 28px;
}

html[electron-titlebar-platform=linux] #electron-titlebar.no-maximize > .button-minimize {
    right: 5px;
}

/* inset */

html[electron-titlebar-platform=linux] #electron-titlebar.inset > .button {
    top: 12px;
}

html[electron-titlebar-platform=linux] #electron-titlebar.inset > .button-close {
    left: 12px;
}

html[electron-titlebar-platform=linux] #electron-titlebar.inset > .button-maximize {
    right: 12px;
}

html[electron-titlebar-platform=linux] #electron-titlebar.inset.no-maximize > .button-minimize {
    right: 12px;
}

html[electron-titlebar-platform=linux] #electron-titlebar > .button-restore {
    right: 12px;
}

html[electron-titlebar-platform=linux] #electron-titlebar.inset > .button-minimize {
    right: 40px;
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button {
    top: 0px;
    width: 45px;
    height: 29px;
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button.hover {
    background-color: rgba(196, 196, 196, 0.4);
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button:active {
    background-color: rgba(168, 168, 168, 0.5);
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button-close {
    right: 0px;
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button-close.hover {
    background-color: #e81123;
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button-close:active {
    background-color: rgba(232, 17, 35, 0.6);
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button img {
    margin-top: 8.5px;
    margin-left: 16.5px;
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button-close.hover img, 
html[electron-titlebar-platform=win32] #electron-titlebar > .button-close:active img {
    filter: invert(100%);
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button-maximize {
    right: 45px;
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button-restore {
    right: 45px;
}

html[electron-titlebar-platform=win32] #electron-titlebar > .button-minimize {
    right: 90px;
}

html[electron-titlebar-platform=win32] #electron-titlebar.no-maximize > .button-minimize {
    right: 45px;
}

/* inset */

html[electron-titlebar-platform=win32] #electron-titlebar.inset > .button img {
    margin-top: 14px;
    margin-left: 14px;
}

html[electron-titlebar-platform=win32] #electron-titlebar.inset > .button {
    width: 40px;
    height: 40px;
}

html[electron-titlebar-platform=win32] #electron-titlebar.inset > .button-maximize {
    right: 40px;
}

html[electron-titlebar-platform=win32] #electron-titlebar.inset > .button-minimize {
    right: 80px;
}

html[electron-titlebar-platform=win32] #electron-titlebar.inset.no-maximize > .button-minimize {
    right: 40px;
}
</style>