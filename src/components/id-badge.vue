<template>
  <a v-if="props.isLink && props.display" :href="wordpressUrl" target="_blank" class="linkGroup">
    <b-badge variant="secondary" :class="wpBadgeClass">{{ !props.display ? "Missing" : props.display }}</b-badge>
    <i v-if="props.warning" class="ri-alert-line text-warning"></i> 
  </a>
  <b-badge v-else :class="wpBadgeClass">{{ !props.display ? "Missing" : props.display }}</b-badge>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["display", "isLink", "warning"]);

const wordpressUrl = computed(() => {
  const url = "https://www.antarcticacruises.com?p=" + props.display;
  return url;
});

const wpBadgeClass = computed(() => {
  if (!props.display) {
    return "bg-danger-subtle text-danger";
  } else {
    return "bg-success-subtle text-success";
  }
});
</script>

<style scoped lang="scss">
.badge {
  width: max-content;
  margin-top: 0.2rem;
  font-size: 16px;
}

.linkGroup {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & i {
    font-size: 22px;

  }
}
</style>
