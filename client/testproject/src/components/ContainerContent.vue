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
        <input type="radio" id="Grid" name="LayoutType" value="grid">
        <label for="Grid">Grid</label>
        <input type="radio" id="List" name="LayoutType" value="list">
        <label for="List">List</label>
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

        <datalist id="iconSize">
            <option value="0" label="Small"></option>
            <option value="25" label="Medium"></option>
            <option value="50" label="Large"></option>
            <option value="75" label="Extra Large"></option>
        </datalist>
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
        <input type="radio" id="Compact" name="contentAlignType" value="compact">
        <label for="Compact">Compact</label>
        <input type="radio" id="Free" name="contentAlignType" value="free">
        <label for="Free">Free</label>
      </template>
    </WindowContainerDivider>

    <WindowContainerDivider>
      <template #header>
        <h2>Container Dimensions</h2>
      </template>

      <template #tooltip>
        <ToolTip> Tool Tip! </ToolTip>
      </template>

      <template #content>
        <input type="radio" id="Top" name="contentAlignDirectionA" value="top" checked>
        <label for="Top">Top</label>
        <input type="radio" id="Bottom" name="contentAlignDirectionA" value="bottom">
        <label for="Bottom">Bottom</label>
    
        <input type="radio" id="Left" name="contentAlignDirectionB" value="left" checked>
        <label for="Left">Left</label>
        <input type="radio" id="Right" name="contentAlignDirectionB" value="right">
        <label for="Right">Right</label>
      </template>
    </WindowContainerDivider>

</template>

<!--
    As mentioned in App.vue,
    I need to standardize the buttons and layouts of
    the window content.

    What I will make today will be a brief template.

    Maybe I might change this before or after
    functionality, but for my sanity, it might be better
    before I make any more windows.
-->


<script>

import SingleButton from './SingleButton.vue';
import ToolTip from './ToolTip.vue';
import WindowContainerDivider from './WindowContainerDivider.vue';

export default {
    components: {
        ToolTip,
        WindowContainerDivider,
        SingleButton
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