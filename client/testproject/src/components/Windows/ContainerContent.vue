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
        <RangeSlider/>
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

import RadioButton from '../Input Components/RadioBtn.vue';
import RangeSlider from '../Input Components/RangeSlider.vue';
import SingleButton from '../Window Components/SingleButton.vue';
import ToolTip from '../Window Components/ToolTip.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';

export default {
    components: {
        ToolTip,
        WindowContainerDivider,
        SingleButton,
        RadioButton,
        RangeSlider
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