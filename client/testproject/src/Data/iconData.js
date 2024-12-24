import { reactive } from "vue";

class IconData{
    constructor(){ this.resetData(); };
    get allData(){ return this.data; };

    printData(){ console.log(`data:`, this.data); };
    initializeData(importData){ this.data = importData; }

    // For testing purposes, delete later
    resetData(){
        this.data = []
    }

    // For testing purposes, to keep initalized data.
    // Will be removed later
    initDataFromStorage(storageData){
        this.data = storageData;
    }
    
    checkContainerExist(containerID){
        for(let i = 0; i < this.data.length; i++){ if(this.data[i].containerID === containerID){ return true; } }
        if(this.isFromStorage(containerID)){ return true; }
        console.warn(`Error (iconData.js): '${containerID}' does not exist`);
        return false;
    }

// Generation

    generateIcon(setX, setY, image, string){
        return {
            iconID: this.generateIconID(),
            coordinate:{
                x: setX,
                y: setY,
            },
            iconColour: "#000000",
            iconSize: "75",
            iconImage: image,
            
            iconString: string,
            iconStringSize: "16px",
            
            link: "",
            displayText: true,
        }
    }

    generateDefaultIcon(){
        return this.generateIcon(1,1,"Dotted_Square","Sample Text");
    }

    // Generates a 4 digit Hex id: idXXXX
    generateIconID(){
        var id;
        do{ id = ("id" + Math.random().toString(16).slice(12)); }
        while( this.doesIconIDexist(id,true) || iconData.doesIconIDexist(id, false)); // If icon exists, run again
        return id;
    }
    
    // Data storage of icons in the containers is different than storage
    doesIconIDexist(id, isStorage){
        for(let i = 0; i < this.data.length; i++){
            if(isStorage){ if(id === this.data[i].iconID){ return true; };} 

            else{
                // Each i, corresponds to the container.
                for(let j = 0; j < this.data[i].iconDataArray.length; j++){
                    if(id === this.data[i].iconDataArray[j].iconID){ console.log("end"); return true; }
                }
            }
        }
        return false;
    }

// Coordinate Index
// -------------------------------------------------------------------------------------------------------------------------

    coordinateToIndex(x,y, columns){
        return (columns * y) + x;
    }

    indexToCoord(index, rows){
        let x = ( index % rows);
        let y = ~~(index / rows); 
        return {x , y};
    }

// Manipulation
// -------------------------------------------------------------------------------------------------------------------------

    sortGroup(oldContainerID, nColumns){
        this.getGroup(oldContainerID).sort((objA, objB)=> {
            if(this.coordinateToIndex(objA.coordinate.x,objA.coordinate.y, nColumns) 
                < this.coordinateToIndex(objB.coordinate.x, objB.coordinate.y, nColumns)){
                return -1;
            }

            if(this.coordinateToIndex(objA.coordinate.x,objA.coordinate.y, nColumns) 
                > this.coordinateToIndex(objB.coordinate.x, objB.coordinate.y, nColumns)){
                return 1;
            }

            return 0;
        });
    }

    //ID of Icon, old container and new container
    moveIcon(iconID,oldContainerID, newContainerID, nColumns, isFree=false, insertIndex=-1){
        if(!this.checkContainerExist(newContainerID)){  this.createGroup(newContainerID); }
        
        let oldGroup  = this.getGroup(oldContainerID);
        let newGroup  = this.getGroup(newContainerID);

        let iconData  = this.getIconDataFromID(oldGroup, iconID);
        let iconIndex = this.getIconIndexOfGroup(oldGroup, iconID);

        if(iconIndex === -1 ){
            console.error(`Error (iconData.js): iconID '${iconIndex}' does not exist within group '${oldContainerID}'`);
            return;
        }

        // Determines where to insert the new data
        if(isFree){
            let groupArrIndex = this.getPositionalIndex(newGroup, iconData, nColumns);
            newGroup.splice(groupArrIndex, 0, iconData); // Insert new data at the new index
        }
        else{
            // Move to index, if has value
            (insertIndex != -1) ?  this.moveItemToIndex(newGroup, insertIndex, iconData) : newGroup.push(iconData);
        }

        oldGroup.splice(iconIndex, 1);
    }

    // Based on coordinate, get the index of the groupArray in which it is the smallest
    getPositionalIndex(group, iconData, nColumns){
        let iconIndex = this.coordinateToIndex(iconData.coordinate.x, iconData.coordinate.y, nColumns);
        for(let i = 0; i < group.length; i++){    
            let indexPosition = this.coordinateToIndex(group[i].coordinate.x, group[i].coordinate.y, nColumns);
            if(iconIndex < indexPosition){ return i; }
        }

        return group.length; // At the end
    }

    swapIndices(group, index_A, index_B){
        [group[index_A], group[index_B]] = [group[index_B], group[index_A]];
    }
    
    moveItemToEnd(group, index){
        group.push(group.splice(index, 1)[0]);
    }

    moveItemToIndex(group, index, data){
        group.splice(index, 0, data);
    }

