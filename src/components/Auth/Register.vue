<template>
  <div class="signup-page d-flex justify-content-center align-items-center">
    <b-card class="shadow-lg p-5 mb-5 bg-white rounded text-center" style="max-width: 400px;">
      <h1 class="title mb-4">Time Manager</h1>
      <h2 class="subtitle mb-4">Signup</h2>
      <b-form @submit.prevent="register">
        <b-form-group label="USERNAME" label-for="username-input">
          <b-form-input
            id="username-input"
            v-model="username"
            placeholder="Enter your username"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="EMAIL" label-for="email-input">
          <b-form-input
            id="email-input"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="PASSWORD" label-for="password-input">
          <b-input-group>
            <b-form-input
              id="password-input"
              v-model="password"
              :type="passwordFieldType"
              placeholder="Enter your password"
              required
            ></b-form-input>
            <b-input-group-append>
              <b-button @click="togglePasswordVisibility" variant="outline-secondary">
                <i :class="passwordFieldType === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-button type="submit" variant="success" class="signup-btn mb-3" :disabled="isLoading">
          {{ isLoading ? 'SIGNING UP...' : 'SIGNUP' }}
        </b-button>

        <b-link class="d-block text-muted" @click.prevent="goToLogin">Already have an account? Login</b-link>

        <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
        <p v-if="offlineMessage" class="text-warning mt-3">{{ offlineMessage }}</p>
      </b-form>
    </b-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AuthService } from '@/services/AuthService';

export default defineComponent({
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errorMessage: "",
      offlineMessage: "",
      passwordFieldType: "password",
      isLoading: false,
      authService: new AuthService(),
    };
  },
  methods: {
    setUserId(userId: number) {
      localStorage.setItem('user_id', userId.toString());
    },

    async register() {
      this.isLoading = true;
      this.errorMessage = "";
      this.offlineMessage = "";

      try {
        const response = await this.authService.register({
          username: this.username,
          email: this.email,
          password: this.password,
        });

        if ('queued' in response) {
          this.offlineMessage = "You are offline. Your registration request will be processed when you're back online.";
        } else {
          // Store user_id in localStorage
          this.setUserId(response.user_id);
          this.$router.push("/");
        }
      } catch (error) {
        this.errorMessage = "Registration failed. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },

    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
    },

    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
  },
});
</script>

<style scoped>
/* ... styles restent inchangés ... */
</style>