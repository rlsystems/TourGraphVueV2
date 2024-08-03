<template>
  <strong class="text-capitalize" :class="badgeClass">{{ badgeText }}</strong>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps(["departure"]);
const currentDate = new Date();


const badgeClass = computed(() => {
    const departureDate = new Date(props.departure.startDate);
    if (props.departure.isAvailable && departureDate > currentDate) {
        return "text-success";
    } else if (departureDate < currentDate) {
        return "text-secondary";
    } else {
        return "text-danger";
    }
});

const badgeText = computed(() => {
    const departureDate = new Date(props.departure.startDate);
    if (props.departure.isAvailable && departureDate > currentDate) {
        return "Available";
    } else if (departureDate < currentDate) {
        return "Departed";
    } else {
        return "Sold Out";
    }
});
</script>
