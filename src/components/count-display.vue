<script setup>
import { computed } from "vue";

const props = defineProps(["count", "title", "titleSingle", "minWidth", "link", "clickEvent"]);

const buttonVariant = computed(() => {
  if (props.count > 0) {
    return "soft-success";
  } else {
    return "soft-warning";
  }
});
</script>

<template>
  <!-- Link -->
  <router-link v-if="props.link" :to="props.link">
    <b-button :variant="buttonVariant" class="counter-button" :style="{ minWidth: props.minWidth }">
      <div class="counter">
        <div class="counter__number">{{ props.count }}</div>
        <div class="counter__title">{{ count == 1 ? props.titleSingle : props.title }}</div>
      </div>
    </b-button>
  </router-link>
  <!-- Button -->
  <b-button @click="clickEvent" v-else :variant="buttonVariant" class="counter-button" :style="{ minWidth: props.minWidth }">
    <div class="counter">
      <div class="counter__number">{{ props.count }}</div>
      <div class="counter__title">{{ count == 1 ? props.titleSingle : props.title }}</div>
    </div>
  </b-button>
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

  &__number {
    font-size: 18px;
    font-weight: 700;
  }

  &__title {
    font-size: 14px;
  }
}
.counter-button {
  border-radius: 10px;
  border: 1px solid;
}
</style>
