import { reactive } from "vue";

class IconData{
    constructor(){ this.resetData(); };
    get allData(){ return this.data; };

    printData(){ console.log(`data:`, this.data); };
    initializeData(importData){ this.data = importData; }

    resetData(){
        this.data = [{
            // An icon can be stored in different locations depending on the saved dimension
            // If free, use these, if compact, store index.
            positions: [{
                savedDimension: {
                    rows: null,
                    columns: null
                },
                coordinate:{
                    x: null,
                    y: null,
                }
            }],
            index: 0, // For compact data. Should update when drag and dropping.
            iconSize: 1,
            iconImage: null,
            iconName: "",
        }]
    }
};

const iconDataInstance = new IconData;
export const iconData = reactive(iconDataInstance);