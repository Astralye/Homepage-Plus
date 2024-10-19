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
        if (this.data.length === this.maxSize){  this.data.pop(); }
        // Add to front
        if(!this.isColourExist(item)){this.data.unshift(item);}
    }

    // Returns only the valid index.
    getColour(index){
        return (index < 0 || index > this.maxSize || index > this.data.length) ? null : this.data[index];
    }

    isColourExist(newHex){
        for(let i=0; i< this.data.length; i++){
            if(this.data[i] === newHex){ return true; }
        }
        return false;
    }
}

const colourQueueInstance = new ColourStorage;

export const colourQueue = reactive(colourQueueInstance);