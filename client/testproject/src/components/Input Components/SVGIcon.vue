<script>
import { defineAsyncComponent } from 'vue';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    dynamicComponent() {
      if(!this.name){ return null; }
      const name = this.name;
      return defineAsyncComponent(() => import(`../../assets/Icons/${name}.vue`));
    },
  },
};
</script>

<template>
    <component :is="dynamicComponent"/>
</template>