<script setup lang="ts">

import { RouterLink, RouterView } from 'vue-router'
import Login from './components/Auth/Login.vue';
import Register from './components/Auth/Register.vue';

</script>

<template>
   <RouterView />
   <Login />
   <Register />
</template>