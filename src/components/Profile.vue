<template>
  <b-container class="mt-5">
    <b-card class="user-card">
      <b-row class="mb-4">
        <b-col cols="3" class="text-center">
          <img class="avatar" src="@/assets/avatar.jpeg" alt="User Avatar" />
        </b-col>
        <b-col>
          <h3>My Profile</h3>
          <p>My role: {{ user.role }} Employee</p>
          <p>My manager : {{ user.manager_id }}John Doe</p>
        </b-col>
      </b-row>

      <b-form>
        <b-form-group label="Username:" label-for="username">
          <b-form-input 
            id="username" 
            v-model="editedUser.username" 
            @input="checkForChanges" 
            placeholder="Enter your username"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Email:" label-for="email">
          <b-form-input 
            id="email" 
            type="email" 
            v-model="editedUser.email" 
            @input="checkForChanges" 
            placeholder="Enter your email"
          ></b-form-input>
        </b-form-group>

        <div v-if="hasChanges" class="hasChanges mt-3" id="btns">
          <b-button @click="resetChanges">Reset</b-button>
          <b-button class="btn btn-success" @click="submitChanges">Submit</b-button>
        </div>

        <div id="btns">
          <b-button @click="cancel">Cancel</b-button>
          <b-button class="btn btn-success" @click="goToChangePassword">Change Password</b-button>
          <b-button class="btn btn-danger" @click="deleteAccount">Delete Account</b-button>
        </div>
      </b-form>
    </b-card>
  </b-container>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';

  const user = reactive({
    // todo : recuperer userID
    id: 23, 
    username: 'Amelia Harper',
    email: 'amelia.harper@google.com',
    role: 'Employee',
    manager_id: 1
  });

  const editedUser = reactive({
    username: user.username,
    email: user.email,
  });

  const hasChanges = ref(false);
  const router = useRouter();

  const checkForChanges = () => {
    hasChanges.value = user.username !== editedUser.username || user.email !== editedUser.email;
  };

  const resetChanges = () => {
    editedUser.username = user.username;
    editedUser.email = user.email;
    hasChanges.value = false;
  };

  const submitChanges = async () => {
    try {
      const response = await axios.put(`http://134.209.208.89:4000/api/users/${user.id}`, {
        username: editedUser.username,
        email: editedUser.email,
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
        user.username = editedUser.username;
        user.email = editedUser.email;
        hasChanges.value = false;
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    }
  };

  const cancel = () => {
    router.push("/home");
  };

  const goToChangePassword = () => {
    router.push("/changePassword");
  };

  const deleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.delete(`http://134.209.208.89:4000/api/users/${user.id}`);
        router.push("/");
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };
</script>

<style scoped>
.avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid white;
  }
  .user-card {
    max-width: 600px;
    margin: 20px auto;
    padding: 30px;
  }

  .hasChanges {
    border-bottom: 2px solid rgb(139, 138, 138);
  }

  #btns {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    margin-top: 40px;
  }

  p {
    margin: 0;
  }
</style>