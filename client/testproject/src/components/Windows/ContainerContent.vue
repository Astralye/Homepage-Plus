<template>
    <SingleButton
      @click="activateSelectionMode" 
      class="center">
      <h2 class="single-button-dark"> Select Container </h2>
    </SingleButton>

    <WindowContainerDivider>
      <template #header> 
        <h2> Container layout type</h2>
      </template>

      <template #tooltip>
        <ToolTip> How the items in the container are arranged </ToolTip>
      </template>

      <template #content>
        <RadioButton
            parent_Variable_String="LayoutType"
            :parent_Fnc_Data="{
              checkedFncDetails:
              {
                  fncName: 'tmp',
                  parameterType: 'index',
              },
              clickedFncDetails:
              {
                  fncName: 'tmp',
                  parameterType: 'index',
              }
            }">
        </RadioButton>  
      </template>
    </WindowContainerDivider>


    <WindowContainerDivider>
      <template #header> 
        <h2> Icon size </h2>
      </template>

      <template #tooltip>
        <ToolTip> Size of the icons, relative to a base size </ToolTip>
      </template>

      <template #content>
        <RangeSlider
          :input_Data="['0.5x','1x', '2x', '3x']"
          :m_function="tmp";
        />
      </template>

    </WindowContainerDivider>

    <WindowContainerDivider>
      <template #header>
        <h2> Grid Content Align </h2> 
      </template>

      <template #tooltip>
        <ToolTip> Items in the grid can be compact to align with the direction or can be put in any location </ToolTip>
      </template>

      <template #content>
        <RadioButton
            parent_Variable_String="ContentAlign"
            :parent_Fnc_Data="{
              checkedFncDetails:
              {
                  fncName: 'tmp',
                  parameterType: 'index',
              },
              clickedFncDetails:
              {
                  fncName: 'tmp',
                  parameterType: 'index',
              }
            }">
        </RadioButton>  
      </template>
    </WindowContainerDivider>

    <WindowContainerDivider>
      <template #header>
        <h3>Container Dimensions</h3>
      </template>

      <template #tooltip>
        <ToolTip> Content align direction of the y axis </ToolTip>
      </template>

      <template #content>
        <h4>
          X Axis Direction
        </h4>
        <RadioButton
            parent_Variable_String="OrientationLeftRight"
            :parent_Fnc_Data="{
              checkedFncDetails:
              {
                  fncName: 'tmp',
                  parameterType: 'index',
              },
              clickedFncDetails:
              {
                  fncName: 'tmp',
                  parameterType: 'index',
              }
            }">
        </RadioButton>  

        <h4>
          Y Axis Direction
        </h4>
        <RadioButton
            parent_Variable_String="OrientationTopBottom"
            :parent_Fnc_Data="{
              checkedFncDetails:
              {
                  fncName: 'tmp',
                  parameterType: 'index',
              },
              clickedFncDetails:
              {
                  fncName: 'tmp',
                  parameterType: 'index',
              }
              }">
        </RadioButton>  
      </template>
    </WindowContainerDivider>

</template>

<script>

import RadioButton from '../Input Components/RadioBtn.vue';
import RangeSlider from '../Input Components/RangeSlider.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import ToolTip from '../Window Components/ToolTip.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';

export default {
    components: {
        ToolTip,
        WindowContainerDivider,
        SingleButton,
        RadioButton,
        RangeSlider
    },
    data(){
      return{

// Radio button variables
// ------------------------------------------------------------------------------------------------

        LayoutType: [
                { index: 0, id: "Grid", selected: true},
                { index: 1, id: "List", selected: false},
        ],

        ContentAlign: [
                { index: 0, id: "Compact", selected: true},
                { index: 1, id: "Free", selected: false},
        ],

        OrientationTopBottom: [
                { index: 0, id: "Top", selected: true},
                { index: 1, id: "Bottom", selected: false},
        ],

        OrientationLeftRight: [
                { index: 0, id: "Left", selected: true},
                { index: 1, id: "Right", selected: false},
        ],
        
// -------------------------------------------------------------------------------------------------
        
      }
    },

    methods: {

// -------------------------------------------------------------------------------------------------

      activateSelectionMode() {
          this.$GlobalStates.value.containerSelectionMode = true;
      },


      tmp(){
        console.log("Clicked!");
        return false;
      },
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