
<script>
import SingleButton from '../Input Components/SingleButton.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import ToolTip from '../Window Components/ToolTip.vue';
import RadioButton from '../Input Components/RadioBtn.vue';
import RangeSlider from '../Input Components/RangeSlider.vue';

import { layout, LayoutDataClass } from '../../Data/layoutData.js';

export default {
    components: {
        SingleButton,
        WindowContainerDivider,
        ToolTip,
        RadioButton,
        RangeSlider
    },
    data() {
        return{
            LayoutDataClass,
            layout,
            
            // Radio Button Object Values
            // --------------------------------------------------------------------------
            ContainerDivision: [
                { index: 1, id: "One",   selected: true },
                { index: 2, id: "Two",   selected: false },
                { index: 3, id: "Three", selected: false },
                { index: 4, id: "Four",  selected: false }
            ],
            DivisionType: [
                { index: 0, id: "Vertical",   selected: true},
                { index: 1, id: "Horizontal", selected: false},
            ],

            // Range Slider Data
            // --------------------------------------------------------------------------
            
            StepSizeValue: 0, 


            // These were for rendering, they have no semantic value to the data structure

            States: {
                selectedContainer: {
                    level: layout.allData.level,
                    id: layout.allData.id,
                    evenlySpaced: layout.allData.evenlySpaced
                }
            }
        }
    },

    methods: {

        activateSelectionMode() {
            this.$GlobalStates.value.containerSelectionMode = true;
        },

// Container Modifiers
// -------------------------------------------------------------------------------------------------------------------------

        // Selects a clicked container and deselect previous container
        isNewlySelected(container){
            // Resets all the other values
            this.ContainerDivision.forEach(cont => { cont.selected = false; });
            container.selected = true;
            return true;
        },

        // Function for determining user click behaviour on a container
        selectAndModifyContainer(container){ 
            if(this.noSelect()) { return; } // Do not allow button presses when no selection

            if(this.isNewlySelected(container)){
                let cont = this.States.selectedContainer;
                layout.modifyContainer(container.index, cont.level, cont.id);
            }
        },

        // On delete or load layout, we need to currently unselect all the user clicked containers
        resetSelected(){
            this.States.selectedContainer.level = layout.allData.level;
            this.States.selectedContainer.id    = layout.allData.id;
            this.$GlobalStates.value.edit.containerSelected = null;
            this.$GlobalStates.value.edit.resetSelect       = false;
        },

        noSelect(){ return (this.$GlobalStates.value.edit.containerSelected === null); },

        // True on a selected container
        isDivisionVertical(index){
            if(this.noSelect()) { return; } // Do not allow button presses when no selection

            const container = LayoutDataClass.getLevelData(layout.allData, this.States.selectedContainer.level , this.States.selectedContainer.id);

            if(container.divisionType === "Vertical" && index === 0)  { return true;}
            if(container.divisionType === "Horizontal" && index === 1){ return true;}
            return false;
        },

// Update value functions
// -------------------------------------------------------------------------------------------------------------------------

        // Update division type of container on click.
        updateDivision(type){
            let parentContainer = LayoutDataClass.getLevelData(layout.allData, this.States.selectedContainer.level , this.States.selectedContainer.id);
            parentContainer.divisionType = type;
        },

        // Update selected radio values from watching the global variable 
        updateSelectedContainer(newContainerID){
            if(this.noSelect()){ return; }
            const level = Number(newContainerID.charAt(newContainerID.length - 2));
            const evenSplit = LayoutDataClass.getLevelData(layout.allData, level, newContainerID).evenSplit;
            
            this.States.selectedContainer.level = level;
            this.States.selectedContainer.id = newContainerID;
            this.States.selectedContainer.evenlySpaced = evenSplit;
        },

        updateSelectedContainerDivision(index){
            let container = LayoutDataClass.getLevelData(layout.allData, this.States.selectedContainer.level , this.States.selectedContainer.id);
            
            if(container.NoChildren !== 0 && container.NoChildren-1 === index) { return true; }
            return false;
        },

        // Update stepsize
        updateStepSize(newValue){ this.$GlobalStates.value.edit.dragStepSize = newValue; },
        
        // Update state of checkmark
        updateSpacingCheckmark(checked){
            let container = LayoutDataClass.getLevelData(layout.allData, this.States.selectedContainer.level , this.States.selectedContainer.id);
            container.evenSplit = checked;
            this.States.selectedContainer.evenlySpaced = checked;
        },

// Watchers
// ---------------------------------------------------------------------------------------------------------
    },
    watch: {
        '$GlobalStates.value.edit.containerSelected'(val, oldval){
            this.updateSelectedContainer(val);
        },
        '$GlobalStates.value.edit.resetSelect'(val, oldval){
            if(val){
                this.resetSelected();
            }
        },
    }
}
</script>

<!-- 
    The idea is the user can subdivide the page however they like 
    The page would auto contain one large container and this would be able
    To be subdivided, and allowed to create more containers.
