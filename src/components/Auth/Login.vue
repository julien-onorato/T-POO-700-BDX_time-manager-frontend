<template>
  <div class="login-page d-flex justify-content-center align-items-center">
    <b-card class="shadow-lg p-5 mb-5 bg-white rounded text-center" style="max-width: 400px;">
      <h1 class="title mb-4">Time Manager</h1>
      <h2 class="subtitle mb-4">Login</h2>
      <b-form @submit.prevent="login">
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

        <b-link class="d-block mb-3 text-muted" href="#">Forgot your password?</b-link>

        <b-button type="submit" variant="success" class="login-btn mb-3" :disabled="isLoading">
          {{ isLoading ? 'LOGGING IN...' : 'LOGIN' }}
        </b-button>

        <b-link class="d-block text-muted" @click.prevent="goToRegister">New user? Signup</b-link>

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
    
    async login() {
      this.isLoading = true;
      this.errorMessage = "";
      this.offlineMessage = "";

      try {
        const response = await this.authService.login({
          email: this.email,
          password: this.password,
        });

        if ('queued' in response) {
          this.offlineMessage = "You are offline. Your login request will be processed when you're back online.";
        } else {
          // Store user_id in localStorage
          this.setUserId(response.user_id);
          this.$router.push("/home");
        }
      } catch (error) {
        this.errorMessage = "Invalid credentials or connection error";
      } finally {
        this.isLoading = false;
      }
    },

    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
    },

    goToRegister() {
      this.$router.push({ name: 'Register' });
    },
  },
});
</script>

  <style scoped>
  .login-page {
    height: 100vh;
    background-color: #f7f7f7;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-family: 'Cursive', sans-serif;
    color: #5eab70;
  }
  .subtitle {
    color: #5e5e5e;
  }
  .login-btn {
    width: 100%;
    font-size: 1.2rem;
    background-color: #5eab70;
    border: none;
  }
  .login-btn:hover {
    background-color: #4e9a60;
  }
  </style>
