<template>
  <nav>
    <div class="user">
      <div v-if="user" class="user-details">
        <input v-model="username" type="text" :placeholder="user.username" />
        <input v-model="email" type="email" :placeholder="user.email" />
        <button @click="updateUser(username, email)">Update User</button>
        <button @click="deleteUser()">Delete User</button>
      </div>
      <div v-else class="user-create">
        <label>
          Username:
          <input v-model="username" type="text" placeholder="Enter username" />
        </label>
        <label>
          Email:
          <input v-model="email" type="email" placeholder="Enter email" />
        </label>
        <button @click="createUser(username, email)">Create User</button>
      </div>
    </div>
  </nav>
</template>
  
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useToast } from "vue-toastification";
  
  interface User {
  id: number;
  username: string;
  email: string;
}

const user = ref<User | null>(null);
const username = ref<string>('');
const email = ref<string>('');
const toast = useToast();

const createUser = async (username: string, email: string): Promise<void> => {
  try {
    const response = await axios.post<{ user: User }>('http://134.209.208.89:4000/api/users', {
      user: { username, email }
    });
    user.value = response.data.user;
    localStorage.setItem('user', JSON.stringify(user.value));
    toast.success("User created");
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error((error as any).message);
  }
};

const updateUser = async (username: String, email: String): Promise<void> => {
  if (!user.value) return;
  try {
    const response = await axios.put<{ user: User }>(`http://134.209.208.89:4000/api/users/${user.value.id}`, {
      user: {
        username: username,
        email: email
      }
    });
    user.value = response.data.user;
    localStorage.setItem('user', JSON.stringify(user.value));
    toast.success("User updated");
  } catch (error) {
    console.error('Error updating user:', error);
    toast.error((error as any).message);
  }
};

// Get User from localStorage
const getUser = (): void => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    user.value = JSON.parse(savedUser) as User;
  }
};

const deleteUser = async (): Promise<void> => {
  if (!user.value || !user.value.id) {
    console.error('User ID is undefined');
    return;
  }
  try {
    await axios.delete(`http://134.209.208.89:4000/api/users/${user.value.id}`);
    user.value = null;
    localStorage.removeItem('user');
    toast.success("User deleted");
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error((error as any).message);
  }
};

// Fetch the user when the component mounts
onMounted(() => {
  getUser();
});
</script>

<style scoped>
nav {
  background-color: #333;
  padding: 10px 20px;
}

.user {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: white;
  width: 100%;
}

h2 {
  margin: 0;
  margin-right: 20px;
}

.user-details, .user-create {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-details p, .user-create label {
  margin: 0;
  white-space: nowrap;
}

button {
  padding: 5px 10px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>