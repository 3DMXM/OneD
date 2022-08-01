<script lang="ts" setup>

import {ref} from 'vue'

let a = ref("测试")




</script>


<template>
    <h1>设置页面</h1>
    <input type="text" v-model="a">
</template>

<style>

</style>