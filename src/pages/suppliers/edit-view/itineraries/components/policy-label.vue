<script setup>
import { computed } from "vue";

const props = defineProps(["count", "ratesMissing", "minWidth", "link"]);

const buttonVariant = computed(() => {
  if (props.count > 0 && props.ratesMissing == 0) {
    return "soft-success";
  } else {
    return "soft-warning";
  }
});
</script>

<template>
  <!-- Link -->
  <router-link :to="props.link">
    <b-button :variant="buttonVariant" class="counter-button" :style="{ minWidth: props.minWidth }">
      <div class="policy">
        <div class="policy__number">{{ props.count }}</div>
        <div class="policy__title">{{ count == 1 ? "Policy" : "Policies" }}</div>
      </div>
      <div class="counter" v-if="props.ratesMissing != 0">
        <div class="counter__number">{{ props.ratesMissing }}</div>
        <div class="counter__title">{{ ratesMissing == 1 ? "Rate Pending" : "Rates Pending" }}</div>
      </div>
    </b-button>
  </router-link>
</template>

<style lang="scss" scoped>
button {
  //   display: flex;
  //   justify-content: center;
}
.policy {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
  &__number {
    font-size: 18px;
    font-weight: 700;
  }

  &__title {
    font-size: 14px;
  }
}

.counter {
    font-size: 10px;
    display: flex;
    gap: 5px;
    justify-content: center;
}

.counter-button {
  border-radius: 10px;
  border: 1px solid;

}
</style>
