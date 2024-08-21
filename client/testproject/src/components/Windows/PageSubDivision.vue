
<script>
import SingleButton from '../Window Components/SingleButton.vue';
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
        toggleSelectionMode() {

            this.$GlobalStates.value.containerSelectionMode = !this.$GlobalStates.value.containerSelectionMode;
            // this.States.isSelectingContainer = !this.States.isSelectingContainer;
            // this.$emit('Container-Select');
        },


        // Maybe make this funciton smaller?
        modifyContainer(divisions){
            let divType = "Vertical"; // Default value of children

            const current_containerLevel = this.States.selectedContainer.level;
            const current_containerID = this.States.selectedContainer.id;

            let container = this.findLevelData(this.$ContainerData.value, current_containerLevel, current_containerID);

            let difference = divisions - container.NoChildren;
            let siblingContainers = container.containerData; 

            // If positive -1 from value, if already 0 return 0
            let noSiblings =  ( divisions - 1 > 0) ? divisions - 1 : 0; 

            // Positive, add containers
            if(difference > 0){

                // Parent container has no children,
                // Start from scratch
                if(siblingContainers.length === 0 ){
                    console.log("none!")
                }

                // Stores the last current index of the siblings
                var latestIndex;
                let childLevel = current_containerLevel + 1;
                container.NoChildren = divisions;

                siblingContainers.forEach( (cont,index) => { latestIndex = index; });

                for(let i = 0; i < divisions; i++){
                    if(i < latestIndex+1){ continue; } // If the current index is not the last available

                    let newID = current_containerID + this.createID(childLevel, i);

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
                    this.toggleSelectionMode();
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
            // Do nothing if 0
        },

        // Generate ID from the index and parent level
        createID(level, index){ return `${level}`.concat(String.fromCharCode(64 + 1 + index)); },

        // Function copied from Container.
        // Was not sure how to access the function, so I just put it here.
        findLevelData(currentLevelData, Level, ID){

            // Input level is the current level data
            if(Level == currentLevelData.level ){
                // console.log("Item found at current level:", currentLevelData.level, Level );
                return currentLevelData;
            }

            // Retrieve child data
            var childData = currentLevelData.containerData; // if no children, move up stack.
            if(childData.length === 0 ) return null; 
            // console.log("nest:", this.nest_level,  "current Level: ", currentLevelData.level, "Looking for ID:",ID);
            
            // Looks at children
            for(let i = 0; i < childData.length; i++){
                let item = childData[i];

                // Base case (Found item)
                if(item.id == ID){ return item; }

                // Base case (Nothing found and no siblings)
                else if(item.NoChildren === 0 && childData.length <= 1) { return null; }

                // Base case (Has children)
                else{
                    var tmp = this.findLevelData(item, Level + 1, ID);
                    if(tmp !== null){ return tmp; } // If any item is found, return up stack.
                }
            }
            return null; // Not found in children, move up stack.
        },

        // Selects a clicked container and deselect previous container
        selectContainer(container){
            if(container.selected){ return false; }

            // Resets all the other values
            this.ContainerDivision.forEach(cont => { cont.selected = false; });
            container.selected = true;
            return true;
        },

        selectAndModifyContainer(container){
            return this.selectContainer(container) ? this.modifyContainer(container.index) : null ;
        },



        // Update division type of container
        updateDivision(type){
        
            const current_containerLevel = this.States.selectedContainer.level;
            const current_containerID = this.States.selectedContainer.id;

            let parentContainer = this.findLevelData(this.$ContainerData.value, current_containerLevel,current_containerID);
            parentContainer.divisionType = type;
        },

        changeSelectedContainer(newContainerID){
            var level = Number(newContainerID.charAt(newContainerID.length - 2));
            this.States.selectedContainer.level = level;
            this.States.selectedContainer.id = newContainerID;
            
            let evenSplit = this.findLevelData(this.$ContainerData.value, level, newContainerID).evenSplit;
            this.States.selectedContainer.evenlySpaced = evenSplit;
        },

        changeSelectedContainerDivision(index){
            let container = this.findLevelData(this.$ContainerData.value, this.States.selectedContainer.level , this.States.selectedContainer.id);
            
            // If has children, display

            // Cant combine this into a single if statement for some reason.
            if(container.NoChildren !== 0) {
                if(container.NoChildren-1 === index){
                    return true;
                }
            }
            // If no children, select first
            else if (index === 0) {return true;}
            return false;
        },


        // True on a selected container
        changeSelectedDivisionType(index){
            let container = this.findLevelData(this.$ContainerData.value, this.States.selectedContainer.level , this.States.selectedContainer.id);

            if(container.divisionType === "Vertical" && index === 0){ return true;}
            if(container.divisionType === "Horizontal" && index === 1){ return true;}
            return false;
        },
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

        updateStepSize(newValue){
            this.$GlobalStates.value.edit.dragStepSize = newValue; 
        },

        resetSelected(){
            // Whenever we delete or load layout, we need to currently unselect all the user clicked containers
            this.States.selectedContainer.level = 0;
            this.States.id = "0A";
            this.$GlobalStates.value.edit.containerSelected = "0A";
        },
        setSpacingCheckmark(checked){
            // let checkValue = this.States.selectedContainer.evenlySpaced;
            let container = this.findLevelData(this.$ContainerData.value, this.States.selectedContainer.level , this.States.selectedContainer.id);
            container.evenSplit = checked;
            this.States.selectedContainer.evenlySpaced = checked;
        },

// 
// ---------------------------------------------------------------------------------------------------------

// Watchers
// ---------------------------------------------------------------------------------------------------------
    },
    watch: {
        '$GlobalStates.value.edit.containerSelected':{
            handler(val, oldval){
                this.changeSelectedContainer(val);
                this.changeSelectedContainerDivision();
            }
        },
    }
    
}
</script>

