<template>
  <footer class="footer">API Version: {{ apiVersion }}</footer>
</template>

<script>
import ApiService from '@/services/ApiService.js';

export default {
  data() {
    return {
      apiVersion: ''
    };
  },
  async created() {
    this.apiVersion = await ApiService.getApiVersion();
  }
};
</script>