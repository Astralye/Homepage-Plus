import { reactive } from 'vue'

// 'export' ing the class allows use of static variables.
export class LayoutDataClass{
    constructor(){ this.data = {

        // Container metadata
        level: 0,
        divisionType: "Vertical",
        id: "0A",
        NoChildren: 0,
        siblings: 0,
        evenSplit: true,
        unevenFRData: "",
    
        // Child container
        childContainers: [
        ],
    }}
    get allData() { return this.data; }

    
// Static Methods
// -----------------------------------------------------------------------------------------------------
    // Tree algorithms

    // Depth-first search recurrsion function
    // Finds the corresponding data from the level and ID
    static getLevelData(currentLevelData, Level, ID){
        
        // Input level is the current level data
        if(Level == currentLevelData.level){
            // console.log("Item found at current level:", currentLevelData.level, Level );
            return currentLevelData;
        }

        // Retrieve child data
        var childData = currentLevelData.childContainers; // if no children, move up stack.
        if(childData.length === 0 ) return null; 
        // console.log("current Level: ", currentLevelData.level, "Looking for ID:",ID);
        
        // Looks at children
        for(let i = 0; i < childData.length; i++){
            let item = childData[i];
            // console.log("Looking at:", item.id);

            // Base case (Found item)
            if(item.id == ID){ return item; }

            // Base case (Nothing found and no siblings)
            else if(item.NoChildren === 0 && childData.length <= 1) { return null; }
            
            // Base case (Has children)
            else{
                var tmp = LayoutDataClass.getLevelData(item, Level + 1, ID);
                // If any item is found, return up stack.
                if(tmp !== null){ return tmp; }
            }
        }
        return null; // Not found in children, move up stack.
    };

    // Check if the child is the last container in the tree
    static isFinalNode(parentObject, childID){
        if( parentObject.NoChildren === 0 ) { return false; } // if no children;

        let lastChild = parentObject.childContainers[ parentObject.childContainers.length - 1];
        let count = 0;
        while(true){
            if(lastChild.childContainers.length !== 0){
                lastChild = lastChild.childContainers[lastChild.childContainers.length - 1];
                count++;
                if(count === 100) { break; } // Avoid a potential infinite loop
                continue;
            }
            break;
        }
        return (lastChild.id === childID) ? true : false;
    };

    static isLeafNode(layoutData){ return layoutData.NoChildren === 0 ? true : false; };

// Object Generation

    // Generate new child ID from the index and parent level
    static generateID(level, index){ return `${level}`.concat(String.fromCharCode(64 + 1 + index)); };

    static generateChildObject(inp_level, inp_div, inp_id, inp_siblings){

        // If any of the values are null,
        if(inp_level === null || inp_div === null || inp_id === null || inp_siblings === null){
            var word;
            [inp_level, inp_div, inp_id, inp_siblings].forEach(element => {
                if(element === null){ word += `${Object.keys(element)[0]}, `};
            });
            console.warn(`Error layoutData.js: ${type} is null`);
            return;
        }
        
        return {
            level: inp_level,
            divisionType: inp_div,
            id: inp_id,
            NoChildren: 0,
            siblings: inp_siblings,
            evenSplit: true,
            unevenFRData: "",
            childContainers: []
        };
    }

    // Sibling identifier, A,B,C,D
    static getSiblingNumber(id){
        let LastValue = id.substring(id.length - 1).toLowerCase();
        return LastValue.charCodeAt(0) - 97;
    };

    static getParentObj(containerData){
        let parentID = containerData.id.substring(0, containerData.id.length - 2);
        return LayoutDataClass.getLevelData(layout.allData, containerData.level - 1, parentID);
    }

    static isFirstSibling(id){ return (LayoutDataClass.getSiblingNumber(id) === 0) };
    static isLastSibling(containerData){ return (LayoutDataClass.getSiblingNumber(containerData.id) === LayoutDataClass.getParentObj(containerData).NoChildren - 1) };
    static isBaseContainer(id){ return id === "0A" };
    static isExtraContainer(containerData, verticalData){ return !verticalData ? !LayoutDataClass.isLastSibling(containerData) : !LayoutDataClass.isFirstSibling(containerData.id); }


// ---------------------------------------------------------------------------------------------------------------------------

// Instance methods
// --------------------------------------------------------------------------------------------------------------------------

    // Load data from localStorage
    initializeData(importData){ this.data = importData; };

    // Reset data on deletion
    resetData(){
        this.data = {
            level: 0,
            divisionType: "Vertical",
            id: "0A",
            NoChildren: 0,
            siblings: 0,
            evenSplit: "true",
            unevenFRData: "",
            childContainers: []
        };
    };

    // Add or remove children depending on the number of divisions
    modifyContainer(divisions, level, id){
        // Container data

        const current_containerLevel = level;
        const current_containerID = id;
        const childLevel = current_containerLevel + 1;
        const noSiblings = ( divisions - 1 > 0) ? divisions - 1 : 0; // remove 1 if not 0 

        let container = LayoutDataClass.getLevelData(this.data, current_containerLevel, current_containerID);
        let difference = divisions - container.NoChildren;

        // Positive, add container, negative remove container
        (difference > 0) ? LayoutDataClass.addNChildren(container, divisions, childLevel, current_containerID, noSiblings) : LayoutDataClass.removeNChildren(container, difference);
        
        // Update sibling value
        container.childContainers.forEach( (data) => { data.siblings = noSiblings;});
    };

    // Remove child

    static removeNChildren(parentContainer, noRemoved){
        noRemoved = Math.abs(noRemoved);
        parentContainer.NoChildren -= noRemoved;
        for(let i = 0; i < noRemoved; i++){ parentContainer.childContainers.pop(); }
    }

    static addNChildren(parentContainer, divisions, childLevel, containerID, noSiblings){
        var latestIndex;
        const divType = "Vertical"; // Default value of children

        parentContainer.NoChildren = divisions; // Stores the last current index of the siblings
        parentContainer.childContainers.forEach( (cont,index) => { latestIndex = index; });

        for(let i = 0; i < divisions; i++){
            if(i < latestIndex+1){ continue; } // If the current index is not the last available

            let newID = containerID + LayoutDataClass.generateID(childLevel, i);
            parentContainer.childContainers.push(LayoutDataClass.generateChildObject(childLevel, divType, newID, noSiblings));
        }
    }
}

// Place of data storage.
const LayoutDataInstance = new LayoutDataClass;
export const layout = reactive(LayoutDataInstance);