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
        
        /*
            variable names to find the data from local storage
            These objects would be used after the profile object has been
            taken
        */
    
        this.storageObject = "storageObject",

        this.localStorageVarNames = {
            layoutData: "layoutData",
            containerDisplayData: "containerDisplayData",
            iconData: "iconData",
            iconStorage: "iconStorage",
            
            userSettings: "userSettings",
            importSVGs: 'importSVGs',
            userAppearanceSettings: 'userAppearanceSettings',
            
            savedTheme: 'savedTheme',
            themeImports: "themeImports",

            // Only for checking valid imports
            storedProfiles: "storedProfiles",
            selectedProfile: "selectedProfile"
        }

        this.newData();
    }

    // On creation
    // This should only run once.
    newData(){

        // load profile
        let storage = this.localStorageProfileData;

        if(storage){
            this.data = storage;
            return; 
        }

        /*
            Currently an object.
            Data to be stored.

            Since it requires the actual object data, it will be null when resetted
            but needs to be initialized.
        */
        this.data = {
            
            // The storage of all the data
            storedProfiles: {},

            // Know which profile to load and save to.
            selectedProfile: "defaultProfile",
        }
        
        // Set it via function to standardize
        this.data.storedProfiles[this.data.selectedProfile] = this.createEmptyProfile();
    }

    // All but the default profile
    initLoadProfiles(data){
        if(!data) return;
        // Need a way to remove the default profile before adding?
        // Or maybe it doesnt matter because I am overriding

        this.data.storedProfiles = data;
    }

// localStorage
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    // Save the entire object
    saveDataToLocalStorage() { localStorage.setItem(this.storageObject, JSON.stringify(this.data)); }
    getDataFromLocalStorage(){ localStorage.getItem(this.storageObject);}
    get allData(){ return this.data; }

