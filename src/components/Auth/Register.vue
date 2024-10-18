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

        <b-button type="submit" variant="success" class="signup-btn mb-3">
          SIGNUP
        </b-button>

        <b-link class="d-block text-muted" @click.prevent="goToLogin">Already have an account? Login</b-link>

        <p class="text-danger">{{ errorMessage }}</p>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errorMessage: "",
      passwordFieldType: "password",
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post("/api/auth/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("token", response.data.token);
        this.$router.push("/dashboard");
      } catch (error) {
        this.errorMessage = "Registration failed";
      }
    },
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>

<style scoped>
.signup-page {
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
.signup-btn {
  width: 100%;
  font-size: 1.2rem;
  background-color: #5eab70;
  border: none;
}
.signup-btn:hover {
  background-color: #4e9a60;
}
</style>
