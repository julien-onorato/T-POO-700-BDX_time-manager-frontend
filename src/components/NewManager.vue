<template>
    <div class="container">
      <h2 class="my-4">Manage Managers</h2>
  
      <!-- Barre de recherche -->
      <b-form-group label="Search:" label-for="search-input">
        <b-form-input id="search-input" v-model="searchQuery" placeholder="Search by username or email..."></b-form-input>
      </b-form-group>
  
      <!-- Tableau -->
      <b-table :items="filteredData" :fields="fields" responsive="sm" striped hover class="mt-3">
        <template #cell(index)="data">{{ data.index + 1 }}</template>
        <template #cell(action)="data">
          <b-button class="btn btn-success" @click="makeManager(data.item)">New Manager</b-button>
        </template>
      </b-table>
    </div>
</template>
  
<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import axios from 'axios';

    const searchQuery = ref<string>('');
    const gridData = ref<Array<{ username: string; email: string; role: string }>>([]);
    const sortKey = ref<string>('username');
    const sortOrders = ref<{ [key: string]: number }>({
        username: 1,
        email: 1,
    });
  
    // Colonnes du tableau
    const fields = [
    { key: 'index', label: 'N°' },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'action', label: 'Action' },
    ];

    // Fonction pour récupérer les employés
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/users');
            gridData.value = response.data.filter((user: { role: string }) => user.role === 'Employee');
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        }
    };
    onMounted(fetchEmployees);
  
    // Filtrer et trier
    const filteredData = computed(() => {
    let data = gridData.value;
    const filterKey = searchQuery.value.toLowerCase();
    // Filtre
    if (filterKey) {
        data = data.filter(row =>
        Object.values(row).some(value =>
            String(value).toLowerCase().includes(filterKey)
        )
        );
    }
    // Tri
    if (sortKey.value) {
        data = [...data].sort((a, b) => {
        const aValue = a[sortKey.value as keyof typeof a];
        const bValue = b[sortKey.value as keyof typeof b];
        return (aValue === bValue ? 0 : aValue > bValue ? 1 : -1) * sortOrders.value[sortKey.value];
        });
    }

    return data;
    });
  
    // Fonction pour passer l'employé à "Manager"
    const makeManager = async (entry: { id: number; username: string }) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/users/${entry.id}`, {
            user: { role: "Manager" }
            });
            
            if (response.data.status === "success") {
            alert(`New Manager assigned: ${entry.username}`);
            // Actualiser la liste d'utilisateurs ou effectuer toute autre action nécessaire
            }
        } catch (error) {
            console.error("Failed to update user role:", error);
            alert(`Failed to assign Manager role to ${entry.username}.`);
        }
    };
</script>
  
<style scoped>
  .container {
    max-width: 800px;
  }
</style>
  