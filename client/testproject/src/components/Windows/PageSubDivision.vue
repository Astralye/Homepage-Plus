
<script>
import SingleButton from '../Input Components/SingleButton.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import ToolTip from '../Window Components/ToolTip.vue';
import RadioButton from '../Input Components/RadioBtn.vue';
import RangeSlider from '../Input Components/RangeSlider.vue';
import ContainerSelection from '../Window Components/ContainerSelection.vue';
import Checkbox from '../Input Components/Checkbox.vue';

import { editVariables } from '../../Data/SettingVariables.js';
import { layout, LayoutDataClass } from '../../Data/layoutData.js';
export default {
    components: {
        WindowContainerDivider,
        ContainerSelection,
        SingleButton,
        RadioButton,
        RangeSlider,
        Checkbox,
        ToolTip,
        
    },
    data() {
        return{
            LayoutDataClass,
            editVariables,
            layout,
            
            // Radio Button Object Values
            // --------------------------------------------------------------------------
            ContainerDivision: [
                { id: "One",    selected: false },
                { id: "Two",    selected: false },
                { id: "Three",  selected: false },
                { id: "Four",   selected: false },
            ],
            DivisionType: [
                { id: "Vertical",   selected: false },
                { id: "Horizontal", selected: false },
            ],

            // Range Slider Data
            // --------------------------------------------------------------------------
            
            m_StepSizeValues: [0.05, 0.125, 0.25, 0.33, 0.5],
            
            // These were for rendering, they have no semantic value to the data structure
            selectedContainer: {},
        }
    },
    mounted(){
        editVariables.enableLayoutWindow();
        editVariables.selectionContainerToggler();
    },
    unmounted(){
        editVariables.disableLayoutWindow();
        editVariables.selectionContainerToggler();
    },
    methods: {

    // Setter
    
        setContainerData(level, id, evenlySpaced){
            this.selectedContainer.level = level;
            this.selectedContainer.id = id;
            this.selectedContainer.evenlySpaced = evenlySpaced;
        },

    // Boolean

        // If a container is selected
        isNoSelect(){ return (editVariables.containerSelected === null); },

    // Array resetters and setters
        
        // Resets all values of a given array
        resetAll(array){ array.forEach(cont => { cont.selected = false; }); },

        // Enables the currently selected property from save
        itemEnable(array, property){
            array.forEach(el => {
                if(el.id == property){ el.selected = true;}
            })
        },

        // Resets all values
        noSelection(){
            this.selectedContainer = {};
            this.resetAll(this.ContainerDivision);
            this.resetAll(this.DivisionType);
        },

    // Converter

        // Text displays number as the word
        // Algorithm to code and decode it from storage
        numToString(num){
            switch(num){
                case 1: { return "One"; }
                case 2: { return "Two"; }
                case 3: { return "Three"; }
                case 4: { return "Four"; }
            }
        },

        stringToNum(str){
            switch(str){
                case 'One':  { return 1; }
                case 'Two':  { return 2; }
                case 'Three':{ return 3; }
                case 'Four': { return 4; }
            }
        },

// Update value functions
// -------------------------------------------------------------------------------------------------------------------------

        // Function for determining user click behaviour on a container
        updateNoDivisions(number){ 
            if(this.isNoSelect()) { return; } // Do not allow button presses when no selection
            let cont = this.selectedContainer;

            // Reset all and enable specific item
            this.resetAll(this.ContainerDivision);
            this.itemEnable(this.ContainerDivision, number)

            // Set layout value data
            layout.modifyContainer(this.stringToNum(number), cont.level, cont.id);
        },

        // Update division type of container on click.
        updateDivision(type){
            let cont = LayoutDataClass.getLevelData(layout.allData, this.selectedContainer.level , this.selectedContainer.id);
            cont.divisionType = type;
        },

        // Update state of checkmark
        updateSpacingCheckmark(checked){
            let container = LayoutDataClass.getLevelData(layout.allData, this.selectedContainer.level , this.selectedContainer.id);
            if(!container) return; // If no data selected

            container.evenSplit = checked;
            this.selectedContainer.evenlySpaced = checked;
        },

        // Update selected radio values from watching the global variable 
        updateSelectedContainer(newContainerID){
            if(this.isNoSelect()) return;
            const level = Number(newContainerID.charAt(newContainerID.length - 2));
            const evenSplit = LayoutDataClass.getLevelData(layout.allData, level, newContainerID).evenSplit;

            this.setContainerData(level, newContainerID, evenSplit);

            // Reset everything first before setting.
            this.resetAll(this.ContainerDivision);
            this.resetAll(this.DivisionType);

            // Load Division data
            this.itemEnable(this.DivisionType, this.parentContainer.divisionType);
            this.itemEnable(this.ContainerDivision, this.numToString(this.parentContainer.NoChildren));
 
        },
    },
    computed:{
        parentContainer(){
            let data = LayoutDataClass.getLevelData(layout.allData, this.selectedContainer.level , this.selectedContainer.id);
            return (data) ? data : null;
        },
        isCurrentlySelected(){
            return !(Object.keys(this.selectedContainer).length === 0 && this.selectedContainer.constructor === Object);
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

<!-- Container Selection -->

    <ContainerSelection
        @reset="noSelection"
        @updateSelected="val => updateSelectedContainer(val)"
    />
    
    <WindowContainerDivider>
        <template #header> 
            <h2>
                Page Layout
            </h2>
        </template>
        
        <template #content>

            <!-- Division Type -------------------------------------------------------------------------------------------------------->
            <WindowContainerDivider
                class="contiguous-divider"> 
                <template #header> 
                    <h3>
                        Division Type
                    </h3>
                </template>
        
                <template #content>
                    <RadioButton
                        v-model="DivisionType"
                        :enable_Radio="(editVariables.containerSelected) ? true : false"
                        @clickEvent="id => updateDivision(id)"
                        />
                </template>
        
                <template #tooltip>
                    <ToolTip>
                        How the container is split.
                        Vertical gives rows, while Horizontal gives columns 
                    </ToolTip>
                </template>
            </WindowContainerDivider>

            <!-- No. divisions -------------------------------------------------------------------------------------------------------->
            <WindowContainerDivider
                class="contiguous-divider"> 
                <template #header> 
                    <h3 class="inline">
                        No. Container Divisions
                    </h3>
                </template>
        
                <template #content>
                    <RadioButton
                        v-model="ContainerDivision"
                        :enable_Radio="(editVariables.containerSelected) ? true : false"
                        @clickEvent="id => updateNoDivisions(id)"
                    />
                </template>
        
                <template #tooltip>
                    <ToolTip>
                        Number of divisions the container will have
                    </ToolTip>
                </template>
            </WindowContainerDivider>
        </template>
    </WindowContainerDivider>


<!-- Toggle even spacing
-------------------------------------------------------------------------------------------------------->
    <WindowContainerDivider> 
        <template #header>
            <h2 class="inline">
                Layout Spacing
            </h2>
        </template>

        <template #content>
            <div class="container-content-margin-top">
                <Checkbox
                    @onChange="check => updateSpacingCheckmark(check)"
                    :enabled="isCurrentlySelected"
                    :checkValue="selectedContainer.evenlySpaced"
                    text="Toggle Even spacing"
                />
                <!-- Step size Slider
                -------------------------------------------------------------------------------------------------------->
                <WindowContainerDivider
                    class="contiguous-divider">
                    
                    <!-- 
                        TODO
                        Within the container, have an option to enable and disable it.
                    -->
                
                    <template #header>
                        <h3 class="inline">
                            Drag step size
                        </h3>
                    </template>
                
                    <template #content>
                        <div class="container-content-margin-top relative">
                            
                            <RangeSlider
                                :no_Items="m_StepSizeValues.length"
                                :enabled="isCurrentlySelected"
                                :caption_Data="m_StepSizeValues"
                                v-model="editVariables.values.dragStepSize"
                            />
                        </div>
                    </template>
            
                    
                    <template #tooltip>
                        <ToolTip>
                            Step size are in fractional units of the parent container
                        </ToolTip>
                    </template>
                </WindowContainerDivider>
            </div>
        </template>

        <template #tooltip>
            <ToolTip>
                Enable to maintain even spacing between all the child containers
            </ToolTip>
        </template>
    </WindowContainerDivider>
</template>

<style scoped>

.relative{
    position: relative;
}

.no-select-transition{
    width: 100%;
    height: 100%;
    border-radius: 1em;
    pointer-events: none;

    background-color: rgba(97, 97, 97, 0);
    position: absolute;
    z-index: 0; /* Able to click through by changing the z-index back */

    transition: all 250ms ease-out;
}

.no-select-container{
    width: 100%;
    height: 100%;
    border-radius: 1em;

    background-color: rgba(97, 97, 97, 0.74);
    position: absolute;
    z-index: 1;

    transition: all 250ms ease-out;
}

.contiguous-divider{
    margin-bottom: 0;
    padding-bottom: 0.25em;
}

.space-between{
    justify-content: space-between;
}

.button-left-padding{
    margin-left: 0.5em;
}

.container-content-margin-top{
    margin-top: 0.5em;
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

.flex-row{
    flex-direction: row;
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