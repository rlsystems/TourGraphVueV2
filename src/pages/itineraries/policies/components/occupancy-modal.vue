<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import LoadingButton from "@/components/loading-button.vue";

const emit = defineEmits(["proceed", "cancel"]);

// props
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  isAmount: {
    type: Boolean,
    required: false,
  },
  modifier: {
    type: Number,
    required: false,
  },
  saving: {
    type: Boolean,
    default: false,
  }

});
// initial values
const initialValues = ref({
  isAmount: props.isAmount,
  modifier: props.modifier,
});

// schema
const schema = yup.object({
  modifier: yup.number().required(),
  isAmount: yup.string().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// // fields
const [isAmount, isAmountAttrs] = defineField("isAmount");
const [modifier, modifierAttrs] = defineField("modifier");

const canProceed = computed(() => {
  return meta.value.dirty && meta.value.valid;
});




// modal proceed / close
const show = ref(true);
const close = async () => {
  show.value = false;
  emit("cancel");
};
const proceed = handleSubmit((values) => {
  emit("proceed", values);
});

</script>



<template>
  <b-modal v-model="show" title="Edit Occupancy Rule" title-class="h4" hide-footer @cancel="close" @close="close" @hidden="close">
    <div class="">
      <form @submit="proceed" class="my-2">
        <!-- Adult -->
        <div class="occupancy-group mb-2">
          <div class="occupancy-group__title text-dark">{{ props.title }}</div>
          <div class="occupancy-group__fields">
            <b-form-group class="mt-1">
              <div class="form-check-inline">
                <b-form-radio name="radio1" :value="false" v-bind="isAmountAttrs" v-model="isAmount">Percent</b-form-radio>
              </div>
              <div class="form-check-inline">
                <b-form-radio name="radio1" :value="true" v-bind="isAmountAttrs" v-model="isAmount">Amount</b-form-radio>
              </div>
            </b-form-group>
            <b-form-group  class="mt-2">
              <div class="input-group flex-nowrap">
                <b-form-input type="text" v-bind="modifierAttrs" v-model="modifier" id="modifier" />
                <span class="input-group-text" id="basic-addon1">{{ isAmount ? "USD" : "%" }}</span>
              </div>
              <b-form-invalid-feedback :state="false">{{ errors.modifier }}</b-form-invalid-feedback>
            </b-form-group>
          </div>
        </div>

      </form>
    </div>
    <div class="modal-footer footer-controls border-top-0">
      <div class="footer-controls__left">
      </div>
      <div class="footer-controls__right">
        <b-button variant="light" @click="close">Close</b-button>
        <LoadingButton variant="primary" type="submit" :loading="saving" @click="proceed" :disabled="!canProceed">Save</LoadingButton>
      </div>
    </div>
  </b-modal>
</template>

<style scoped lang="scss">
.occupancy-group {
  &__title {
    font-size: 16px;
    font-weight: 700;
  }

  &__fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;

    & input {
      max-width: 250px;
    }
  }
}
</style>