<!-- The idea is the user can subdivide the page however they like 
    The page would auto contain one large container and this would be able
    To be subdivided, and allowed to create more containers.
    -->
<template>

    <SingleButton
        @click="toggleSelectionMode" class="center">
        <h2> Select Container </h2>
    </SingleButton>

    <!-- Division Type -->
    <WindowContainerDivider
        class="container-divider">
        <template #header> 
            <h2 class="inline">
                Division type
            </h2>
        </template>

        <template #content>
            <RadioButton
                parent_Variable_String="DivisionType"
                :parent_Fnc_Data="
                {
                    checkedFncDetails:
                    {
                        fncName: 'changeSelectedDivisionType',
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

    <!-- No. divisions -->
    <WindowContainerDivider
        class="container-divider"> 
        <template #header> 
            <h2 class="inline">
                Container Divisions
            </h2>
        </template>

        <template #content>
            <RadioButton
                parent_Variable_String="ContainerDivision"
                :parent_Fnc_Data="{
                    checkedFncDetails:
                    {
                        fncName: 'changeSelectedContainerDivision',
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

    <!-- Toggle Even spacing -->
    <WindowContainerDivider
        class="container-divider"> 
        <template #header>
            <h3 class="inline">
                Even spacing
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
                @change="setSpacingCheckmark(check)"
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

    <!-- Step size slider -->
    <WindowContainerDivider
    class="container-divider">
    
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
                    :parent_Fnc_Data="updateStepSize"
                    :input_Data="[0.05,0.125,0.25, 0.33, 0.5]"/>
            </div>
        </template>

        
        <template #tooltip>
            <ToolTip>
                Step size are in fractional units of the parent container
            </ToolTip>
    </template>
    </WindowContainerDivider>


<!--   REMOVE LATER  -->

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

.container-divider{
    margin: 3px;
}
.container-divider:not(:last-child){
    margin-bottom: 6px;
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