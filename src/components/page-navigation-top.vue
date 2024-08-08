<script setup>
import simplebar from "simplebar-vue";

const props = defineProps({
  menuOptions: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
  },
  parentName: {
    type: String,
  },
  parentLink: {
    type: Object,
  },
  subParentName: {
    type: String,
  },
  subParentLink: {
    type: Object,
  },
  activeTab: {
    type: Number,
  },
});
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="page-nav-top">
        <div v-if="!loading" class="page-nav-top__title-area">
          <div class="page-nav-top__title-area__sub">
            <router-link v-if="props.parentLink" :to="props.parentLink">
              <div class="page-nav-top__title-area__sub__item">{{ props.parentName }}</div>
            </router-link>
          </div>
          <div class="page-nav-top__title-area__title text-dark">{{ props.title }}</div>

        </div>
        <!-- Loading Spinner -->
        <div v-else class="page-nav-top__title-area">
          <div class="d-flex">
            <span class="spinner-border spinner-border-sm avatar-xs text-primary" role="status" aria-hidden="true"></span>
          </div>
        </div>

        <div class="page-nav-top__link-area">
          <div class="page-nav-top__link-area__wrapper" v-for="(option, index) in props.menuOptions">
            <b-button v-if="index == Number(props.activeTab)" variant="soft-success"
              ><i v-if="option.icon" :class="option.iconClassList"></i> <span>{{ option.display }} </span>
            </b-button>
            <router-link v-else :to="{ name: option.name }">
              <b-button variant="outline-light"
                ><i v-if="option.icon" :class="option.iconClassList"></i> <span>{{ option.display }} </span>
              </b-button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-nav-top {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr max-content;
  min-height: 60px;
  align-items: center;

  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  &__title-area {
    display: flex;
    flex-direction: column;
    & a {
      width: max-content !important;
    }
    &__title {
      font-size: 24px;
      font-weight: 600;
    }

    &__sub {
      font-size: 14px;
      display: flex;
      gap: 0.5rem;
    }
  }

  &__link-area {
    &__wrapper {
      display: inline;
      & button {
        margin-right: 10px !important;
        @media only screen and (max-width: 800px) {
          margin-top: 10px;
        }
      }

      & .btn-soft-success {
        &:hover {
          color: var(--nano-success);
          background-color: var(--nano-success-bg-subtle);
          border: 1px solid transparent;
        }
      }

      & .btn-outline-light {
        border: 1px solid transparent;
      }
    }
  }
}
</style>
