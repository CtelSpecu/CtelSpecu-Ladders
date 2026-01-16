<template>
  <i
    :class="iconClasses"
    :title="title"
    :aria-hidden="ariaLabel ? undefined : 'true'"
    :aria-label="ariaLabel || undefined"
    role="img"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: { type: String, required: true },
  variant: { type: String, default: 'solid' }, // solid | brands | regular
  title: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  class: { type: [String, Array, Object], default: '' },
});

const iconClasses = computed(() => [
  'vue-icon',
  `fa-${props.variant}`,
  `fa-${props.icon}`,
  props.class,
]);
</script>

<style scoped>
.vue-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>

