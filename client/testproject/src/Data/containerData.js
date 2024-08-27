import { reactive } from 'vue'

/*
    Due to js object properties and other reasons, I wasn't able to add and remove objects with keys as IDs
    Ideally this lookup time would be O(1), due to keys as IDs, unfortunately 
    trying to implement this is abit of a nightmare

    Unfortunately, I can only implement this using an array with search times of O(n).
    Although this isn't a big deal, it is mildly frustrating that add and removing objects is causing this much 
    pain.

    Vue3 does not support private properties or methods 
    for reactive data. Cannot enforce visibility

    containerData.data should not be used explicitly outside this file.
*/
class containerDataClass{
  constructor(){ this.resetData(); }
  get allData(){ return this.data; }

  printData() { console.log(`data:`, this.data); };

  // Basic array functions
  resetData() {this.data = [this.generateDefaultLayout("0A")]; };
  intializeData(inputData){ this.data = inputData; };

  // Add to data
  add(object){ this.data.push(object); };
  addNewID(inputID){ this.add(this.generateDefaultLayout(inputID)); };

  // Delete data
  deleteIndex(index) { this.data.splice(index,1); };
  deleteID(inputID){ 
    let index = this.getIndexFromID(inputID);
    console.log(`Deleting: ${inputID}, at index: ${index}`);
    if(index === null){ return; }
    this.deleteIndex(index);//
  }

  // Object Getters
  getObjectFromID(objectID) { return this.data[this.getIndexFromID(objectID)]; };
  getObjectFromIndex(index) { return this.data[index]; };
  getIndexFromID(inputID){
      if(inputID === null) { return null;}
      
      for(let i = 0; i < this.data.length; i++){
      if(this.data[i].ID === inputID) { return i;}
      }
      return null;
  };

  // Misc functions

  generateDefaultLayout(idGenerated){
      return {
      ID: idGenerated,
      layoutType: "Grid",
      iconSize: "1",
      display: true, // If it is not a leaf node, disable it
      gridData: {
          gridDimensions: null,
          contentAlign: "Compact",
          xAxisDirection: "Left",
          yAxisDirection: "Top"
      },
      ListData: {},
      };
  };

  // Setters

  setLayoutGrid(objectID){ this.getObjectFromID(objectID).layoutType = "Grid" };
  setLayoutList(objectID){ this.getObjectFromID(objectID).layoutType = "List" };

  modifyIconSize(objectID, newValue){ this.getObjectFromID(objectID).iconSize = newValue; };

  disableDisplay(objectID){ this.getObjectFromID(objectID).display = false; };
  enableDisplay(objectID){ this.getObjectFromID(objectID).display = true; };

  // Grid setters

  setGridDimension(objectID, val) { this.getObjectFromID(objectID).gridData.gridDimensions = val; };

  setGridAlignCompact(objectID) { this.getObjectFromID(objectID).gridData.contentAlign = "Compact" };
  setGridAlignFree(objectID) { this.getObjectFromID(objectID).gridData.contentAlign = "Free" };

  setXDirectionLeft(objectID) { this.getObjectFromID(objectID).gridData.xAxisDirection = "Left" };
  setXDirectionRight(objectID) { this.getObjectFromID(objectID).gridData.xAxisDirection = "Right" };

  setYDirectionTop(objectID) { this.getObjectFromID(objectID).gridData.yAxisDirection = "Top" };
  setYDirectionBottom(objectID) { this.getObjectFromID(objectID).gridData.yAxisDirection = "Bottom" };

  // Grid Getters

  getGridDimension(objectID) { return this.getObjectFromID(objectID).gridData.gridDimensions; };
  getGridAlign(objectID) { return this.getObjectFromID(objectID).gridData.contentAlign; };
  getXDirection(objectID) { return this.getObjectFromID(objectID).gridData.xAxisDirection; };
  getYDirection(objectID) { return this.getObjectFromID(objectID).gridData.yAxisDirection; };

}

const containerDataInstance = new containerDataClass;
export const containerData = reactive(containerDataInstance);