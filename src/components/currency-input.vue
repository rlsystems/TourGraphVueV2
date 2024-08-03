<script setup>
import { watch, onMounted } from 'vue';
import { useCurrencyInput } from 'vue-currency-input';
import { useField } from 'vee-validate';

const props = defineProps({
  name: String,
  options: Object,
});

const { formattedValue, numberValue, inputRef, setValue } = useCurrencyInput(
  props.options
);
const { errorMessage, handleChange, value } = useField(props.name);

onMounted(() => {
  // Currently there is a bug where you have to wait until after mount for useCurrencyInput to properly set the value
  setTimeout(() => {
    // sets the initial value if provided
    if (value.value) {
      setValue(value.value);
    }
  }, 300);
});

// We can track the formatted value ourselves and sync it with vee-validate as a number when possible
watch(numberValue, (newValue) => {
  // sync it with vee-validate, this will trigger validation
  handleChange(newValue);
  // handleChange(newValue, false); // doesn't trigger validation
});
</script>

<template>
  <div>
    <label for="currency">Enter the amount then blur the field</label>
    <input id="currency" ref="inputRef" type="text" :value="formattedValue" />
    <span class="error">{{ errorMessage }}</span>
  </div>
</template>

<style lang="css" scoped>
label {
  display: block;
}

.error {
  color: red;
  display: block;
  margin: 4px;
}
</style>
