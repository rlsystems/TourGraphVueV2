<script setup>
import { computed, onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import GuestLayout from "@/components/layout/guest-layout.vue";
import LoadingButton from "@/components/loading-button.vue";

import { useAuthStore } from "@/stores/_core/authStore";
const authStore = useAuthStore();



const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
  token: yup.string().required(),
});


// veevalidate form object
const { handleSubmit, defineField, errors, meta, setFieldValue } = useForm({
  validationSchema: schema,
});

// fields
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");
const [token, tokenAttrs] = defineField("token");

const canProceed = computed(() => {
  return meta.value.dirty && meta.value.valid;
});

// submit
const submitting = ref(false);
const resetPasswordSubmit = handleSubmit(async (values) => {
  submitting.value = true;
  await authStore.resetPassword(values);
  submitting.value = false;
});


</script>

<template>
  <GuestLayout>
    <div class="auth-fluid">
      <!-- Left Side -->
      <div class="auth-fluid-form-box">
        <div class="card-body d-flex flex-column h-100 gap-3">
          <!-- Logo -->
          <div class="auth-brand text-center text-lg-start">
            <router-link to="/" class="logo-dark">
              <span><img src="@/assets/images/logo-dark.png" alt="dark logo" /></span>
            </router-link>
            <router-link to="/" class="logo-light">
              <span><img src="@/assets/images/logo.png" alt="logo" /></span>
            </router-link>
          </div>
          <!-- Main -->
          <div class="my-auto">
            <!-- Title-->
            <h4 class="mt-0">Reset Password</h4>
            <p class="text-muted mb-4">Enter your email with new password and reset token to regain access to your account</p>
            <!-- Form -->
            <form @submit="resetPasswordSubmit">
              <!-- Email -->
              <b-form-group label="Email" label-for="email" class="mb-3">
                <b-form-input type="email" v-bind="emailAttrs" v-model="email" id="email" placeholder="name@example.com" />
                <b-form-invalid-feedback :state="false">{{ errors.email }}</b-form-invalid-feedback>
              </b-form-group>
              <!-- Password -->
              <b-form-group label="Password" label-for="password" class="mb-3">
                <b-form-input type="password" v-bind="passwordAttrs" v-model="password" id="password" placeholder="Password" />
                <b-form-invalid-feedback :state="false">{{ errors.password }}</b-form-invalid-feedback>
              </b-form-group>
              <!-- Confirm Password -->
              <b-form-group label="Confirm Password" label-for="confirmPassword" class="mb-3">
                <b-form-input type="password" v-bind="confirmPasswordAttrs" v-model="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />
                <b-form-invalid-feedback :state="false">{{ errors.confirmPassword }}</b-form-invalid-feedback>
              </b-form-group>
              <!-- Token -->
              <b-form-group label="Token" label-for="token" class="mb-3">
                <b-form-input type="text" v-bind="tokenAttrs" v-model="token" id="token" placeholder="Enter token from email" />
                <b-form-invalid-feedback :state="false">{{ errors.token }}</b-form-invalid-feedback>
              </b-form-group>
              <!-- Submit -->
              <div class="d-grid mb-0 text-center">
                <LoadingButton variant="primary" type="submit" :disabled="!canProceed" :loading="submitting"> Submit </LoadingButton>
              </div>
             
            </form>
          </div>
          <!-- Footer -->
          <footer class="footer footer-alt">
            <router-link class="text-muted float-end" to="/login"><small>Return to Login</small></router-link>
          </footer>
        </div>
      </div>
      <!-- Right Side (slash screen) -->
      <div class="auth-fluid-right text-center">
        <div class="auth-fluid-right__logo">
          <img src="@/assets/images/logo-lg.png" alt="small logo" />
        </div>
        <div class="auth-user-testimonial">
          <img src="@/assets/images/vue.png" class="mb-2"/>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
