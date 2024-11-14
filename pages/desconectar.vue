<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
  const auth = userStore()
  auth.limparUserStore();
  useRouter().push('/')
</script>

<style>

</style>