    isIconIDInGroup(group, iconID){
        var doesExist = false;
        group.forEach(element => {
            if(element.iconID === iconID) { doesExist = true;  }
        });
        return doesExist;
    }

    deleteIndex(group, index){
        if(index < 0) return;
        group.splice(index, 1);
    }

    createGroup(containerIDString){
        this.data.push(
            {
                containerID: containerIDString,
                iconDataArray: []
            }
        );
    }

    deleteGroup(containerID){
        if(this.checkContainerExist(containerID)){
            // Remove item
        }
    }

    deleteIcon(groupID, iconID){
        let group = this.getGroup(groupID);
        let index = this.getIconIndexOfGroup(group, iconID);

        group.splice(index, 1);
    }

    isFromStorage(groupID){
        return (groupID === "Storage");
    }

// ----------------------------------------------------------------------------------------------------------------
// Getters

    // Get group based on ID.
    getGroup(inputID){
        for(let i = 0; i < this.data.length; i++){
            if(this.data[i].containerID === inputID){ return this.data[i].iconDataArray; }
        }
        // console.warn(`Error (iconData.js): '${inputID}' does not exist`);
        return (this.isFromStorage(inputID)) ? iconStorage.allData : null;
    }

    // The Getters that use variable 'groupArray_XX' contains the same data
    // The values at the end make it easier to identify for debugging.

    // Based off N index, not the same as compactIndex
    getIconDataFromID(groupArray_ID, iconID){
        for(let i = 0; i < groupArray_ID.length; i++){
            if(groupArray_ID[i].iconID === iconID){ return groupArray_ID[i]; }
        }
        console.error(`Error (iconData.js): iconID '${iconID}' not valid.`);
        return null;
    }

    // Based off Index
    getIconDataFromIndex(groupArray_Index, index){
        if(index > groupArray_Index.length) { return null; }
        return groupArray_Index[index];
    }

    // Based off coordinate
    getIconDataFromCoordinate(groupArray_Coordinate, x, y){
        for(let i = 0; i < groupArray_Coordinate.length; i++){
            if(groupArray_Coordinate[i].coordinate.x === x && groupArray_Coordinate[i].coordinate.y === y){ return groupArray_Coordinate[i]; }
        }
        // console.error(`Error (iconData.js): Input Coordinates: (${x},${y}) not found`);
        return null;
    }

    getIconIndexOfGroup(groupArray, iconID){
        for(let i = 0; i < groupArray.length; i++){ if(groupArray[i].iconID === iconID){ return i; } }
        console.error(`Error (iconData.js): IconID '${iconID}' does not exist`);
        return -1;
    }

// ----------------------------------------------------------------------------------------------------------------
// Setters

    setCoordinate(groupID, iconID, newX,newY){
        let iconData = this.getIconDataFromID(this.getGroup(groupID), iconID);
        iconData.coordinate.x = newX;
        iconData.coordinate.y = newY;
    }

    setIconSize(groupID, iconID, newSize){
        let iconData = this.getIconDataFromID(this.getGroup(groupID), iconID);
        iconData.iconSize = newSize;
    }

    setIconImage(groupID, iconID, nIconImage){
        let iconData = this.getIconDataFromID(this.getGroup(groupID), iconID);
        iconData.iconImage = nIconImage;
    }

    setIconString(groupID, iconID, string){
        let iconData = this.getIconDataFromID(this.getGroup(groupID), iconID);
        iconData.iconString = string;
    }
};

class IconSelected {
    constructor(){ this.iconSelectionArray = []; }

    // It will be stored as a list.
    addNewData(iconID, groupID){

        // Do not add if already in.
        if(this.isContainSelectedData(iconID, groupID)) return;

        this.iconSelectionArray.push(
            {
                iconID: iconID,
                groupID: groupID,
            }
        )
    }

    removeData(iconID, containerID){
        let index = this.getIndexOfIcon(iconID, containerID);

        if(index === -1) return;
        
        this.iconSelectionArray.splice(index, 1);
    }

    getIndexOfIcon(iconID, groupID){
        for(let i = 0; i < this.iconSelectionArray.length; i++){
            if(this.iconSelectionArray[i].iconID === iconID 
                && this.iconSelectionArray[i].groupID === groupID){
                
                return i;
            }
        }
        return -1;
    }

    // Check within array if it is found.
    isContainSelectedData(inputID, inputGroup){

        var isFound = false;

        this.iconSelectionArray.forEach(iconData => {
            if(iconData.iconID === inputID && iconData.groupID === inputGroup){

                console.log(iconData.iconID, iconData.groupID, );
                isFound = true;
            }
        });

        return isFound;
    }

    resetData(){
        console.log("reset");
        this.iconSelectionArray = [];
    }

    get array(){ return this.iconSelectionArray; };
}

const iconDataInstance    = new IconData;
const iconStorageInstance = new IconData;
const iconSelectInstance  = new IconSelected;

export const iconData     = reactive(iconDataInstance);
export const iconStorage  = reactive(iconStorageInstance);
export const iconSelect   = reactive(iconSelectInstance);