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
                  fncName: 'isLayoutChecked',
                  parameterType: 'id',
              },
              clickedFncDetails:
              {
                  fncName: 'changeLayout',
                  parameterType: 'id',
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
          :m_function="changeIconSize"
          :input_Data="['0.5x','1x', '2x', '3x']"/>
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
                  fncName: 'isAlignchecked',
                  parameterType: 'id',
              },
              clickedFncDetails:
              {
                  fncName: 'changeAlign',
                  parameterType: 'id',
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
                  fncName: 'isXAxisChecked',
                  parameterType: 'id',
              },
              clickedFncDetails:
              {
                  fncName: 'changeXAxis',
                  parameterType: 'id',
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
                  fncName: 'isYaxisChecked',
                  parameterType: 'id',
              },
              clickedFncDetails:
              {
                  fncName: 'changeYAxis',
                  parameterType: 'id',
              }
              }">
        </RadioButton>  
      </template>
    </WindowContainerDivider>

</template>

<script>

import { containerData } from '../../Data/containerData.js';
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
    created(){
      this.m_CurrentID = "0A";
    },
    data(){
      return{
        containerData,
        m_currentObject: null,
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
        
// ----------------------------------------------------------------------------------------------------------------------------
      }
    },

    methods: {
      activateSelectionMode() {
          this.$GlobalStates.value.containerSelectionMode = true;
      },

// Radio button functions
// ----------------------------------------------------------------------------------------------------------------------------
      
      // Function prop values, States whether the value should be checked.
      isLayoutChecked(id){ return this.isPropertyChecked(this.LayoutType, id); },
      isAlignchecked(id){ return this.isPropertyChecked(this.ContentAlign, id);},
      isXAxisChecked(id){ return this.isPropertyChecked(this.OrientationLeftRight, id); },
      isYaxisChecked(id){ return this.isPropertyChecked(this.OrientationTopBottom, id); },
      
      // Generalized radio selected value
      isPropertyChecked(stateVariable, id){
        for(let i = 0; i < stateVariable.length; i++ ){ if(stateVariable[i].id === id) { return stateVariable[i].selected; } }
        return false;
      },

      // On click, updates the selected value
      changeLayout(id){ if(id.selected){ return; } this.changeSelectedValue(this.LayoutType, "setLayout",id);},
      changeAlign(id){ if(id.selected){ return; } this.changeSelectedValue(this.ContentAlign, "setGridAlign", id);},
      changeXAxis(id){ if(id.selected){ return; } this.changeSelectedValue(this.OrientationLeftRight, "setXDirection", id);},
      changeYAxis(id){ if(id.selected){ return; } this.changeSelectedValue(this.OrientationTopBottom, "setYDirection",id);},

      // Changes the property value of a given id to true and everything to false
      changeSelectedValue(valueType, functionPrefix, idValue){
        valueType.forEach(element => {
          element.selected = false;

          if(element.id === idValue){ 
            element.selected = true;
            let functionName = functionPrefix + element.id;

            if(containerData[functionName] === undefined){
              console.error(`Error (ContainerContent.vue): ${functionName} does not exist as a function from ${containerData}`);
              return;
            }
            containerData[functionName](this.m_CurrentID);
          }
        });
      },

      // Reset all values to false then turn the correct option true
      modifyValue(property, value){
        property.forEach(propertyValue => { propertyValue.selected = false; });
        property.forEach(propertyValue => { if(propertyValue.id === value) { propertyValue.selected = true; } });
      },

      // Sets the component selected values to the object data
      loadData(){
        this.modifyValue(this.LayoutType, containerData.getLayoutType(this.m_CurrentID));
        this.modifyValue(this.ContentAlign, containerData.getGridAlign(this.m_CurrentID));
        this.modifyValue(this.OrientationLeftRight, containerData.getXDirection(this.m_CurrentID));
        this.modifyValue(this.OrientationTopBottom,  containerData.getYDirection(this.m_CurrentID));
      },

// ------------------------------------------------------------------------------------------------------------------------------

// Slider Function
// ------------------------------------------------------------------------------------------------------------------------------
      
      changeIconSize(value){
        // Temporary
        console.log(value);
      },

// ------------------------------------------------------------------------------------------------------------------------------

    },
    watch: {
      // Retrieves the selected container
      '$GlobalStates.value.edit.containerSelected'(val){
        this.m_CurrentID = val;
        this.loadData();
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