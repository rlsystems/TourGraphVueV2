<script setup>
const props = defineProps(["count", "title", "titleSingle", "loading"]);
</script>

<template>
  <!-- Button -->
  <div class="counter-button">
    <div class="counter" v-if="!props.loading">
      <div class="counter__number">{{ props.count }}</div>
      <div class="counter__title">{{ count == 1 ? props.titleSingle : props.title }}</div>
    </div>
    <div v-else class="counter">
      <div class="counter__title">Loading...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
button {
  display: flex;
  justify-content: center;
}
.counter {
  display: grid;
  grid-template-columns: min-content max-content;
  align-items: center;
  gap: 5px;
  font-size: 13px;

  &__number {
    font-weight: 700;
    font-size: 16px;

  }

  &__title {
  }
}
.counter-button {
  border-radius: 10px;
}
</style>