// Themes

    // Assuming iconSize is a square
    saveTheme(){

        // Get the profile first
        // Save to the profile
        // Then set the data
        
        let profile = this.getProfileData(this.data.selectedProfile);
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
        
        let profile = this.getProfileData(this.data.selectedProfile);
        if(!profile) return 0; // no data
        
        // Set all the data
        profile.layoutData = layout.allData; // How the page is displayed
        profile.containerDisplayData = containerData.allData; // Data for each container
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


    /*
        29/01/25
        This function is cursed...

        Logging this.data.selectedProfile
        magically changes within the function.

        It does not go within the if statement,

        After the if statement ( that it does not run)
        it somehow magically changes value... ????

        Edit (5 minutes later):

        I needed to store the profile in a variable.
        Apparently using the value directly is not a good thing
    */

    // load from localStorage
    loadProfileData(){

        // Needs to pass the data from the localStorage and then load it to the initializers
        // Needs the profile data first

        let selected = this.data.selectedProfile;

        // If no data in localStorage
        if(!this.initProfileData()){
            this.setValues(); // Create data first.
            return;
        }

        let profile = this.getProfileData(selected);
        if(!profile) return; // no data

        // Run the respective function if contain the data within local storage

        if(profile.layoutData  !== null) layout.initializeData(profile.layoutData);
        if(profile.containerDisplayData !== null) containerData.intializeData(profile.containerDisplayData); 
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
        return JSON.parse(storedObj); 
    }

// Imports and Exports 
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

// Exports

    /*
        To make it easier for importing,
        all the data exported will be saved in the same format
        i.e the same as allData.

        Any specific appearance parts will be under the name of the current theme
        BUT will not store the actual apperance, and will load it to place into imports
    */

    // Just loads all the data and downloads it
    exportEverything(){

        if(!this.allData) return;
        this.downloadData(this.allData);
    }

    // Just grabs the respective profile data from the name
    exportProfile(name){

        var dataToSave = this.getProfileData(name);
        if(!dataToSave) return;

        // Create object with the name of the export
        let dataExport = {
            storedProfiles: {},
            selectedProfile: name,
        };


        dataExport.storedProfiles[name] = {};

        dataExport.storedProfiles[name] = dataToSave;
        this.downloadData(dataExport);
    }

// Export individuals
    exportAppearance(name){

        let profile = this.getProfileData(name);
        if(!profile) return;
        
        let data = {
            storedProfiles: {},
            selectedProfile: name,
        };

        data.storedProfiles[name] = {};
        data.storedProfiles[name][this.localStorageVarNames.userAppearanceSettings] = profile.userAppearanceSettings

        // Property is the same name as the main string variable 

        this.downloadData(data); 
    }

    exportThemes(name){

        let profile = this.getProfileData(name);
        if(!profile) return;

        let data = {
            storedProfiles: {},
            selectedProfile: name,
        };

        data.storedProfiles[name] = {};
        data.storedProfiles[name][this.localStorageVarNames.savedTheme] = profile.savedTheme;
        data.storedProfiles[name][this.localStorageVarNames.themeImports] = profile.themeImports;

        this.downloadData(data); 
    }

    exportimportSVGs(name){

        let profile = this.getProfileData(name);
        if(!profile) return;
        
        let data = {
            storedProfiles: {},
            selectedProfile: name,
        };

        data.storedProfiles[name] = {};

        // Property is the same name as the main string variable 
        data.storedProfiles[name][this.localStorageVarNames.importSVGs] = profile.importSVGs;

        this.downloadData(data); 
    }

    exportLayout(name){

        let profile = this.getProfileData(name);
        if(!profile) return;

        let data = {
            storedProfiles: {},
            selectedProfile: name,
        };

        data.storedProfiles[name] = {};
        // Property is the same name as the main string variable 
        
        data.storedProfiles[name][this.localStorageVarNames.layoutData] = profile.layoutData;
        data.storedProfiles[name][this.localStorageVarNames.containerDisplayData] = profile.containerDisplayData;
        data.storedProfiles[name][this.localStorageVarNames.iconData] = profile.iconData;

        // Download if single click
        this.downloadData(data); 
    }

    downloadData(dataToSave){

        var data = JSON.stringify(dataToSave , null, 4);
        // Data will be just a single group.

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(data);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'HomepageLayoutSave.json'; // Generate a name ...
        hiddenElement.click();
    }

// Imports

    // Boolean
    validateImport(data){

        if(typeof(data) != "object") return false;
    /*
        Assuming data structure is:

        {
            storedProfiles: {
                name: {
                        property:
                    }
                
                },
            selectedProfile: name,
        };
    */

        // Stored profile and selected profile
        for (var value in data) {
            if(!this.localStorageVarNames.hasOwnProperty(value)) return false;
        }
        
        // access storedProfile
        let profiles = data.storedProfiles;
        if(!profiles) return false; // if empty
        
        // For every profile
        for (var profile in profiles) {

            // For every property in the profile
            for(var property in data.storedProfiles[profile]){
                // Any invalid properties inside the object will cause all to fail
                if(!this.localStorageVarNames.hasOwnProperty(property)) return false;
            }
        }

        // If all valid
        return true;
    }


    /*
        27/01/25
        JS bug

        this.data (Class variable)

        when this.data is set to another value ie. data,
        this temporarily overrides the value.
        When a member function is run,

        loadProfileData()

        the 'override' value seems to completely disappear.
        This happens right at the top of the parameter, first line just after
        trying to access it via console.log()
        I cant seem to figure out how to word it.

        'JS class variable reset'?

        Meaning, I dont know how to find any solutions better yet solve it.
        the worst part is that its not API specific or anything I can really look up
        Its so vague that its driving me crazy.
        
        When I copy the exact same code, it works, however still not fully functioning.
        
        I have no idea what the problem is.

        I think the solution is to manually fill out the data instead of doing that stupid function


    */
    
    importAll(data){
        
        // Set the profile data to the object

        this.importLayout(data);
        this.importStoredIcons(data);
        this.importThemes(data);
        this.importAppearance(data);

        // Reset selection
        editVariables.enableResetSelect();
        editVariables.enableResetFlag();

        editVariables.enableLoadimport();
    }
    
    importAppearance(data){
        
        let prof = data.storedProfiles[data.selectedProfile];

        // // Check if has data
        if(!prof.hasOwnProperty(this.localStorageVarNames.userAppearanceSettings)) return;

        editVariables.loadUserAppearance(prof.userAppearanceSettings)
    }

    importThemes(data){

        let prof = data.storedProfiles[data.selectedProfile];

        // Check if has data
        if(!(prof.hasOwnProperty(this.localStorageVarNames.savedTheme) ||
             prof.hasOwnProperty(this.localStorageVarNames.themeImports))) return;
        
        themeStorage.setImportThemes(prof.savedTheme, prof.themeImports);
    }

    importStoredIcons(data){
        
        let prof = data.storedProfiles[data.selectedProfile];

        // Check if has property first
        if(!prof.hasOwnProperty(this.localStorageVarNames.importSVGs)) return;

        iconImageStorage.setImportedSVGs(prof.importSVGs);
    }

    importLayout(data){

        // Check for any unsaved changes before importing
        // Perhaps show a modal first before any unsaved changes.

        let prof = data.storedProfiles[data.selectedProfile];

        // Check if has property first
        if(!(prof.hasOwnProperty(this.localStorageVarNames.layoutData) || 
             prof.hasOwnProperty(this.localStorageVarNames.containerDisplayData) ||
             prof.hasOwnProperty(this.localStorageVarNames.iconData))) return;

        // Load all the data
        // Any null data will not do anything
        layout.initializeData(prof.layoutData);
        containerData.intializeData(prof.containerDisplayData);
        iconData.initializeData(prof.iconData);
    }

// Profile specifics 

    createEmptyProfile(){
        return {
            layoutData: null, // How the page is displayed
            containerDisplayData: null, // Data for each container
            iconStorage: null, // Where icons are located

            iconData: null,
            importSVGs: null,
            userSettings: null,
            userAppearanceSettings: null, 

            savedTheme: null,
            themeImports: null,
        };
    }


    changeSelectedProfile(newProfile){

        // Check if exist first
        if(!this.getProfileData(newProfile)) return;

        this.data.selectedProfile = newProfile;
    }

// Basic functions

    // By name
    getProfileData(name){
        if(!name) return null;

        // console.log("get", name)

        let data = this.data.storedProfiles[name];

        // console.log("data:", data)
        return data; // If not found, should return null
    }

    // By name
    deleteProfile(name){
        
        if(!name) return; // no value parameter

        let data = this.data.storedProfiles[name];
        
        if(!data) return; // no data

        delete this.data.storedProfiles[name];

        // check if there is nothing left
        if(this.noProfiles === 0){
            this.addProfile('Profile 0')
        }
        
    }
    
    // By name
    addProfile(name, data = null){

        // Need to check if name already exists

        if(data){
            this.data.storedProfiles[name] = data;
            return;
        }

        // no data on addition

        this.data.storedProfiles[name] = this.createEmptyProfile();

        // Just to avoid repeating the long name
        let alias = this.data.storedProfiles[name];

        alias.layoutData = layout.defaultData();
        alias.containerDisplayData = containerData.defaultData();
        alias.iconStorage = [];
        alias.iconData = null;

        alias.importSVGs = [];
        alias.savedTheme = "Default";
        alias.userAppearanceSettings = editVariables.defaultAppearanceData;
        alias.userSettings = editVariables.defaultUserSettings;
    }

    // Rename the object key
    renameProfile(oldName, newName){

        if(!oldName || !newName) return; // no value parameter

        let data = this.data.storedProfiles[oldName];
        if(!data) return; // no data

        delete Object.assign(this.data.storedProfiles, {[newName]: this.data.storedProfiles[oldName] })[oldName];
    }

    isSelectedProfile(key){ return (this.data.selectedProfile == key); }

    setSelectedProfile(val){ 
        
        // Needs validation
        this.data.selectedProfile = val;
    }

    resetSelectedProfile(){
        console.log(Object.keys(this.data.storedProfiles));
        this.setSelectedProfile(Object.keys(this.data.storedProfiles)[0])
    }

    get selectedProfile(){ return this.data.selectedProfile; }
    get noProfiles()     { return Object.keys(this.data.storedProfiles).length}
    get storedProfiles() { return this.data.storedProfiles;}

    get storageNames()   { return this.localStorageVarNames; }
}

const profileHandlerInstance = new ProfileHandler;
export const profileHandler = reactive(profileHandlerInstance);