-->
<template>

    <SingleButton
        @click="activateSelectionMode" class="center">
        <h2 class="single-button-dark"> Select Container </h2>
    </SingleButton>

<!-- Division Type
-------------------------------------------------------------------------------------------------------->
    <WindowContainerDivider>
        <template #header> 
            <h2 class="inline">
                Division type
            </h2>
        </template>

        <template #content>
            <RadioButton
                parent_Variable_String="DivisionType"
                :enable_-radio="this.$GlobalStates.value.edit.containerSelected"
                :parent_Fnc_Data="{
                    checkedFncDetails:
                    {
                        fncName: 'isDivisionVertical',
                        parameterType: 'index',
                    },

                    clickedFncDetails:
                    {
                        fncName: 'updateDivision',
                        parameterType: 'id',
                    }
                }"
                >
            </RadioButton>
        </template>

        <template #tooltip>
            <ToolTip>
                Determines how the container is divided
            </ToolTip>
        </template>
    </WindowContainerDivider>

<!-- No. divisions
-------------------------------------------------------------------------------------------------------->
    <WindowContainerDivider> 
        <template #header> 
            <h2 class="inline">
                No. Container Divisions
            </h2>
        </template>

        <template #content>
            <RadioButton
                parent_Variable_String="ContainerDivision"
                :enable_-radio="this.$GlobalStates.value.edit.containerSelected"
                :parent_Fnc_Data="{
                    checkedFncDetails:
                    {
                        fncName: 'updateSelectedContainerDivision',
                        parameterType: 'index',
                    },
                    clickedFncDetails:
                    {
                        fncName: 'selectAndModifyContainer',
                        parameterType: 'object',
                    }
                    }"
                >
            </RadioButton>
        </template>

        <template #tooltip>
            <ToolTip>
                Number of divisions the container will have
            </ToolTip>
        </template>
    </WindowContainerDivider>

<!-- Toggle even spacing
-------------------------------------------------------------------------------------------------------->
    <WindowContainerDivider> 
        <template #header>
            <h3 class="inline">
                Toggle Even Spacing
            </h3>
        </template>

        <template #content>
            <div class="container-content-margin-top">

                <input 
                type="checkbox" 
                id="EvenSpacing"
                name="EvenSpacing" 
                value="EvenSpacing"
                class="EvenSpacing"
                v-model="check"
                @change="updateSpacingCheckmark(check)"
                :checked="this.States.selectedContainer.evenlySpaced"
                >
                    
                <label class="selection fullWidth"></label>
            </div>
        </template>

        <template #tooltip>
            <ToolTip>
                Enable to maintain even spacing between all the child containers
            </ToolTip>
        </template>
    </WindowContainerDivider>

<!-- Step size Slider
-------------------------------------------------------------------------------------------------------->
    <WindowContainerDivider>
    
    <!-- 
        TODO
        Within the container, have an option to enable and disable it.
    -->

    <template #header>
        <h4 class="inline">
            Drag step size
        </h4>
    </template>

        <template #content>
            <div class="container-content-margin-top">
                <RangeSlider
                    :m_function="updateStepSize"
                    :input_Data="[0.05,0.125,0.25, 0.33, 0.5]"/>
            </div>
        </template>

        
        <template #tooltip>
            <ToolTip>
                Step size are in fractional units of the parent container
            </ToolTip>
    </template>
    </WindowContainerDivider>

</template>

<style scoped>

.container-content-margin-top{
    margin-top: 0.5rem;
}

.width-100{
    width: 70%;
}

.flex{
    display: flex;
}

.inline{
    display: inline;
}

.center{
    margin: auto;
}

.btnActive{
    background-color: green;
}

.bnt-content{
    margin: 5px;
}

.tmpSquare{
    background-color: black;
    height: 80px;
    width: 80px;
    margin-left: auto;
    margin-right: auto;
}

button.select-Container{
    background-color: silver;
}

button.select-Container:hover{
    background-color: grey;
}

.label-text{
    margin: auto;
}

input[type="radio"]{
    display: none;
}

label{
    margin: 5px;
    box-sizing: border-box;
    cursor: pointer;
}

label:hover{
    background-color: grey;
}

input[type="radio"]:checked + label{
    border: 2px solid green;
    background-color: green;
    cursor: not-allowed
}

.division-type{
    height: 40px;
}


.radio-btn{
    display: block;
    width: auto;
    background-color: silver;
    border: 2px solid black;
    border-radius: 5px;
}

.EvenSpacing{
    margin-right: 10px;
}

.division-item{
    margin: 5px;
}

.grid{
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.selection{
    display: inline-flex;
}

.inputSelect{
    margin-left: 10px;
}

.label-text-container{
    text-align: center;    
    margin: auto;
}

.container-division-number{
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    
    height: auto;
    width: 90%;

    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    margin-bottom: 10px;

    border-style: solid;
    border-width: 1px;
    border-color: black;
}
</style>