<template>
    <div class="document-file" @click="open">
        <div class="file-icon">
            <i class="fas fa-file" />
        </div>
        <div class="file-info">
            <span class="file-name nowrap" v-text="document.title" />
            <span class="file-size" v-text="size" />
        </div>
    </div>
</template>

<script>
import { shell } from "electron";

export default {
    props: {
        document: {
            type: Object,
            required: true
        }
    },
    computed: {
        size () {
            return Math.ceil(this.document.size / 1024) + " KB";
        }
    },
    methods: {
        open () { return shell.openExternal(); }
    }
};
</script>

<style>
.document-file {
    display: grid;
    grid-template-columns: 50px minmax(0px, 100%);
    grid-template-rows: 1fr;
    grid-template-areas: "file-icon file-info";
    margin-top: 5px;
}
.document-file:hover .file-name {
    text-decoration: underline;
}
.file-icon { 
    display: block;
    grid-area: file-icon; 
    background: rgb(66, 66, 66);
    padding: 15px;
    padding-left: 17px;
    font-size: 18pt;
    border-radius: 50px;
}
.file-info { 
    grid-area: file-info; 
    padding-left: 5px;
    padding-top: 10px;
    vertical-align: middle;
}
.file-name {
    display: block;
    width: max-content;
    max-width: 100%;
    color: rgb(91, 169, 233);
}

.file-size {
    color: rgb(96, 96, 96);
    font-size: 9pt;
}
</style>