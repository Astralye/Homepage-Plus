
<script>
import SingleButton from './SingleButton.vue';
import WindowContainerDivider from './WindowContainerDivider.vue';
import ToolTip from './ToolTip.vue';

export default {
    components: {
        SingleButton,
        WindowContainerDivider,
        ToolTip
    },
    data() {
        return{
            ContainerDivision: [
                { index: 1, id: "One", selected: true },
                { index: 2, id: "Two", selected: false },
                { index: 3, id: "Three", selected: false },
                { index: 4, id: "Four", selected: false }
            ],
            DivisionType: [
                { index: 0, id: "Vertical" },
                { index: 1, id: "Horizontal" },
            ],
            // These were for rendering, they have no semantic value to the data structure

            States: {
                selectedContainer: {
                    level: this.$ContainerData.value.level,
                    id: this.$ContainerData.value.id
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

        modifyContainer(divisions){
            let divType = "Vertical"; // Default value of children

            const current_containerLevel = this.States.selectedContainer.level;
            const current_containerID = this.States.selectedContainer.id;

            let container = this.findLevelData(this.$ContainerData.value, current_containerLevel, current_containerID);

            let difference = divisions - container.NoChildren;
            let siblingContainers = container.containerData; 

            // Positive, add containers            
            if(difference > 0){

                // Parent container has no children,
                // Start from scratch
                if(siblingContainers.length === 0 ){
                    console.log("none!")
                }
                // Create ID taking into account the last child.
                {
                    // Stores the last current index of the siblings
                    var latestIndex;
                    let childLevel = current_containerLevel + 1;
                    let baseID = current_containerID;
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
                            containerData: []
                        });
                        
                        this.toggleSelectionMode();
                    }
                }
            }
            // Negative, remove containers
            else if(difference < 0){

                difference = Math.abs(difference);
                container.NoChildren -= difference;
                for(let i = 0; i < difference; i++){ container.containerData.pop(); }
            }
            // Do nothing if 0
        },

        createID(level, index){
            return `${level}`.concat(String.fromCharCode(64 + 1 + index));
        },

        // Function copied from Container.
        // Was not sure how to access the function, so I just put it here.
        findLevelData(currentLevelData, Level, ID){

            var childData = currentLevelData.containerData;

            // console.log("nest:", Level,  "current Level: ", currentLevelData.level, "Looking for ID:",ID);

            // If this level,
            if(Level == currentLevelData.level ){
                // console.log("Item found")
                return currentLevelData;
            }
            
            if(childData.length === 0 ) return null;

            // Needs to look at itself
            // Looks at the children
            for(let i = 0; i < childData.length; i++){
                
                let item = childData[i];
                // console.log("Looking at:", item.id);

                // Base case (Found item)
                if(item.id == ID){
                    // console.log("Item found")
                    return item
                }
                // Base case (Nothing found and only no siblings)
                else if(item.NoChildren === 0 && childData.length <= 1)
                {
                    return null;
                }
                // Recursive
                else{
                    // Moves down 1 level
                    var tmp = this.findLevelData(item, Level + 1, ID);
                    // If found, return up stack.
                    if(tmp !== null){ return tmp; }
                }
            }
            return null;
        },

        selectContainer(container){
            
            if(!container.selected){
                // Resets all the other values
                this.ContainerDivision.forEach(cont => { cont.selected = false; });
                container.selected = true;
                return true;
            }
            else{
                return false;
            }
        },

        // Update division type
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
        },

        changeSelectedContainerDivision(index){
            let container = this.findLevelData(this.$ContainerData.value, this.States.selectedContainer.level , this.States.selectedContainer.id);
            
            // If has children, display
            if(container.NoChildren !== 0) {
                if(container.NoChildren-1 === index){
                    return true;
                }
            }
            // If no children, select first
            else if (index === 0) {return true;}

            return false;
        },

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

        resetSelected(){
            // Whenever we delete or load layout, we need to currently unselect all the user clicked containers
            this.States.selectedContainer.level = 0;
            this.States.id = "0A";
            this.$GlobalStates.value.edit.containerSelected = "0A";
        }
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

    <!-- <button
        @click="toggleSelectionMode">
        <h2 class="label-text-container">
            Select Container
        </h2>
    </button> -->

    <SingleButton
        @click="toggleSelectionMode" class="center">
        <h2> Select Container </h2>
    </SingleButton>

    <!--
        Maybe have a component call 
        window container divider.
        Since im using it alot

        Often, this would use a header
        as well as a div with the content.
    -->

    <WindowContainerDivider
        class="container-divider">
        <template #header> 
            <h2 class="inline">
                Division type
            </h2>
        </template>

        <template #content>
            <div class="grid">
                <div v-for="(type,index) in DivisionType">
                    <input 
                        type="radio"
                        :id="type.id" 
                        name="division-type"
                        :value="type.id"
                        :checked="changeSelectedDivisionType(index)">
                    <label 
                        class="radio-btn division-type" 
                        :for="type.id"
                        @click="updateDivision(type.id)">
    
                        <div class="label-text-container">
                            <h3> {{ type.id }} </h3>
                        </div>
                    </label>
                </div> 
            </div>
        </template>

        <template #tooltip>
            <ToolTip>
                Divisions
            </ToolTip>
        </template>
    </WindowContainerDivider>

    <WindowContainerDivider
        class="container-divider"> 
        <template #header> 
            <h2 class="inline">
                Container Divisions
            </h2>
        </template>

        <template #content>
            <div class="container-division-number">
    
                <div v-for="(container,index) in ContainerDivision">
                    <input 
                        type="radio" 
                        name="no-divisions" 
                        :id="container.id" 
                        :value="container.id" 
                        :checked="changeSelectedContainerDivision(index)">
                    <label
                        class="radio-btn no-divisions"
                        :for="container.id"
                        @click="selectContainer(container) ? modifyContainer(container.index) : null ">
                        <div class="bnt-content">
    
                            <div class="tmpSquare"> </div> 
    
                            <div class="label-text-container"> 
                                <h3> {{ container.id }} </h3>
                            </div>
                        </div>
                    </label>
                </div>
    
            </div>
        </template>

        <template #tooltip>
            <ToolTip>
                Number of divisions the container will have.
            </ToolTip>
        </template>
    </WindowContainerDivider>

    <WindowContainerDivider
        class="container-divider"> 
        <template #header>
            <h4 class="inline">
                Even spacing
            </h4>
        </template>

        <template #content>
            <label class="selection fullWidth">
                <input type="checkbox" id="EvenSpacing" name="EvenSpacing" value="EvenSpacing" class="EvenSpacing">
            </label>
        </template>

        <template #tooltip>
            <ToolTip>
                Divisions
            </ToolTip>
        </template>
    </WindowContainerDivider>

    <div>
        % Spacing
        <input 
            type="range"
            min="1" 
            max="100"
            value="50"> 
    </div>

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

.no-divisions{
    height: auto;
}

.radio-btn{
    display: block;
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