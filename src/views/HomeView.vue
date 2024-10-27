<template>
  <header class="navbar">
    <div class="logo">App Logo</div>
    <div class="navbar-right">
      <img class="avatar" src="@/assets/avatar.jpeg" alt="User Avatar" />
      <button @click="toggleMenu">☰</button>
    </div>
    <nav v-if="isMenuOpen" class="profile-menu">
      <ul>
        <li><router-link to="/profile">Profile</router-link></li>
        <li><button @click="disconnect">Disconnect</button></li>
      </ul>
    </nav>
  </header>

  <main class="grid-container">
    <section class="grid-item full-width">
      <WorkingTimes :user-id="userId" />
    </section>
    <section v-if="!isGeneralManager" class="grid-item">
      <ClockManager />
    </section>
    <section v-if="isManager" class="grid-item">
      <EmployeeList />
    </section>
    <section v-if="isGeneralManager" class="grid-item">
      <NewManager/>
    </section>
    <section class="grid-item">
      <ChartManager  />
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import {onMounted, ref} from 'vue';
import axios from 'axios';

import ChartManager from "@/components/ChartManager.vue";
import ClockManager from "@/components/ClockManager.vue";
import WorkingTimes from "@/components/WorkingTimes.vue";
import NewManager from "@/components/NewManager.vue";
import EmployeeList from "@/components/EmployeeList.vue";

const router = useRouter();
const isMenuOpen = ref(false);
const isGeneralManager = ref(false);
const isManager = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const disconnect = async () => {
  if (confirm("Are you sure you want to disconnect?")) {
    try {
      await axios.delete("http://localhost:4000/api/logout");
      deleteCookie("token");
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  }
};

const deleteCookie = (name) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// const toggleRole = () => {
//   if (userID.role === "GeneralManager") {
//     isGeneralManager.value = true;
//   } else if (userID.role === "Manager") {
//     isManager.value = true;
//   }
// };
// onMounted(toggleRole);

const userId = ref<string>(''); // Use ref for reactivity

const getCurrentUser = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/current_user',{
      withCredentials: true // This allows sending cookies
    });
    console.log("Current user:", response);
    const userId = response.data.id;
    userId.value = userId.toString(); // Adjust based on the expected response
  } catch (error) {
    console.error("Error fetching current user:", error);
    // Optionally set an error state or message here
  }
};

onMounted(() => {
  getCurrentUser();
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
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
  object-fit: cover;
  border: 2px solid white;
}

button {
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}

.profile-menu {
  position: absolute;
  right: 1rem;
  top: 70px;
  background-color: white;
  color: black;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem;
  z-index: 1000;
  min-width: 150px;
  transition: opacity 0.3s ease;
}

.profile-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.profile-menu li {
  padding: 0.5rem 0;
}

.profile-menu li:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.profile-menu a,
.profile-menu button {
  text-decoration: none;
  color: black;
  font-size: 1rem;
  width: 100%;
  display: block;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.profile-menu a:hover,
.profile-menu button:hover {
  color: #198754;
}

.grid-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.grid-item {
  width: 100%;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .grid-container {
    flex-direction: column;
  }
}
</style>
