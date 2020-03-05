<template>
    <div id="search">
        <i id="search-icon" class="fas fa-search" />
        <input 
            id="search-input" 
            v-model="q"
            placeholder="Поиск" 
            type="text" 
            @keypress.enter="Search"
        >
    </div>
</template>

<script>
export default {
    data: () => ({
        q: ""
    }),
    methods: {
        Search () { return this.$router.replace(`/search/${this.q}`); }
    }
};
</script>

<style>
#search {
    grid-area: Search;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding: 10px;
}

#search-icon {
    display: block;
    position: absolute;
    left: 10px;
    font-size: 12pt;
    padding: 8px;
    color: rgb(116, 116, 116);
}

#search-input {
    height: 100%;
    width: 92%;
    background: rgba(255, 255, 255, .2);
    border-radius: 5px;
    border: none;
    outline: none;
    padding-left: 30px;
    padding-right: 5px;
    font-size: 9pt;
}
</style>