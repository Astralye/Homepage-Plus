export class ContainerDividerClass{
    static calculateMouseDifference(divisionType, dividerElement, mouseCoordinates, parentComponentData){
        // Absolute value need to convert to relative position

        let relMouseCoord   = { x: 0, y: 0 };
        let relDividerCoord = { x: 0, y: 0 };

        // Calculation values
        let dividerSize;
        let mousePos;
        let dividerCoord;

        relMouseCoord.x = mouseCoordinates.x - parentComponentData.x;
        relMouseCoord.y = mouseCoordinates.y - parentComponentData.y;

        relDividerCoord.x = dividerElement.x - parentComponentData.x;
        relDividerCoord.y = dividerElement.y - parentComponentData.y;

        // console.log(`Rel Mouse Coord: ${relMouseCoord.x}, ${relMouseCoord.y}`,
        //             `\nRel Divider Coord: ${relDividerCoord.x}, ${relDividerCoord.y}`);

        if(divisionType === "Vertical"){
            mousePos = relMouseCoord.x;
            dividerCoord = relDividerCoord.x;
            dividerSize = dividerElement.width / 2;
        }
        else{
            mousePos = relMouseCoord.y;
            dividerCoord = relDividerCoord.y;
            dividerSize = dividerElement.height / 2;
        }

        return mousePos - dividerCoord - dividerSize;
    }

    static calculateThreshold(layoutData, parentData, stepSize){
        let width;
        let height;
        let divisionStatement;

        let margin = 8;
        let thresholdOffset = -4; // Arbitrary number
        
        if(layoutData.id === "0A") {
            divisionStatement = layoutData.divisionType;

            width  = window.innerWidth  - ( 2 * margin);
            height = window.innerHeight - ( 2 * margin);
        }
        else{
            const parentComponent = parentData.m_ComponentData;
            divisionStatement     = parentData.m_LayoutData.divisionType;

            // Dimension without margin
            width  = parentComponent.width  - (2 * margin);
            height = parentComponent.height - (2 * margin);
        }

        // if vertical, use width,
        let container_px = (divisionStatement === "Vertical") ? width : height;
        
        let totalContainers = layoutData.siblings + 1;
        let pxPerFractionalUnit = container_px / totalContainers;
        let pxPerStep = pxPerFractionalUnit * stepSize;

        return ( pxPerStep + thresholdOffset );
    }

    static updateParentConfig(data, stepSize, columnData, rowData){
        let tmpString = "";
        let siblingIndex = data.index;
        let baseIndex = siblingIndex - 1;

        let arrayData = (data.type === "Vertical") ? ContainerDividerClass.getGridData(columnData) : ContainerDividerClass.getGridData(rowData);

        let siblingValue = arrayData[siblingIndex];
        let baseValue    = arrayData[baseIndex];

        // False -> Left or Down
        // True -> Right or Up
        if(data.direction){
            baseValue    -= stepSize;
            siblingValue += stepSize;
        }
        else{
            siblingValue -= stepSize;
            baseValue    += stepSize;
        }

        // Set back the values 
        arrayData[siblingIndex] = siblingValue;
        arrayData[baseIndex]    = baseValue;

        // Convert back to string.
        for(let i = 0; i < arrayData.length; i++){ tmpString += String(arrayData[i]) + "fr "; }

        return tmpString;
    }

    // Grid fr values
    static getGridData(data){
        let splitData = data.split(" ");
        let tmpArray = [];
        splitData.pop(); // Remove empty space
        splitData.forEach(string => { tmpArray.push(Number(string.substring(0,string.length-2))); });
        return tmpArray;
    }

    static movementData(parentObj, ID, isVertical, threshold, difference){

        let isMoveContainer = false;
        let isPositive = false;
        let siblingData = parentObj.childContainers;
        let siblingIndex;

        // Determines whether to run move function
        // isPositive = True -> Right or Up
        // isPositive = False -> Left or Down
        if(Math.abs(difference) >= threshold){
            isMoveContainer = true;
            if( difference < 0) { isPositive = true;}
        }

        // Find the adjacent sibling
        for(let i = 0; i < siblingData.length; i++){
            if(siblingData[i].id == ID){
                siblingIndex = i;
                break;
            }
        }

        // Horizontal divisions, Extra container removed is the start, count after
        if(!isVertical){ siblingIndex += 1;};

        // Data sent to parent
        let data = {
            index: siblingIndex,
            type: parentObj.divisionType,
            direction: isPositive
        };

        return { dataSend: data , moveContainer: isMoveContainer};
    }
};