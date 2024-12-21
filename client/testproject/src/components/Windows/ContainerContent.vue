<template>
  <!-- Container selection -->
	<ContainerSelection
		@updateSelected="val => loadData(val)"
		@reset="loadData(null)"
  	/>

  <!-- Container Name -->

	<WindowContainerDivider>
		<template #header> 
			<h2> Container Data </h2>
		</template>

		<template #content>
			<WindowContainerDivider>
				<template #header> 
					<h3> Container Name </h3>
				</template>
		
				<template #content>

					<TextInput
						placeholder_text="Container Name"
						max_length=30
						:enabled="isSelected"
						v-model="containerString"
					/>
		
					<Checkbox
						@onChange="check => show = check"
						:checkValue="showName"
						:enabled="isSelected"
						text="Display name"
					/>
		
					<!-- Maybe have more stuff to display here -->
				</template>
			</WindowContainerDivider>

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
			
		<!-- Tabs  -->
			<TabWrapper
				:default_Tab="tabIndex"
				:tab_Buttons="tab_Data"
				:enabled="isSelected"
				@update="val => changeSelectedValue(this.LayoutType, 'setLayout', val)"
			>
			<template #Tab-0>
					<!-- Content Align -->
					
						<WindowContainerDivider>
							<template #content>

								<Checkbox
									@onChange="check => showText = check"
									:checkValue="showText"
									text="Display text for whole container"
								/>

								<br>
								
								<h3> Grid Content Align </h3> 

								<RadioButton
									v-model="ContentAlign"
									:enable_Radio="(editVariables.containerSelected) ? true : false"
									@clickEvent="id => changeSelectedValue(ContentAlign, 'setGridAlign',id)"
								/>

								<br>
								<h3>Container Dimensions</h3>
								
								<h4>
									X Axis Direction
								</h4>
								
								<RadioButton
								v-model="OrientationLeftRight"
								:enable_Radio="(editVariables.containerSelected) ? true : false"
								@clickEvent="id => changeSelectedValue(OrientationLeftRight, 'setXDirection', id)"
								/>
								<br class="br-second">
					
								<h4>
									Y Axis Direction
								</h4>
								
								<RadioButton
								v-model="OrientationTopBottom"
								:enable_Radio="(editVariables.containerSelected) ? true : false"
								@clickEvent="id => changeSelectedValue(OrientationTopBottom, 'setYDirection',id)"
								/>
								
							</template>
						</WindowContainerDivider>
				
					</template>

					<template #Tab-1>
						<WindowContainerDivider>
							<template #header>
								<h3> Text Align </h3> 
							</template>
							
							<template #content>
								<RadioButton
									v-model="textAlign"
									:enable_Radio="(editVariables.containerSelected) ? true : false"
									@clickEvent="id => changeSelectedValue(textAlign, 'setTextAlign',id)"
								/>
								<br>

								<Checkbox
									@onChange="check => showIcon = check"
									:checkValue="showIcon"
									text="Display Icons for whole container"
								/>
							</template>
						</WindowContainerDivider>
					</template>
			</TabWrapper>
		</template>
	</WindowContainerDivider>


</template>

<script>

import { containerData } from '../../Data/containerData.js';
import { editVariables } from '../../Data/SettingVariables.js';

import RadioButton from '../Input Components/RadioBtn.vue';
import ToolTip from '../Window Components/ToolTip.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import ContainerSelection from '../Window Components/ContainerSelection.vue';
import Checkbox from '../Input Components/Checkbox.vue';

import TextInput from '../Input Components/TextInput.vue';
import TabWrapper from '../Window Components/TabWrapper.vue';

export default {
    components: {
        WindowContainerDivider,
        ContainerSelection,
        RadioButton,
		TabWrapper,
        TextInput,
		Checkbox,
        ToolTip,
    },
    mounted(){
      editVariables.enableContainerWindow();
      editVariables.selectionContainerToggler();
    },
    unmounted(){
      editVariables.disableContainerWindow();
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

			// Grid type

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

			// List type

			textAlign: [
				{ id: "Left", selected: false},
				{ id: "Center", selected: false},
				{ id: "Right", selected: false},
			],


			containerString: null,
			showName: false,

			showIcon: true,
			showText: true,

			tabIndex: -1,
			tab_Data: [
				{ text:'Grid', icon_Image: "Grid"},
				{ text:'List', icon_Image: "List"},
			],

			isSelected: false,
	    }
    },

    methods: {

		noSelect(){ return (editVariables.containerSelected === null); },
		activateSelectionMode() { editVariables.enableContainerSelection(); },

// Radio button functions
// ----------------------------------------------------------------------------------------------------------------------------
	
		// Changes the property value of a given id to true and everything to false
		changeSelectedValue(valueType, functionPrefix, idValue){

			if(!editVariables.containerSelected) return;


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
			this.containerString = containerData.getHeaderName(id);
			this.showName = containerData.isHeaderToggled(id);
			this.showIcon = containerData.isShowIcon(id);
			this.showText = containerData.isShowText(id);

			this.isSelected = this.isCurrentlySelected();

			if(!id){ this.tabIndex = -1; return; } // Resetted value

			this.modifyValue(this.LayoutType,           containerData.getLayoutType(id));
			this.modifyValue(this.ContentAlign,         containerData.getGridAlign (id));
			this.modifyValue(this.OrientationLeftRight, containerData.getXDirection(id));
			this.modifyValue(this.OrientationTopBottom, containerData.getYDirection(id));
			this.modifyValue(this.textAlign, 			containerData.getTextLayout(id));
			
			this.tabIndex = this.setTabIndex();
		},

		setTabIndex(){
			return (this.LayoutType[0].selected) ? 0 : 1;
		},

		isCurrentlySelected(){ return (this.m_CurrentID); },

// ------------------------------------------------------------------------------------------------------------------------------

    },
	watch:{
		// Update the container data if containes data.
		'containerString'(val){
			if(this.m_CurrentID && val){
				containerData.setContainerName(this.m_CurrentID, val);
			}
		},
		// Enables and disables show name
		'showName'(isShow){
			if(!this.m_CurrentID) return;

			(isShow) ? containerData.enableContainerText(this.m_CurrentID) : 
				containerData.disableContainerText(this.m_CurrentID);
		},
		'showIcon'(isShow){
			if(!this.m_CurrentID) return;

			(isShow) ? containerData.enableListIcon(this.m_CurrentID) : 
				containerData.disableListIcon(this.m_CurrentID);
		},
		'showText'(isShow){
			if(!this.m_CurrentID) return;

			(isShow) ? containerData.enableGridText(this.m_CurrentID) : 
				containerData.disableGridText(this.m_CurrentID);
		}
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