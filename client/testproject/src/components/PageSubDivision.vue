
<script>

import Window from './Window.vue'
import WindowButton from './WindowButton.vue'

export default {
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

            console.log("clicked on :",this.States.selectedContainer.id);
            
            let difference = divisions - this.$ContainerData.value.NoChildren;

            // Some form of selector is needed here
            // For now just use the base

            const current_containerLevel = this.States.selectedContainer.level;
            const current_containerID = this.States.selectedContainer.id;


            let divType = "Vertical"; // This is of the children.

            let container = this.findLevelData(this.$ContainerData.value, current_containerLevel, current_containerID);
            
            let siblingContainers = container.containerData; 

            // Need a way of modifying only the children values.


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

                    siblingContainers.forEach( (cont,index) => { latestIndex = index; });
                    
                    let childLevel = current_containerLevel + 1;
                    let baseID = current_containerID;

                    this.$ContainerData.value.NoChildren = divisions;

                    for(let i = 0; i < divisions; i++){
                        if(i < latestIndex+1){ continue; }

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
                
                // When clicking on the buttons on the menu, they change the values within the container.
                console.log("here");

                difference = Math.abs(difference);
                this.$ContainerData.value.NoChildren -= difference;

                for(let i = 0; i < difference; i++){ container.containerData.pop(); }
            }
            // Do nothing if 0

            // // TODO
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
        
            const current_containerLevel = 0;
            const current_containerID = "0A";

            let parentContainer = this.findLevelData(this.$ContainerData.value, current_containerLevel,current_containerID);
            parentContainer.divisionType = type;
        },

        changeSelectedContainer(newContainerID){
            var level = Number(newContainerID.charAt(newContainerID.length - 2));
            this.States.selectedContainer.level = level;
            this.States.selectedContainer.id = newContainerID;

            this.modifyContainer();
        }
    },
    watch: {
        '$GlobalStates.value.edit.containerSelected':{
            handler(val, oldval){
                this.changeSelectedContainer(val);
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
    <div class="wind-cont">

        <button
            class="select-Container"
            @click="toggleSelectionMode">
            <h2 class="label-text-container">
                Select Container
            </h2>
        </button>

        <div class="window-content">
            <h2>
                Division type
            </h2>

            <div class="grid">
                <div v-for="type in DivisionType">
                    <!-- 
                        When changing the selected container, all this needs to refresh, depending on the values inside
                        Container Data.

                        For e.g When I click on 'Four', for the 0A Container, that should only be associated with the data in
                        ContainerData.
                            level
                            divisionType
                            NoChildren

                        When I select a new container or click back on a pre-existing one,
                        it should show the currently saved data for the container.
                        
                    -->

                    <input 
                        type="radio"
                        :id="type.id" 
                        name="division-type"
                        :value="type.id"
                        :checked="type.index == 0 ? true : false">
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
        </div>

        <hr>

        <h3>
            Container Divisions
        </h3>
        <div class="container-division-number">

            <div v-for="container in ContainerDivision">
                <input 
                    type="radio" 
                    name="no-divisions" 
                    :id="container.id" 
                    :value="container.id" 
                    :checked="container.index === 1 ? true : false">
                <label
                    class="radio-btn no-divisions"
                    :for="container.id"
                    @click="selectContainer(container) ? modifyContainer(container.index) : null "
                    >

                    <div class="bnt-content">

                        <div class="tmpSquare"> </div> 

                        <div class="label-text-container"> 
                            <h3> {{ container.id }} </h3>
                        </div>
                    </div>
                </label>
            </div>

        </div>

        <div>
            <label class="selection fullWidth">
                <input type="checkbox" id="EvenSpacing" name="EvenSpacing" value="EvenSpacing" class="EvenSpacing">

                <h3 for="EvenSpacing">
                    Even Spacing
                </h3>
            </label>
        </div>

        <hr>

        <div>
            % Spacing
            <input 
                type="range"
                min="1" 
                max="100"
                value="50"> 
        </div>
    </div>
</template>

<style scoped>

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

.select-Container{
    width: 100%;
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

.wind-cont{
    padding: 5px;
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