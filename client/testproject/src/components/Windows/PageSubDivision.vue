
<script>
import SingleButton from '../Input Components/SingleButton.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import ToolTip from '../Window Components/ToolTip.vue';
import RadioButton from '../Input Components/RadioBtn.vue';
import RangeSlider from '../Input Components/RangeSlider.vue';

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

            // Radio Button Object Values
            // --------------------------------------------------------------------------
            ContainerDivision: [
                { index: 1, id: "One", selected: true },
                { index: 2, id: "Two", selected: false },
                { index: 3, id: "Three", selected: false },
                { index: 4, id: "Four", selected: false }
            ],
            DivisionType: [
                { index: 0, id: "Vertical", selected: true},
                { index: 1, id: "Horizontal", selected: false},
            ],

            // Range Slider Data
            // --------------------------------------------------------------------------
            
            StepSizeValue: 0, 


            // These were for rendering, they have no semantic value to the data structure

            States: {
                selectedContainer: {
                    level: this.$ContainerData.value.level,
                    id: this.$ContainerData.value.id,
                    evenlySpaced: this.$ContainerData.value.evenlySpaced
                }
            }
        }
    },

    methods: {

        activateSelectionMode() {
            this.$GlobalStates.value.containerSelectionMode = true;
        },


// Tree, recursion and Global Object functions
// -------------------------------------------------------------------------------------------------------------------------

        // Function copied from Container.
        // Not sure how to access the function, so I just put it here.
        getLevelData(currentLevelData, Level, ID){
                
            // Input level is the current level data
            if(Level == currentLevelData.level ){
                return currentLevelData;
            }

            // Retrieve child data
            var childData = currentLevelData.containerData; // if no children, move up stack.
            if(childData.length === 0 ) return null; 
            
            // Looks at children
            for(let i = 0; i < childData.length; i++){
                let item = childData[i];

                // Base case (Found item)
                if(item.id == ID){ return item; }

                // Base case (Nothing found and no siblings)
                else if(item.NoChildren === 0 && childData.length <= 1) { return null; }
                
                // Base case (Has children)
                else{
                    var tmp = this.getLevelData(item, Level + 1, ID);
                    // If any item is found, return up stack.
                    if(tmp !== null){ return tmp; }
                }
            }
            return null; // Not found in children, move up stack.
        },
    
        // Generate new child ID from the index and parent level
        generateID(level, index){ return `${level}`.concat(String.fromCharCode(64 + 1 + index)); },

// Container Modifiers
// -------------------------------------------------------------------------------------------------------------------------

        // Add or remove children depending on the number of divisions
        modifyContainer(divisions){
            const divType = "Vertical"; // Default value of children

            // Container data
            const current_containerLevel = this.States.selectedContainer.level;
            const current_containerID = this.States.selectedContainer.id;
            const childLevel = current_containerLevel + 1;

            let container = this.getLevelData(this.$ContainerData.value, current_containerLevel, current_containerID);
            let difference = divisions - container.NoChildren;
            let siblingContainers = container.containerData; 

            // If positive -1 from value, if already 0 return 0
            const noSiblings =  ( divisions - 1 > 0) ? divisions - 1 : 0; 

            // Positive, add containers
            if(difference > 0){
                var latestIndex;
 
                container.NoChildren = divisions; // Stores the last current index of the siblings
                siblingContainers.forEach( (cont,index) => { latestIndex = index; });

                for(let i = 0; i < divisions; i++){
                    if(i < latestIndex+1){ continue; } // If the current index is not the last available

                    let newID = current_containerID + this.generateID(childLevel, i);
                    container.containerData.push({
                        level: childLevel,
                        divisionType: divType,
                        id: newID,
                        NoChildren: 0,
                        siblings: noSiblings,
                        evenSplit: true,
                        unevenFRData: "",
                        containerData: []
                    });
                }
            }
            // Negative, remove containers
            else if(difference < 0){
                difference = Math.abs(difference);
                container.NoChildren -= difference;
                for(let i = 0; i < difference; i++){ container.containerData.pop(); }
            }
            // Update sibling value
            container.containerData.forEach( (data) => { data.siblings = noSiblings;});
        },

        // Selects a clicked container and deselect previous container
        isNewlySelected(container){
            if(container.selected){ return false; }

            // Resets all the other values
            this.ContainerDivision.forEach(cont => { cont.selected = false; });
            container.selected = true;
            return true;
        },

        // Function for determining user click behaviour on a container
        selectAndModifyContainer(container){ return this.isNewlySelected(container) ? this.modifyContainer(container.index) : null ;},

        // On delete or load layout, we need to currently unselect all the user clicked containers
        resetSelected(){
            this.States.selectedContainer.level = 0;
            this.States.id = "0A";
            this.$GlobalStates.value.edit.containerSelected = "0A";
        },

        // True on a selected container
        isDivisionVertical(index){
            const container = this.getLevelData(this.$ContainerData.value, this.States.selectedContainer.level , this.States.selectedContainer.id);

            if(container.divisionType === "Vertical" && index === 0){ return true;}
            if(container.divisionType === "Horizontal" && index === 1){ return true;}
            return false;
        },

// Update value functions
// -------------------------------------------------------------------------------------------------------------------------

        // Update division type of container on click.
        updateDivision(type){
            const current_containerLevel = this.States.selectedContainer.level;
            const current_containerID = this.States.selectedContainer.id;

            let parentContainer = this.getLevelData(this.$ContainerData.value, current_containerLevel,current_containerID);
            parentContainer.divisionType = type;
        },

        // Update selected radio values from watching the global variable 
        updateSelectedContainer(newContainerID){
            const level = Number(newContainerID.charAt(newContainerID.length - 2));
            this.States.selectedContainer.level = level;
            this.States.selectedContainer.id = newContainerID;
            
            const evenSplit = this.getLevelData(this.$ContainerData.value, level, newContainerID).evenSplit;
            this.States.selectedContainer.evenlySpaced = evenSplit;
        },

        updateSelectedContainerDivision(index){
            let container = this.getLevelData(this.$ContainerData.value, this.States.selectedContainer.level , this.States.selectedContainer.id);
            
            // Cant combine this into a single if statement for some reason.
            if(container.NoChildren !== 0 && container.NoChildren-1 === index) { return true; }
            return false;
        },

        // Update stepsize
        updateStepSize(newValue){ this.$GlobalStates.value.edit.dragStepSize = newValue; },
        
        // Update state of checkmark
        updateSpacingCheckmark(checked){
            let container = this.getLevelData(this.$ContainerData.value, this.States.selectedContainer.level , this.States.selectedContainer.id);
            container.evenSplit = checked;
            this.States.selectedContainer.evenlySpaced = checked;
        },

/*
TODO

Move to different component
*/
// localstorage functions
// ------------------------------------------------------------------------------------------------------------------------

        saveLayout(){
            let containerObj = this.$ContainerData.value;
            
            let container_serialized = JSON.stringify(containerObj);
            localStorage.setItem("containerData", container_serialized);
        },
        loadLayout(){
            const containerData = JSON.parse(localStorage.getItem("containerData"));

            if(containerData === null) {
                console.log ("No data!"); 
                return;
            }

            this.$GlobalStates.clickLoad = true; 
            this.$ContainerData.value = containerData;
            this.resetSelected();
        },
        deleteLayout(){
            // Show prompt 'are you sure you want to delete?'
            
            let baseObject = {
                level: 0,
                divisionType: "Vertical",
                id: "0A",
                NoChildren: 0,
                siblings: 0,
                evenSplit: "true",
                unevenFRData: "",
                containerData: [
                ]
            }

            this.$ContainerData.value = baseObject;
            this.saveLayout();
            this.resetSelected();
        },
        cancelLayout(){
            // Revert back
            this.loadLayout();
        },
// ---------------------------------------------------------------------------------------------------------

// Watchers
// ---------------------------------------------------------------------------------------------------------
    },
    watch: {
        '$GlobalStates.value.edit.containerSelected':{
            handler(val, oldval){
                this.updateSelectedContainer(val);
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


<!-- localstorage. Need to refactor into its own component before removing.
------------------------------------------------------------------------------------------------------------>

    <div>
        <button
        @click="saveLayout"> Save!</button>
    </div>
    
    <div>
        <button
        @click="loadLayout"> Load!</button>
    </div>

    <div>
        <button
        @click="cancelLayout"> Cancel!</button>
    </div>
    
    <div>
        <button
        @click="deleteLayout"> Delete layout!</button>
    </div>
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