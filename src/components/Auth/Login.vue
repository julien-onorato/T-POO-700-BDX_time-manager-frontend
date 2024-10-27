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

          <b-button type="submit" variant="success" class="login-btn mb-3">
            LOGIN
          </b-button>

          <b-link class="d-block text-muted" @click.prevent="goToRegister">New user? Signup</b-link>

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
        email: "",
        password: "",
        errorMessage: "",
        passwordFieldType: "password",
      };
    },
    methods: {
      // Function to set a cookie
      setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
      },

      // Login function
      async login() {
        try {
          const response = await axios.post("http://localhost:4000/api/auth/login", {
            email: this.email,
            password: this.password,
          });

          // Store token in a cookie instead of localStorage
          this.setCookie("token", response.data.token, 7); // Token stored for 7 days
          this.$router.push("/home");
        } catch (error) {
          this.errorMessage = error.errorMessage;
        }
      },

      // Toggle password visibility
      togglePasswordVisibility() {
        this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
      },

      // Navigate to the registration page
      goToRegister() {
        this.$router.push({ name: 'Register' });
      },
    },
  };
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
