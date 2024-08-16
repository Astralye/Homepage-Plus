<template>
    <SingleButton
      @click="toggleSelectionMode" 
      class="center">
      <h2> Select Container </h2>
    </SingleButton>

    <WindowContainerDivider>
      <template #header> 
        <h2> Container layout type</h2>
      </template>

      <template #tooltip>
        <ToolTip> Tool Tip! </ToolTip>
      </template>

      <template #content>
        <RadioButton
          :text_array='["Grid", "List"]'>
        </RadioButton>  
      </template>
    </WindowContainerDivider>


    <WindowContainerDivider>
      <template #header> 
        <h2> Icon size </h2>
      </template>

      <template #tooltip>
        <ToolTip> Tool Tip! </ToolTip>
      </template>

      <template #content>
        <input type="range" list="iconSize" id="iconSize" min="0" max="75" value="50" step="25"> 
      </template>

    </WindowContainerDivider>

    <WindowContainerDivider>
      <template #header>
        <h2> Grid Content Align </h2> 
      </template>

      <template #tooltip>
        <ToolTip> Tool Tip! </ToolTip>
      </template>

      <template #content>
        <RadioButton
          :text_array='["Compact", "Free"]'>
        </RadioButton>  
      </template>
    </WindowContainerDivider>

    <WindowContainerDivider>
      <template #header>
        <h3>Container Dimensions</h3>
      </template>

      <template #tooltip>
        <ToolTip> Tool Tip! </ToolTip>
      </template>

      <template #content>
        <h4>
          Content direction A
        </h4>
        <RadioButton
          :text_array='["Top", "Bottom"]'>
        </RadioButton>  

        <h4>
          Content direction B
        </h4>
        <RadioButton
        :text_array='["Left", "Right"]'>
      </RadioButton>  
      </template>
    </WindowContainerDivider>

</template>

<script>

import RadioButton from './RadioBtn.vue';
import SingleButton from './SingleButton.vue';
import ToolTip from './ToolTip.vue';
import WindowContainerDivider from './WindowContainerDivider.vue';

export default {
    components: {
        ToolTip,
        WindowContainerDivider,
        SingleButton,
        RadioButton
    }
}
</script>

<style scoped>

.center{
  margin: auto;
}

.container-divider{
  margin: 3px;
}
.container-divider:not(:last-child){
  margin-bottom: 6px;
}


datalist {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  writing-mode: vertical-lr;
  width: 200px;
}

option {
  padding: 0;
}

input[type="range"] {
  width: 200px;
  margin: 0;
}

</style>