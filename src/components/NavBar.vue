<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Navbar',
});
</script>

<template>
  <div class="d-flex">
    <b-sidebar class="bg-light" width="250">
      <b-navbar-brand to="/">My App</b-navbar-brand>
      <b-nav vertical>
        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item to="/clock/5">Clock</b-nav-item>
        <b-nav-item to="/workingtimes/5">Workingtimes</b-nav-item>
        <b-nav-item to="/workingtime/5/">Add Working Time</b-nav-item>
        <b-nav-item to="/chartManager/5">Charts</b-nav-item>
      </b-nav>
    </b-sidebar>
    <div class="flex-grow-1">
      <slot></slot>
    </div>
  </div>
</template>



<style scoped>
.b-sidebar {
  height: 100vh; /* Full height */
  position: fixed; /* Fixed position */
}
</style>
