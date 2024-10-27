<template>
    <div class="container">
      <h2 class="my-4">Employees</h2>
  
      <!-- Checkbox pour afficher uniquement les employés sans manager -->
      <b-form-checkbox v-model="showWithoutManager" class="mb-3">
        Only show employees without a manager
      </b-form-checkbox>
  
      <!-- Tableau d'employés -->
      <b-table :items="filteredEmployees" :fields="fields" responsive="sm" striped hover>
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template #cell(username)="data">
          {{ data.item.username }}
        </template>
        <template #cell(email)="data">
          {{ data.item.email }}
        </template>
        <template #cell(action)="data">
          <a href="#" class="text-success" @click.prevent="addEmployeeToManager(data.item)">
            Add to my employees
          </a>
        </template>
      </b-table>
    </div>
</template>
  
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  
  const userId = ref<number>(5); //todo : recuperer dynamiquement
  const showWithoutManager = ref(false);
  const employees = ref<Array<{ id: number; username: string; email: string; manager_id: number | null }>>([]);
  
  // Champs du tableau
  const fields = [
    { key: 'index', label: 'N°' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'action', label: 'Action' }
  ];
  
  const fetchEmployees = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/users');
        employees.value = response.data.data;
    } catch (error) {
        console.error("Failed to fetch employees:", error);
    }
    };
  
  // Filtrer les employés en fonction de l'option cochée (sans manager)
  const filteredEmployees = computed(() => {
    if (showWithoutManager.value) {
      return employees.value.filter(employee => employee.manager_id == null);
    }
    return employees.value;
  });
  
  // Ajouter un employé au manager actuel
  const addEmployeeToManager = async (employee: { id: number; username: string }) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/users/${employee.id}`, {
        user: { manager_id: userId.value }
      });
      
      if (response.status === 200) {
        alert(`Added ${employee.username} to your employees`);
        // Mettre à jour la liste des employés après la modification
        await fetchEmployees();
      }
    } catch (error) {
      console.error("Failed to assign manager to employee:", error);
      alert(`Failed to add ${employee.username} to your employees.`);
    }
  };
  onMounted(fetchEmployees);
</script>
  