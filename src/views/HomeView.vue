<script setup lang="ts">
import ChartManager from "@/components/ChartManager.vue";
import ClockManager from "@/components/ClockManager.vue";
import WorkingTimes from "@/components/WorkingTimes.vue";
import {defineComponent, ref} from "vue";

// State for burger menu toggle
const isMenuOpen = ref(false);

// Function to handle disconnection with confirmation
const disconnect = () => {
  if (confirm("Are you sure you want to disconnect?")) {
    // Implement your disconnection logic here
    console.log("User disconnected");
  }

};
 defineComponent({
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
});
</script>

<template>
  <header class="navbar">
    <div class="logo">App Logo</div>
    <div class="navbar-right">
      <img class="avatar" src="@/assets/avatar.jpeg" alt="User Avatar" />
      <button @click="disconnect" class="disconnect-button" aria-label="Disconnect">Disconnect</button>
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="burger-menu"
        :aria-expanded="isMenuOpen"
        aria-label="Toggle menu"
      >
        ☰
      </button>
    </div>
    <nav v-if="isMenuOpen" class="dropdown-menu">
      <ul>
        <li><router-link to="/profile">Profile</router-link></li>
        <li><router-link to="/settings">Settings</router-link></li>
        <li><router-link to="/help">Help</router-link></li>
      </ul>
    </nav>
  </header>
  <main class="grid-container">
    <section class="grid-item full-width">
      <WorkingTimes user-id="5" />
    </section>
    <section class="grid-item">
      <ChartManager user-id="5" />
    </section>
    <section class="grid-item">
      <ClockManager />
    </section>
  </main>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
}

.disconnect-button {
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
}

.burger-menu {
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}

.dropdown-menu {
  position: absolute;
  right: 1rem;
  background-color: white;
  color: black;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 1000; /* Ensure it is on top */
}

.dropdown-menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  padding: 0.5rem 1rem;
}

.dropdown-menu a {
  text-decoration: none;
  color: black;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columns for ChartManager and ClockManager */
  grid-template-rows: auto auto; /* 2 rows, with auto height */
  gap: 1rem; /* Adds space between sections */
  padding: 1rem;
}

.full-width {
  grid-column: 1 / -1; /* Makes WorkingTimes span the full width */
}

.grid-item {
  background-color: #f5f5f5; /* Light gray background for visual separation */
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.grid-item:nth-child(2),
.grid-item:nth-child(3) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-clock-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.chart-clock-container > div {
  flex: 1; /* Make ChartManager and ClockManager take equal width */
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr; /* Stack all components on smaller screens */
  }

  .chart-clock-container {
    flex-direction: column; /* Stack ChartManager and ClockManager vertically */
  }
}
</style>
