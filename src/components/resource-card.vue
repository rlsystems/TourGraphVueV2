<script setup>

const props = defineProps(["divider"]);


</script>


<template>
  <div class="card">
    <div class="card-body">
      <div class="resource-card-main">
        <slot></slot>
      </div>
      <div class="resource-card-stats">
        <slot name="stats"></slot>
      </div>
      <div class="resource-card-bottom">
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  width: 350px;
  margin-bottom: 0;
  //border: 1px solid var(--nano-border-color);

}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.resource-card-main {
  display: grid; 
  grid-template-columns: 1fr min-content;
  row-gap: 1.5rem;
  column-gap: 1rem;
  margin-bottom: .5rem;
}
.resource-card-stats {
}
.resource-card-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: end;
}
</style>
