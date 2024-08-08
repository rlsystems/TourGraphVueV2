<template>
  <a v-if="props.isLink && props.display" :href="wordpressUrl" target="_blank">
    <b-badge variant="secondary" :class="wpBadgeClass">{{ !props.display ? "Missing" : props.display }}</b-badge>
  </a>
  <b-badge v-else :class="wpBadgeClass">{{ !props.display ? "Missing" : props.display }}</b-badge>

</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["display", "isLink"]);


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

<style scoped>
 .badge {
  width: max-content;
  margin-top: .2rem;
  font-size: 16px;
 }

</style>
