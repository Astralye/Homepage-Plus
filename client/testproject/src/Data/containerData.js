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
class ContainerDataClass{
  constructor(){ this.resetData(); }
  get allData(){ return this.data; }

  printData() { console.log(`data:`, this.data); };

  // Basic array functions
  resetData() { this.data = [this.generateDefaultLayout("0A")]; };
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
          gridDimensions: "1,1",
          contentAlign: "Compact",
          xAxisDirection: "Left",
          yAxisDirection: "Top"
      },
      ListData: {},
      };
  };

  // Setters

  setLayoutGrid(objectID)         { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.layoutType = "Grid" }};
  setLayoutList(objectID)         { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.layoutType = "List" }};

  modifyIconSize(objectID, newValue){ let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.iconSize = newValue; }};

  disableDisplay(objectID)        { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.display = false; } };
  enableDisplay(objectID)         { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.display = true; } };
  // Grid setters

  setGridDimension(objectID, val) { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.gridData.gridDimensions = val; }};
  setGridAlignCompact(objectID)   { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.gridData.contentAlign = "Compact"}};
  setGridAlignFree(objectID)      { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.gridData.contentAlign = "Free"}};

  setXDirectionLeft(objectID)     { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.gridData.xAxisDirection = "Left"}};
  setXDirectionRight(objectID)    { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.gridData.xAxisDirection = "Right"} };

  setYDirectionTop(objectID)      { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.gridData.yAxisDirection = "Top"} };
  setYDirectionBottom(objectID)   { let obj = this.getObjectFromID(objectID); if(obj !== undefined){obj.gridData.yAxisDirection = "Bottom"} };

  // Grid Getters

  getLayoutType(objectID)   {let obj = this.getObjectFromID(objectID); if(obj !== undefined) { return obj.layoutType;} }
  getGridDimension(objectID){let obj = this.getObjectFromID(objectID); if(obj !== undefined) { return obj.gridData.gridDimensions; }};
  getGridAlign(objectID)    {let obj = this.getObjectFromID(objectID); if(obj !== undefined) { return obj.gridData.contentAlign; };}
  getXDirection(objectID)   {let obj = this.getObjectFromID(objectID); if(obj !== undefined) { return obj.gridData.xAxisDirection; };}
  getYDirection(objectID)   {let obj = this.getObjectFromID(objectID); if(obj !== undefined) { return obj.gridData.yAxisDirection; };}

}

const containerDataInstance = new ContainerDataClass;
export const containerData = reactive(containerDataInstance);