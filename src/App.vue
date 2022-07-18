<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Drawer from './components/Drawer.vue'
</script>

<template>
    <Drawer />
    <div class="view">
        <router-view></router-view>
    </div>
</template>

<style>
@import url(mdui);
.view{
    width: calc(100% - 200px);
    margin-left: 200px;
}
</style>