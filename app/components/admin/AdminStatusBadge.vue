<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    tone?: 'orange' | 'purple' | 'green' | 'gray' | 'blue' | 'red'
  }>(),
  {
    tone: 'gray',
  },
)
</script>

<template>
  <span class="admin-status-badge" :class="`admin-status-badge--${tone}`">
    {{ label }}
  </span>
</template>

<style scoped lang="scss">
.admin-status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 11.4rem;
  min-height: 2.8rem;
  padding: 0 1.4rem;
  border-radius: 999px;
  font-size: 1.3rem;
  font-weight: 500;
  color: #fff;
}

.admin-status-badge--orange {
  background: linear-gradient(45deg, #ff8e17, #ffad32);
}

.admin-status-badge--purple {
  background: linear-gradient(45deg, #522ec4, #6d41de);
}

.admin-status-badge--green {
  background: $linear-green;
}

.admin-status-badge--gray {
  background: #929292;
}

.admin-status-badge--blue {
  background: linear-gradient(45deg, #1565c0, #1e88e5);
}

.admin-status-badge--red {
  background: linear-gradient(45deg, #c62828, #e53935);
}
</style>
