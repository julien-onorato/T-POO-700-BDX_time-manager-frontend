<template>
    <button @click="demoteManager" class="btn btn-danger">Demote</button>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  
  const managerID = ref(3);
  
  const demoteManager = async () => {
    const confirmed = confirm(`Are you sure you want to demote this user from manager to employee?`);
    if (confirmed) {
      try {
        // Mettre à jour le rôle du manager pour le changer en employé
        await axios.put(`http://localhost:4000/api/users/${managerID}`, {
          user: { role: "Employee" },
        });
        alert(`User demoted to employee.`);
      } catch (error) {
        console.error("Failed to demote manager", error);
        alert("Failed to demote manager.");
      }
    }
  };
</script> 