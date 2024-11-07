<template>
  <!-- Warning Alert Modal -->
  <b-modal id="warning-alert-modal" v-model="props.show" hide-footer hide-header size="sm" @hide="closeModal" no-close-on-backdrop no-close-on-esc>
    <div class="p-4">
      <div class="text-center">
        <i class="ri-alert-line h1 text-warning"></i>
        <h4 class="mt-2">{{ props.title }}</h4>
        <p class="mt-3">{{ props.message }}</p>
        <!-- Continue button to confirm the action -->
        <div class="d-flex gap-2 justify-content-center">
          <LoadingButton variant="warning" :loading="props.loading" :disabled="props.loading" type="submit" @click="confirmDelete">Delete</LoadingButton>

          <b-button variant="secondary" @click="closeModal" :disabled="props.loading">Cancel</b-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script setup>
const props = defineProps(["show", "title", "message", "loading"]);
const emit = defineEmits(["confirm", "close"]);
import LoadingButton from "@/components/loading-button.vue";

// Emit confirm event when "Continue" is clicked
const confirmDelete = () => {
  emit("confirm");
};

// Emit close event when "Cancel" is clicked
const closeModal = () => {
  if (props.loading == false) {
    emit("close");
  }
};
</script>
