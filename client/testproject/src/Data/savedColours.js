import { reactive } from "vue";

/*
    Queue based system
    Stores Hex Strings.
*/
class ColourStorage{
    constructor(){this.resetData(); }
    get allData(){ return this.data; }
    get size()   { return this.maxSize;}
    
    resetData(){ 
        this.data = [];
        this.maxSize = 10;
    }

    addData(item){
        // Removes from the back.
        if (this.data.length === this.maxSize){  this.data.pop(); console.log(this.data.length) }
        this.data.unshift(item); // Add to front
    }

    // Returns only the valid index.
    getColour(index){
        return (index < 0 || index > this.maxSize || index > this.data.length) ? null : this.data[index];
    }
}

const colourQueueInstance = new ColourStorage;

export const colourQueue = reactive(colourQueueInstance);