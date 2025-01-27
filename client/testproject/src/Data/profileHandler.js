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
       
        this.storageObject = "storageObject",

        this.localStorageVarNames = {
            layoutDataName: "layoutData",
            displayData: "containerDisplayData",
            iconData: "iconData",
            iconStorage: "iconStorage",
            
            userSettings: "userSettings",
            savedTheme: 'savedTheme',
            importSVGs: 'importSVGs',
            userAppearanceSettings: 'userAppearanceSettings',

            themeImports: "themeImports"
        }
    }

    // On creation
    // Ideally this should only run once.
    newData(){

        /*
            Currently an object.
            Data to be stored.

            Since it requires the actual object data, it will be null when resetted
            but needs to be initialized.
        */
        this.data = {
            
            // The storage of all the data
            storedProfiles: {
                    defaultProfile: {
                        layout: null, // How the page is displayed
                        container: null, // Data for each container
                        iconStorage: null, // Where icons are located
            
                        iconData: null,
                        importSVGs: null,
                        userSettings: null,
                        userAppearanceSettings: null, 
            
                        savedTheme: null,
                        themeImports: null,
                    },
            },

            // Know which profile to load and save to.
            selectedProfile: "defaultProfile",
        }
    }

    // All but the default profile
    initLoadProfiles(data){
        if(!data) return;
        // Need a way to remove the default profile before adding?
        // Or maybe it doesnt matter because I am overriding

        this.data.storedProfiles = data;
    }

// localStorage

    // Save the entire object
    saveDataToLocalStorage(){ localStorage.setItem(this.storageObject, JSON.stringify(this.data)); }

// Themes



    // Assuming iconSize is a square
    saveTheme(){

        // Get the profile first
        // Save to the profile
        // Then set the data
        
        let profile = this.getProfileData(this.selectedProfile);
        if(!profile) return 0; // no data
        
        this.setThemes(profile);

        // any changes in data are saved to localStorage
        this.saveDataToLocalStorage();
    }

/*
    Taken from Storage.vue to standardize the saving process instead of within the component.

    These will have to be modified later, but for now will just be a placeholder

    should also rename them.
*/

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
    
    // Load data from local storage to this.data 
    // Return value is used to confirm saving values
    initProfileData(){
        const allProfileData = this.localStorageProfileData;

        if(!allProfileData) return 0;
    
        this.setSelectedProfile(allProfileData.selectedProfile); // Set selected profile 
        this.initLoadProfiles(allProfileData.storedProfiles);    // Set all profiles 

        return 1;
    }

    setThemes(profile){
        // Assuming profile has already been typed checked

        profile.savedTheme = themeStorage.selectedTheme;

        let size = themeStorage.storedThemes.length;

        // Any new themes added
        // length would be 4+
        if(size <= 3) return; 
        
        let newObjects = themeStorage.storedThemes.slice(3, size);

        profile.themeImports = newObjects;
    }

    // Uses the stored selected profile to set the values
    // Return value is used to confirm saving values
    setProfileData(){
        
        let profile = this.getProfileData(this.selectedProfile);
        if(!profile) return 0; // no data
        
        // Set all the data
        profile.layout = layout.allData; // How the page is displayed
        profile.container = containerData.allData; // Data for each container
        profile.iconStorage = iconStorage.allData; // Where icons are located
        profile.iconData = iconData.allData;
        profile.importSVGs = Array.from(iconImageStorage.importedSVGs.entries());
        profile.userSettings = editVariables.userSettings;
        profile.userAppearanceSettings = editVariables.userAppearanceSettings;

        this.setThemes(profile);

        return 1;
    }


    /*
        The values all need to move to the object.
        The object within the array will then be saved
        We need to know the name of the object before manipulating it
    */
    setValues(){

        if(!this.setProfileData()) return // Check for data

        this.saveDataToLocalStorage();
    }

    // load from localStorage
    loadProfileData(){


        // Needs to pass the data from the localStorage and then load it to the initializers
        // Needs the profile data first
        
        // If no data in localStorage
        if(!this.initProfileData()){
            this.setValues(); // Create data first.
            return;
        }
        
        let profile = this.getProfileData(this.selectedProfile);
        if(!profile) return; // no data

        // Run the respective function if contain the data within local storage

        if(profile.layout  !== null) layout.initializeData(profile.layout);
        if(profile.container !== null) containerData.intializeData(profile.container); 
        if(profile.iconData !== null)    iconData.initializeData(profile.iconData);

        if(profile.iconStorage !== null) iconStorage.initDataFromStorage(profile.iconStorage);

        if(profile.importSVGs !== null) iconImageStorage.setImportedSVGs(profile.importSVGs);

        if(profile.userSettings !== null)    editVariables.loadUserSettings(profile.userSettings);

        if(profile.themeStorage !== null)    themeStorage.initData();

        if(profile.userAppearanceSettings !== null)  editVariables.loadUserAppearance(profile.userAppearanceSettings);

        editVariables.enableRenderFinalNode();
    }

    get localStorageProfileData(){ 
        
        let storedObj = localStorage.getItem(this.storageObject);
        if(!storedObj) return null;

        return JSON.parse(storedObj); }

// Basic functions

    // By name
    getProfileData(name){
        if(!name) return;

        let data = this.data.storedProfiles[name];
        return data; // If not found, should return null
    }

    // By name
    deleteProfile(name){
        
        if(!name) return; // no value parameter

        let data = this.data.storedProfiles[name];
        if(!data) return; // no data

        delete this.data.storedProfiles[name];

        // for(let i = 0; i < this.data.storedProfiles.length; i++){
        //     // If found, remove
        //     if(this.data.storedProfiles[i][name]) {
        //         this.data.storedProfiles[i].splice(index, 1)
        //         return;
        //     }
        // }
    }
    
    // By name
    addProfile(name, data){
        if(!data) return;

        // Need to check if name already exists

        this.data.storedProfiles[name] = data;
    }

    // Rename the object key
    renameProfile(oldName, newName){

        if(!oldName || !newName) return; // no value parameter

        let data = this.data.storedProfiles[oldName];
        if(!data) return; // no data

        delete Object.assign(this.data.storedProfiles, {[newName]: this.data.storedProfiles[oldName] })[oldName];
        
        
        // for(let i = 0; i < this.data.storedProfiles.length; i++){
        //     if(this.data.storedProfiles[i][oldName]){ // if the name exist, return
        //         delete Object.assign(this.data, {[newName]: this.data[oldName] })[oldName];
        //     }
        // }
    }
    
    setSelectedProfile(val){ this.data.selectedProfile = val; }

    get selectedProfile(){ return this.data.selectedProfile; }
}

const profileHandlerInstance = new ProfileHandler;
export const profileHandler = reactive(profileHandlerInstance);