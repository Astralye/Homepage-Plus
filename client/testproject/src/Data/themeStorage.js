import { reactive } from 'vue'

// Requires the ability to save and delete the local storage.
// Better to have a shared object

export class ThemeStorage {
    constructor(){ this.resetData(); }

    resetData(){
        
        this.data = {
            // use string var to avoid potential mistypes
            localStorageVar: {
                saved: "savedTheme",
                imports: "customThemes"
            },
    
            displayArray: [
                {
                    name: "Default",
                    primary:   "#723d46",
                    secondary: "#472d30",
                    tertiary:  "#C9CBA3",
                },
                {
                    name: "Light",
                    primary:   "#EFF3EA",
                    secondary: "#EFF3EA",
                    tertiary:  "#123fab",
                },
                {
                    name: "Dark",
                    primary:   "#000000",
                    secondary: "#14213d",
                    tertiary:  "#fca311",
                },
                // {
                //     name: "abc",
                //     primary: "#F0C1E1",
                //     secondary: "#CB9DF0",
                //     tertiary: "#FFF9BF",
                // },
            ],
    
            importThemes: [],
            selectedtheme: "Default"
        }
    }

// local storage
// ----------------------------------------------------------------------------------------

    // For deletion, -> reset data, set local storage, update the theme
    resetLocalStorage(){
        this.resetData();

        // If no value, set to default
        this.data.selectedtheme = (this.data.selectedtheme) ? this.data.selectedtheme : "Default";

        localStorage.setItem(this.data.localStorageVar.saved,    JSON.stringify(this.data.selectedtheme));
        localStorage.setItem(this.data.localStorageVar.imports,  JSON.stringify(this.data.importThemes));

        this.changeSelected(this.data.selectedtheme);
    }

    // Get both import themes and selected themes
    initData(){
        this.data.displayArray = this.data.displayArray.concat(this.importThemeObj); // add to display themes

        this.data.importThemes = this.importThemeObj; // in the event of adding more themes
        this.data.selectedtheme = this.savedThemeObj.name; // import selected Theme
    
        this.resetTheme();
    }

    // Assuming iconSize is a square
    save(){
        // Selected Theme
        localStorage.setItem(this.data.localStorageVar.saved,  JSON.stringify(this.getObject(this.data.selectedtheme)));

        let size = this.data.displayArray.length;

        // Any new themes added
        // length would be 4+
        if(size <= 3) return; 
        
        let newObjects = this.data.displayArray.slice(3, size);
        localStorage.setItem(this.data.localStorageVar.imports,  JSON.stringify(newObjects));
        
    }

    get savedThemeObj(){
        return JSON.parse(localStorage.getItem(this.data.localStorageVar.saved));
    }

    get importThemeObj(){
        return JSON.parse(localStorage.getItem(this.data.localStorageVar.imports));
    }

// object functions 
// -------------------------------------------------------------------------------

    // from name
    getObject(name){
        for(let i = 0; i < this.data.displayArray.length; i++){
            if(name == this.data.displayArray[i].name) return this.data.displayArray[i];
        }

        return null;
    }

    isSelected(name){ return (this.data.selectedtheme === name); }

    // Determine text colour based 
    getContrastYIQ(hexcolor){
        var r = parseInt(hexcolor.substring(1,3),16);
        var g = parseInt(hexcolor.substring(3,5),16);
        var b = parseInt(hexcolor.substring(5,7),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? 'black' : 'white';
    }


    changeSelected(name){
        this.data.selectedtheme = name;

        let object = this.getObject(name);
        if(!object) return; // no data

        document.documentElement.style.setProperty("--ThemeA-Primary",   object.primary);
        document.documentElement.style.setProperty("--ThemeA-Secondary", object.secondary);
        document.documentElement.style.setProperty("--ThemeA-Accent",    object.tertiary);

        // Adjust text colour
        document.documentElement.style.setProperty("--Theme-c-dark-2",    this.getContrastYIQ(object.secondary));
        document.documentElement.style.setProperty("--box-shadow", `0 0 2px ${object.tertiary}`);
    }

// Objects and colours
// ---------------------------------------------------------------------------------------------

    themeConstructor(inputName, inputPrim, inputSec, inputTert){
        return {
            name:      inputName,
            primary:   inputPrim,
            secondary: inputSec,
            tertiary:  inputTert,
        }
    }

    // Reset to the value stored in localstorage
    resetTheme(){ this.changeSelected(this.savedThemeObj.name); }
    
    addTheme(){

        let name = "test";
        let prim = "#F0C1E1";
        let sec =  "#CB9DF0";
        let tert = "#FFF9BF";

        this.data.displayArray.push(this.themeConstructor(name, prim, sec, tert));
    }
    
    // From array, not local storage.
    deleteTheme(){
        for(let i = 0; i < this.data.displayArray.length; i++){
            if(this.data.selectedtheme.name == this.data.displayArray[i].name){
                this.data.displayArray.splice(i, 1);
                this.resetTheme();
                return;
            } 
        }
    }
    
    get storedThemes(){ return this.data.displayArray; }
    get importThemes(){ return this.data.importThemes; }

    get savedTheme(){ return this.data.localStorageVar.saved; }
    get imports()   { return this.data.localStorageVar.imports; }
}

const themeStorageInstance = new ThemeStorage;
 
export const themeStorage = reactive(themeStorageInstance);