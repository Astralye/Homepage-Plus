import { reactive } from 'vue'

// js files that contain data to be saved to and resetted from
import { layout } from './layoutData';
import { containerData } from './containerData';
import { iconStorage } from './iconData';
import { iconData } from './iconData';
import { iconImageStorage } from './iconImages';
import { editVariables } from './SettingVariables';
import { themeStorage } from './themeStorage';

class ProfileHandler{
    constructor(){
        this.newData();

        /*
            variable names to find the data from local storage
            These objects would be used after the profile object has been
            taken
        */
        this.localStorageVarNames = {
            layoutDataName: "layoutData",
            displayData: "containerDisplayData",
            iconData: "iconData",
            iconStorage: "iconStorage",
            
            userSettings: "userSettings",
            savedTheme: 'savedTheme',
            importSVGs: 'importSVGs',
            userAppearanceSettings: 'userAppearanceSettings',

            imports: "customThemes"
        }
    }

    /*
        Data stored will be an: Array
        Storing profile: Objects

        Each object will store the properties
    */


    // On creation
    // Ideally this should only run once.
    newData(){

        // Currently an object.
        // Data to be stored.
        this.data = [
            {
                defaultProfile: {
                    test: "abc"
                }
            },

        ]
    }

// localStorage


    saveDataToLocalStorage(){

    }

// Themes

    // Assuming iconSize is a square
    saveTheme(){
        // Selected Theme
        localStorage.setItem(this.localStorageVarNames.savedTheme,    JSON.stringify(themeStorage.selectedTheme));

        let size = themeStorage.storedThemes.length;

        // Any new themes added
        // length would be 4+
        if(size <= 3) return; 
        
        let newObjects = themeStorage.storedThemes.slice(3, size);
        localStorage.setItem(this.localStorageVarNames.imports,  JSON.stringify(newObjects));
    }

/*
    Taken from Storage.vue to standardize the saving process instead of within the component.

    These will have to be modified later, but for now will just be a placeholder

    should also rename them.
*/

    // It is enabled for 1 tick to trigger the watchers
    resetFlag(){
        editVariables.enableResetFlag();
        this.$nextTick(() => editVariables.disableResetFlag() ); 

        // Reset selected
        editVariables.enableResetSelect();
    }

    // Runs all the resetters for the objects
    resetData(){
        layout.resetData();
        iconData.resetData();
        iconStorage.resetData();
        containerData.resetData();
        themeStorage.resetLocalStorage();
        
        iconImageStorage.resetImports();
        editVariables.resetAppearance();
        
        profileHandler.setValues(); // Re-sets all the values in the array
    }

    setValues(){
        localStorage.setItem(this.localStorageVarNames.layoutDataName, JSON.stringify(layout.allData));
        localStorage.setItem(this.localStorageVarNames.displayData,    JSON.stringify(containerData.allData));
        localStorage.setItem(this.localStorageVarNames.iconStorage,    JSON.stringify(iconStorage.allData));
        localStorage.setItem(this.localStorageVarNames.iconData,       JSON.stringify(iconData.allData));

        localStorage.setItem(this.localStorageVarNames.importSVGs,     JSON.stringify(Array.from(iconImageStorage.importedSVGs.entries())));
        localStorage.setItem(this.localStorageVarNames.userSettings,   JSON.stringify(editVariables.userSettings));
        
        // Appearance settings
        localStorage.setItem(this.localStorageVarNames.userAppearanceSettings,   JSON.stringify(editVariables.userAppearanceSettings));

        // Themes
        localStorage.setItem(this.data.localStorageVar.savedTheme,    JSON.stringify(themeStorage.selectedTheme));
        localStorage.setItem(this.data.localStorageVar.imports,       JSON.stringify(themeStorage.importThemes));

    }

    // Currently this stores the data 
    loadData(){

        const layoutData  = JSON.parse(localStorage.getItem(this.localStorageVarNames.layoutDataName));
        const displayData = JSON.parse(localStorage.getItem(this.localStorageVarNames.displayData));
        const dataIcon    = JSON.parse(localStorage.getItem(this.localStorageVarNames.iconData));
        const storageData = JSON.parse(localStorage.getItem(this.localStorageVarNames.iconStorage));

        const userData    = JSON.parse(localStorage.getItem(this.localStorageVarNames.userSettings));
        const importIcons = JSON.parse(localStorage.getItem(this.localStorageVarNames.importSVGs));
        const theme = localStorage.getItem(this.localStorageVarNames.savedTheme);

        const appearanceData = JSON.parse(localStorage.getItem(this.localStorageVarNames.userAppearanceSettings));

        // Run the respective function if contain the data within local storage

        if(layoutData  !== null) layout.initializeData(layoutData);
        if(displayData !== null) containerData.intializeData(displayData); 
        if(dataIcon !== null)    iconData.initializeData(dataIcon);

        if(storageData !== null) iconStorage.initDataFromStorage(storageData);

        if(importIcons !== null) iconImageStorage.setImportedSVGs(importIcons);

        if(userData !== null)    editVariables.loadUserSettings(userData);

        if(theme !== null)       themeStorage.initData();

        if(appearanceData !== null)  editVariables.loadUserAppearance(appearanceData);


        editVariables.enableRenderFinalNode();
    }

// Basic functions

    // By name
    getProfile(name){
        if(!name) return;

        for(let i = 0; i < this.data.length; i++){
            if(this.data[i][name]){ // if the name exist, return
                return this.data[i];
            }
        }

        // none found
        return null;
    }

    // By name
    deleteProfile(name){
        
        if(!name) return;

        for(let i = 0; i < this.data.length; i++){
            if(this.data[i][name]){ // if the name exist, return
                this.data[i].splice(index, 1); // 2nd parameter means remove one item only
            }
        }
    }
    
    // By name
    addProfile(data){
        if(!data) return;
        this.data.push(data);
    }

    // Rename the object key
    renameProfile(oldName, newName){
        for(let i = 0; i < this.data.length; i++){
            if(this.data[i][oldName]){ // if the name exist, return
                delete Object.assign(this.data, {[newName]: this.data[oldName] })[oldName];
            }
        }
    }
    
}

const profileHandlerInstance = new ProfileHandler;
export const profileHandler = reactive(profileHandlerInstance);