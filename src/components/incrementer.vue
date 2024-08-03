<script setup>
const props = defineProps(["count", "min"]);
const emit = defineEmits(["add", "subtract"]);

const addCount =  () => {
  emit('add');
};

const reduceCount =  () => {
    if(props.count > props.min){
        emit('subtract');
    }

};

</script>
<template>
  <div class="incrementer">
    <div class="incrementer__control">
      <b-button variant="outline-primary" @click="reduceCount" :disabled="props.count == props.min"><i class="ri-subtract-line"></i></b-button>
    </div>
    <div class="incrementer__display text-info">{{ props.count }}</div>
    <div class="incrementer__control">
      <b-button variant="outline-primary" @click="addCount"><i class="ri-add-line"></i></b-button>
    </div>

  </div>

</template>

<style lang="scss" scoped>
.incrementer {
  margin-right: 1rem;
  display: grid;
  grid-template-columns: max-content max-content max-content;
  align-items: center;
  gap: 1rem;
  &__control {
    display: flex;
    justify-content: center;
    & button {
      font-size: 20px;
      border-radius: 50%;
      padding: 0px;
      height: 32px;
      width: 32px;
    }
  }
  &__display {
    font-size: 1.6rem;
    font-weight: 700;
  }
}
</style>
