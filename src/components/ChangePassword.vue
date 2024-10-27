<template>
  <b-container class="mt-5">
    <b-card class="change-password-card">
      <h3 class="text-center">Change Password</h3>
      <b-form @submit.prevent="submitPasswordChange">

        <!-- Current Password -->
        <b-form-group label="Current Password:" label-for="current-password">
          <b-form-input
            type="password"
            id="current-password"
            v-model="passwords.current"
            placeholder="Enter current password"
            required
          ></b-form-input>
        </b-form-group>

        <!-- New Password -->
        <b-form-group label="New Password:" label-for="new-password">
          <b-form-input
            type="password"
            id="new-password"
            v-model="passwords.newPassword"
            placeholder="Enter new password"
            required
          ></b-form-input>
        </b-form-group>

        <!-- Confirm New Password -->
        <b-form-group label="Confirm New Password:" label-for="confirm-password">
          <b-form-input
            type="password"
            id="confirm-password"
            v-model="passwords.confirmPassword"
            placeholder="Confirm new password"
            required
          ></b-form-input>
        </b-form-group>

        <b-alert variant="danger" v-if="errorMessage" show>{{ errorMessage }}</b-alert>

        <div id="btns" class="d-flex justify-content-between mt-4">
          <b-button @click="cancel">Cancel</b-button>
          <b-button class="btn btn-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-card>
  </b-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const passwords = ref({
  current: '',
  newPassword: '',
  confirmPassword: '',
});

const errorMessage = ref('');
const router = useRouter();
// todo : recuperer userID
const userID = ref(2);

const submitPasswordChange = async () => {
  errorMessage.value = '';
  if (passwords.value.newPassword !== passwords.value.confirmPassword) {
    errorMessage.value = "New passwords don't match!";
    return;
  }
  try {
    const response = await axios.put(`http://134.209.208.89:4000/api/users/${userID}/password`, {
      currentPassword: passwords.value.current,
      newPassword: passwords.value.newPassword,
    });

    if (response.status === 200) {
      alert('Password changed successfully!');
      passwords.value.current = '';
      passwords.value.newPassword = '';
      passwords.value.confirmPassword = '';
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Failed to change password. Please try again.';
  }
};

const cancel = () => {
  router.push("/profile");
};
</script>

<style scoped>
.change-password-card {
  max-width: 600px;
  margin: 20px auto;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
}

#btns {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
