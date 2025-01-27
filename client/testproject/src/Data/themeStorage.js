import { reactive } from 'vue'
import { editVariables } from './SettingVariables';

// Requires the ability to save and delete the local storage.
// Better to have a shared object

export class ThemeStorage {
    constructor(){ this.resetData(); }

    resetData(){
        
        this.data = {
            
            displayArray: [
                {
                    name: "Default",
                    alias: "Default", // Value that is displayed
                    primary:   "#723d46",
                    secondary: "#472d30",
                    tertiary:  "#C9CBA3",
                },
                {
                    name: "Light",
                    alias: "Light", // Value that is displayed
                    primary:   "#EFF3EA",
                    secondary: "#EFF3EA",
                    tertiary:  "#123fab",
                },
                {
                    name: "Dark",
                    alias: "Dark", // Value that is displayed
                    primary:   "#000000",
                    secondary: "#14213d",
                    tertiary:  "#fca311",
                },
            ],
    
            importThemes: [],
            selectedTheme: "Default",

            // For non-user modifiable
            iconColour: "white",
        }
    }

// local storage
// ----------------------------------------------------------------------------------------

    // For deletion, -> reset data, update the theme
    resetLocalStorage(){
        this.resetData();

        // If no value, set to default
        this.data.selectedTheme = (this.data.selectedTheme) ? this.data.selectedTheme : "Default";
        
        this.changeSelected(this.data.selectedTheme);
    }

    // Get both import themes and selected themes
    initData(){

        this.data.displayArray = this.data.displayArray.concat(this.importThemeObj); // add to display themes

        // import selected Theme
        this.data.importThemes = this.importThemeObj; // in the event of adding more themes
        
        // Check if it exists before setting it
        this.data.selectedTheme = (this.storageSavedTheme) ? this.storageSavedTheme : "Default";

        this.resetTheme();
    }

    // They do not modify the values
    // Can remain in here rather than profileHandler.js

    storageObject(name){
        if(!name) return;
        return JSON.parse(localStorage.getItem("storageObject"))['storedProfiles'][name];
    }

    get storageSavedTheme(){

        // Change later
        let defaultVal = "defaultProfile"
        return this.storageObject(defaultVal)['savedTheme'];
    }

    get importThemeObj(){

        let defaultVal = "defaultProfile"
        return this.storageObject(defaultVal)['themeImports'];
    }

// object functions 
// -------------------------------------------------------------------------------

    get tertiary(){
        return this.getObject(this.data.selectedTheme).tertiary;
    }

    // For each colour
    setRGBValues(item, type, value){

        if(!item[type]) return;

        item[type] = value; // set value

        // update value
        this.changeSelected(item.name);
    }

    setImportThemes(data){

        this.data.displayArray = this.data.displayArray.concat(data.customThemes); // add to display themes
        this.data.selectedTheme = data.savedTheme;
    
        this.changeSelected(data.savedTheme);
    }

    // from name
    getObject(name){
        for(let i = 0; i < this.data.displayArray.length; i++){
            if(name == this.data.displayArray[i].name) return this.data.displayArray[i];
        }

        return null;
    }

    isSelected(name){ return (this.data.selectedTheme === name); }

    // Determine text colour based 
    getContrastYIQ(hexcolor){
        var r = parseInt(hexcolor.substring(1,3),16);
        var g = parseInt(hexcolor.substring(3,5),16);
        var b = parseInt(hexcolor.substring(5,7),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? 'black' : 'white';
    }

    clickChange(name){
        this.data.selectedTheme = name;
        this.changeSelected(name);
    }

    resetColour(){
        this.changeSelected(this.selectedTheme);
    }

    updateTextHeaderColour(colour){
        document.documentElement.style.setProperty("--Header-colour", colour );
    }

    updateTextColour(colour){
        document.documentElement.style.setProperty("--Theme-c-dark-2", colour );
    }

    changeSelected(name){

        let object = this.getObject(name);
        if(!object) return; // no data

        document.documentElement.style.setProperty("--ThemeA-Primary",   object.primary);
        document.documentElement.style.setProperty("--ThemeA-Secondary", object.secondary);
        document.documentElement.style.setProperty("--ThemeA-Accent",    object.tertiary);

        // Adjust text colour on theme change
        // Only when there isnt override
        if(!editVariables.appearanceFont.isOverrideAutoColour){
            this.updateTextColour(this.getContrastYIQ(object.secondary));
        }

        // If not override
        if(!editVariables.appearanceHeader.font.isOverrideAutoColour){
            this.updateTextHeaderColour(this.getContrastYIQ(object.secondary));
        }

        document.documentElement.style.setProperty("--box-shadow", `0 0 2px ${object.tertiary}`);

        // high contrast values like icon or texts
        this.data.iconColour = this.getContrastYIQ(object.secondary);
    }
    
    // Pass in float, between 0 and 1
    getIconColourOpacity(floatVal){ 
        
        let object = this.getObject(this.data.selectedTheme);
        // console.log(this.data.selectedTheme)
        if(!object) return; // no data


        // Would need to use an rgba value instead    
        return (this.getContrastYIQ(object.secondary) === "black") ? `rgba(0, 0, 0, ${floatVal})` : `rgba(255, 255, 255, ${floatVal})`;
    }


// Objects and colours
// ---------------------------------------------------------------------------------------------

    themeConstructor(inputName, aliasName, inputPrim, inputSec, inputTert){
        return {
            name:      inputName,
            alias:     aliasName,
            primary:   inputPrim,
            secondary: inputSec,
            tertiary:  inputTert,
        }
    }

    // Reset to the value stored in localstorage
    resetTheme(){
        if(!this.storageSavedTheme) return;
        
        this.data.selectedTheme = this.storageSavedTheme;
        this.changeSelected(this.storageSavedTheme);
    }
    
    // Generates a 4 digit Hex id: XXXX
    genID(){
        var id;
        do{ id = (Math.random().toString(16).slice(12)); }
        while( this.doesIDExist(id)); // If icon exists, run again
        return id;
    }

    doesIDExist(id){
        for(let i = 0; i < this.storedThemes.length; i++){
            if(this.storedThemes[i].name == id) return true;
        }
        return false;
    }

    addTheme(){

        let name = this.genID(); // random generated name
        let alias = `Theme ${this.storedThemes.length}`;

        let prim = "#F0C1E1";
        let sec =  "#CB9DF0";
        let tert = "#FFF9BF";

        this.data.displayArray.push(this.themeConstructor(name, alias, prim, sec, tert));
    }
    
    // From array, not local storage.
    deleteTheme(){
        for(let i = 0; i < this.data.displayArray.length; i++){
            if(this.data.selectedTheme == this.data.displayArray[i].name){
                this.data.displayArray.splice(i, 1);
                this.resetTheme();
                return;
            } 
        }
    }
    
    get storedThemes(){ return this.data.displayArray; }
    get importThemes(){ return this.data.importThemes; }

    get highContrastColour(){ return this.data.iconColour; }
    get selectedTheme(){ return this.data.selectedTheme; }
}

const themeStorageInstance = new ThemeStorage;
 
export const themeStorage = reactive(themeStorageInstance);