import { reactive } from "vue";

class IconData{
    constructor(){ this.resetData(); };
    get allData(){ return this.data; };

    printData(){ console.log(`data:`, this.data); };
    initializeData(importData){ this.data = importData; }

    // For testing purposes, delete later
    resetData(){
        this.data = [
            {
                containerID: "0A1A", // This will have to be set in the Link maker, for now, just keep it static.
                iconDataArray: [
                    {
                        iconID: "ICONA",
                        coordinate:{
                            x: 2, // tmp values
                            y: 2, // tmp values
                        },
                        iconSize: 1,
                        iconImage: null,
                        iconString: "",
                    },
                    {
                        iconID: "ICONB",
                        coordinate:{
                            x: 1, // tmp values
                            y: 1, // tmp values
                        },
                        iconSize: 1,
                        iconImage: null,
                        iconString: "",
                    },
                    {
                        iconID: "ICONC",
                        coordinate:{
                            x: 2, // tmp values
                            y: 3, // tmp values
                        },
                        iconSize: 1,
                        iconImage: null,
                        iconString: "",
                    }
                ]
            }
        ]
    }

    resetData2(){
        this.data = [
            {
                containerID: "", // Which container it is being stored.
                iconDataArray: [
                    {
                        iconID: "",
                        // An icon can be stored in different locations depending on the saved dimension
                        // If free, use these, if compact, store index.

                        // For now just a single position
                        // positions: [{
                        //     savedDimension: {
                        //         rows: null,
                        //         columns: null
                        //     },
                        //     coordinate:{
                        //         x: null,
                        //         y: null,
                        //     }
                        // }],
                        coordinate:{
                            x: null,
                            y: null, 
                        },
                        compactIndex: 0, // For compact data. Should update when drag and dropping.
                        iconSize: 1,
                        iconImage: null,
                        iconString: "",
                    }
                ]
            }
        ]
    }

    checkContainerExist(containerID){
        for(let i = 0; i < this.data.length; i++){ if(this.data[i].containerID === containerID){ return true; } }
        console.warn(`Error (iconData.js): '${containerID}' does not exist`);
        return false;
    }

// Generation

    generateIcon(setX, setY, index, image, string){
        return {
            iconID: this.generateIconID(),
            coordinate:{
                x: setX,
                y: setY,
            },
            compactIndex: index, // For compact data. Should update when drag and dropping.
            iconSize: 1,
            iconImage: image,
            iconString: string,
        }
    }

    generateDefaultIcon(){
        return this.generateIcon(1,1,0,"","icon!");
    }

    generateIconID(){
        // Use some form of hashing to create a unique ID
        // Maybe based on time and date created? 

        return "abc";
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
    moveIcon(iconID,oldContainerID, newContainerID, nColumns, isFree){
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
            newGroup.push(iconData); // Push to end
        }

        oldGroup.splice(iconIndex, 1);
    }

    // Based on coordinate, get the index of the groupArray in which it is the smallest
    getPositionalIndex(group, iconData, nColumns){
        let iconIndex = this.coordinateToIndex(iconData.coordinate.x, iconData.coordinate.y, nColumns);
        for(let i = 0; i < group.length; i++){    
            let indexPosition = this.coordinateToIndex(group[i].coordinate.x, group[i].coordinate.y, nColumns);
            // console.log(iconIndex, indexPosition);
            if(iconIndex < indexPosition){ return i; }
        }

        return group.length; // At the end
    }

    // Add to end
    setAvailableCoordinate(iconID, groupID, newCoordinate){
        let currentGroup = this.getGroup(groupID);
        let iconDataValue = this.getIconDataFromID(currentGroup, iconID);

        iconDataValue.coordinate.x = newCoordinate.x;
        iconDataValue.coordinate.y = newCoordinate.y;
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

// ----------------------------------------------------------------------------------------------------------------
// Getters

    // Get group based on ID.
    getGroup(inputID){
        for(let i = 0; i < this.data.length; i++){
            if(this.data[i].containerID === inputID){ return this.data[i].iconDataArray; }
        }
        // console.warn(`Error (iconData.js): '${inputID}' does not exist`);
        return null;
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
    getIconData(groupArray_Coordinate, x, y){
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

    // Assuming the parameter is a object
    getCoordinate(iconObj)  {return iconObj.coordinate; }
    getCompactIndex(iconObj){return iconObj.compactIndex; }
    getIconSize(iconObj)    {return iconObj.iconSize; }
    getIconImage(iconObj)   {return iconObj.iconImage; }
    getIconString(iconObj)  {return iconObj.iconString; }

// ----------------------------------------------------------------------------------------------------------------
// Setters

    setCoordinate(groupID, iconID, newX,newY){
        let iconData = this.getGroup(groupID).getIconData(iconID);
        iconData.coordinate.x = newX;
        iconData.coordinate.y = newY;
    }

    setIndex(groupID, iconID, newCIndex){
        let iconData = this.getGroup(groupID).getIconData(iconID);
        iconData.compactIndex = newCIndex;
    }

    setIconSize(groupID, iconID, newCIndex){
        let iconData = this.getGroup(groupID).getIconData(iconID);
        iconData.compactIndex = newCIndex;
    }

    setIconImage(groupID, iconID, nIconImage){
        let iconData = this.getGroup(groupID).getIconData(iconID);
        iconData.iconImage = nIconImage;
    }

    setIconString(groupID, iconID, string){
        let iconData = this.getGroup(groupID).getIconData(iconID);
        iconData.iconString = string;
    }
};

const iconDataInstance = new IconData;
export const iconData = reactive(iconDataInstance);