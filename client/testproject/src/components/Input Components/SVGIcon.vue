<!-- 
  This file is responsible for loading the SVG

  Currently, the SVG is saved as a template , with the svg content saved on it, only being uploaded as such.

  To make the SVG a better component to react to size, and scale, the data (path), should be the only variable in the component.
  This means I can make a SVG component, to automatically generate the SVG, given any width, height, colour, requirements.
  The main important part of the component should be the 'path', which is how the SVG is drawn.

  To make this easier for myself, I will make a new component using this 'SVGHandler', and delete this component later and adjust the current code,
  and implementation.

-->

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
    <!-- <component :is="dynamicComponent"/> -->
</template>