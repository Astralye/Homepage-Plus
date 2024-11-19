<template>

  <!-- Container selection -->
	<ContainerSelection
		@updateSelected="val => loadData(val)"
  	/>

  <!-- Container Name -->

	<WindowContainerDivider>
		<template #header> 
			<h2> Container Name </h2>
		</template>

		<template #content>
			<TextInput></TextInput>

			<input type="checkbox">
			<label> Show name?</label>
		</template>
	</WindowContainerDivider>

  <!-- Container Display Type -->

	<WindowContainerDivider>
		<template #header> 
			<h2> Display type</h2>
		</template>

		<template #tooltip>
			<ToolTip> How the items in the container are arranged </ToolTip>
		</template>

		<template #content>
			<RadioButton
				v-model="LayoutType"
				:enable_Radio="(editVariables.containerSelected) ? true : false"
				@clickEvent="id => changeSelectedValue(this.LayoutType, 'setLayout', id)"
			/>
		</template>
	</WindowContainerDivider>

<!-- Content Align -->

	<WindowContainerDivider>
		<template #header>
			<h2> Grid Content Align </h2> 
		</template>

		<template #tooltip>
			<ToolTip> Items in the grid can be compact to align with the direction or can be put in any location </ToolTip>
		</template>

		<template #content>
			<RadioButton
			v-model="ContentAlign"
			:enable_Radio="(editVariables.containerSelected) ? true : false"
			@clickEvent="id => changeSelectedValue(this.ContentAlign, 'setGridAlign',id)"
			/>
		</template>
	</WindowContainerDivider>

<!-- Dimensions -->

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
			v-model="OrientationLeftRight"
			:enable_Radio="(editVariables.containerSelected) ? true : false"
			@clickEvent="id => changeSelectedValue(this.OrientationLeftRight, 'setXDirection', id)"
		/>

		<h4>
			Y Axis Direction
		</h4>

		<RadioButton
			v-model="OrientationTopBottom"
			:enable_Radio="(editVariables.containerSelected) ? true : false"
			@clickEvent="id => changeSelectedValue(this.OrientationTopBottom, 'setYDirection',id)"
		/>

		</template>
	</WindowContainerDivider>

</template>

<script>

import { containerData } from '../../Data/containerData.js';
import { editVariables } from '../../Data/SettingVariables.js';

import RadioButton from '../Input Components/RadioBtn.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import ToolTip from '../Window Components/ToolTip.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import ContainerSelection from '../Window Components/ContainerSelection.vue';

import TextInput from '../Input Components/TextInput.vue';

export default {
    components: {
        WindowContainerDivider,
        ContainerSelection,
        SingleButton,
        RadioButton,
        TextInput,
        ToolTip,
    },
    mounted(){
      editVariables.enableLayoutWindow();
      editVariables.selectionContainerToggler();
    },
    unmounted(){
      editVariables.disableLayoutWindow();
      editVariables.selectionContainerToggler();
    },
    data(){
      return{
        
        containerData,
        editVariables,

        LayoutType: [
          { id: "Grid",    selected: false},
          { id: "List",    selected: false},
        ],

        ContentAlign: [
          { id: "Compact", selected: false},
          { id: "Free",    selected: false},
        ],

        OrientationTopBottom: [
          { id: "Top",     selected: false},
          { id: "Bottom",  selected: false},
        ],

        OrientationLeftRight: [
          { id: "Left",    selected: false},
          { id: "Right",   selected: false},
        ],    
	    }
    },

    methods: {

		noSelect(){ return (editVariables.containerSelected === null); },
		activateSelectionMode() { editVariables.enableContainerSelection(); },

// Radio button functions
// ----------------------------------------------------------------------------------------------------------------------------
	
		// Changes the property value of a given id to true and everything to false
		changeSelectedValue(valueType, functionPrefix, idValue){
			valueType.forEach(element => {
				element.selected = false;

				// Only pass the correct value
				if(element.id !== idValue){ return; } 

				element.selected = true;
				let functionName = functionPrefix + element.id;

				if(containerData[functionName] === undefined){
					console.error(`Error (ContainerContent.vue): ${functionName} does not exist as a function from ${containerData}`);
					return;
				}
				containerData[functionName](this.m_CurrentID);
			});
		},

		// Reset all values to false then turn the correct option true
		modifyValue(property, value){
			property.forEach( propertyValue => { 
				propertyValue.selected = false; 
				if(propertyValue.id === value){ propertyValue.selected = true; } 
			});
		},

		// Sets the component selected values to the object data
		loadData(id){
		this.m_CurrentID = id;
		this.modifyValue(this.LayoutType,           containerData.getLayoutType(id));
		this.modifyValue(this.ContentAlign,         containerData.getGridAlign (id));
		this.modifyValue(this.OrientationLeftRight, containerData.getXDirection(id));
		this.modifyValue(this.OrientationTopBottom, containerData.getYDirection(id));
		},

// ------------------------------------------------------------------------------------------------------------------------------

// Slider Function
// ------------------------------------------------------------------------------------------------------------------------------
      
      changeIconSize(value){
        // Temporary
        console.log(value);
      },

// ------------------------------------------------------------------------------------------------------------------------------

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