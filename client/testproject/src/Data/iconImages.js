import { reactive } from 'vue'

/*
    This file is just for storing all the icon SVG data.
    This file is responsible for rendering the SVG and path data ONLY
    This would contain the Vector path of the corresponding values

    Refer to IconData.js of user based manipulation of grid list and icon data container layouts.

    'pathData' refers to the 'd' tag on the <path> element.
    it specifies the math to draw the icon.

    The icons for the social media used were from

    https://icons8.com/icon/set/logos/windows

    These icons have a specific SVG viewbox, shown on SVGHandler.vue
    Any new icons outside of this pack, will require some form of handling to ensure it has the right data going in.

*/
class IconImages{
    constructor(){ this.baseData(); }
    get allData(){ return this.data; }
    
    baseData(){
        this.data = [
            {
                name: "Github",
                pathData: 'M 16 4 C 9.371094 4 4 9.371094 4 16 C 4 21.300781 7.4375 25.800781 12.207031 27.386719 C 12.808594 27.496094 13.027344 27.128906 13.027344 26.808594 C 13.027344 26.523438 13.015625 25.769531 13.011719 24.769531 C 9.671875 25.492188 8.96875 23.160156 8.96875 23.160156 C 8.421875 21.773438 7.636719 21.402344 7.636719 21.402344 C 6.546875 20.660156 7.71875 20.675781 7.71875 20.675781 C 8.921875 20.761719 9.554688 21.910156 9.554688 21.910156 C 10.625 23.746094 12.363281 23.214844 13.046875 22.910156 C 13.15625 22.132813 13.46875 21.605469 13.808594 21.304688 C 11.144531 21.003906 8.34375 19.972656 8.34375 15.375 C 8.34375 14.0625 8.8125 12.992188 9.578125 12.152344 C 9.457031 11.851563 9.042969 10.628906 9.695313 8.976563 C 9.695313 8.976563 10.703125 8.65625 12.996094 10.207031 C 13.953125 9.941406 14.980469 9.808594 16 9.804688 C 17.019531 9.808594 18.046875 9.941406 19.003906 10.207031 C 21.296875 8.65625 22.300781 8.976563 22.300781 8.976563 C 22.957031 10.628906 22.546875 11.851563 22.421875 12.152344 C 23.191406 12.992188 23.652344 14.0625 23.652344 15.375 C 23.652344 19.984375 20.847656 20.996094 18.175781 21.296875 C 18.605469 21.664063 18.988281 22.398438 18.988281 23.515625 C 18.988281 25.121094 18.976563 26.414063 18.976563 26.808594 C 18.976563 27.128906 19.191406 27.503906 19.800781 27.386719 C 24.566406 25.796875 28 21.300781 28 16 C 28 9.371094 22.628906 4 16 4 Z'
            },
            {
                name: "Amazon",
                pathData: 'M16.2,4c-3.3,0-6.9,1.2-7.7,5.3C8.4,9.7,8.7,10,9,10l3.3,0.3c0.3,0,0.6-0.3,0.6-0.6c0.3-1.4,1.5-2.1,2.8-2.1c0.7,0,1.5,0.3,1.9,0.9c0.5,0.7,0.4,1.7,0.4,2.5v0.5c-2,0.2-4.6,0.4-6.5,1.2c-2.2,0.9-3.7,2.8-3.7,5.7c0,3.6,2.3,5.4,5.2,5.4c2.5,0,3.8-0.6,5.7-2.5c0.6,0.9,0.9,1.4,2,2.3c0.3,0.1,0.6,0.1,0.8-0.1v0c0.7-0.6,2-1.7,2.7-2.3c0.3-0.2,0.2-0.6,0-0.9c-0.6-0.9-1.3-1.6-1.3-3.2v-5.4c0-2.3,0.2-4.4-1.5-6C20.1,4.4,17.9,4,16.2,4z M17.1,14.3c0.3,0,0.6,0,0.9,0v0.8c0,1.3,0.1,2.5-0.6,3.7c-0.5,1-1.4,1.6-2.4,1.6c-1.3,0-2.1-1-2.1-2.5C12.9,15.2,14.9,14.5,17.1,14.3z M26.7,22.4c-0.9,0-1.9,0.2-2.7,0.8c-0.2,0.2-0.2,0.4,0.1,0.4c0.9-0.1,2.8-0.4,3.2,0.1s-0.4,2.3-0.7,3.1c-0.1,0.2,0.1,0.3,0.3,0.2c1.5-1.2,1.9-3.8,1.6-4.2C28.3,22.5,27.6,22.4,26.7,22.4z M3.7,22.8c-0.2,0-0.3,0.3-0.1,0.4c3.3,3,7.6,4.7,12.4,4.7c3.4,0,7.4-1.1,10.2-3.1c0.5-0.3,0.1-0.9-0.4-0.7c-3.1,1.3-6.4,1.9-9.5,1.9c-4.5,0-8.8-1.2-12.4-3.3C3.8,22.9,3.7,22.8,3.7,22.8z'
            },
            
        ]
    }

// Get path data
// --------------------------------------------------------------------------------------------------------------------------

    getPathFromIndex(index){
        if(!this.isValidIndex(index)){ return null; }
        return this.data[index];
    }

    isValidIndex(index){
        return (index <= (this.data.length-1) && index >= 0)
    }

    getPathData(inputName){
        for(let i=0; i<this.data.length; i++){ if(this.data[i].name === inputName){ return this.data[i].pathData; } }

        // If not found
        console.error(`Error iconImages.js: ${inputName} does not exist within the array`);
        return null;
    }


// Modifiers
// ---------------------------------------------------------------------------------------------------------------------------

    changeName(oldName, newName){
        for(let i=0; i<this.data.length; i++){ if(this.data[i].name === oldName){ this.data[i].name = newName; return; } };
        console.error(`Error iconImages.js: ${inputName} does not exist within the array`);
    }

    newSVGObject(objName, data){
        this.data.push({
            name: objName,
            pathData: data
        });
    }

    // Extracts only the 'd' part of the tag.
    svgParser(svgString){
        
    }

}

const iconImageInstance = new IconImages;
 
export const iconImageStorage = reactive(iconImageInstance);