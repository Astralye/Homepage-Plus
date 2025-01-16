<template>

    <Transition name="fade">
        <div class="action-container" v-if="editVariables.isEnabled">
            
            <!-- Popup -->
            <Transition name="fade">
                <div v-if="isDisplayPopup"
                    class="popup"
                    >
                    {{ popuptext }}
                </div>
            </Transition>


            <!-- Save button -->
            <button @click="saveLayout"
                ref="save">
                <SVGHandler
                    height="4em"
                    width="4em"
                    view_Box="0 -960 960 960"
                    fill_Colour="#CCCCCC"
                    :path_Value="iconImageStorage.getPathData('Save')"
                />
            </button>

            <!-- Delete button -->
            <button @click="openModal('Delete')"
                ref="delete">
                <SVGHandler
                    height="4em"
                    width="4em"
                    view_Box="0 -960 960 960"
                    fill_Colour="#CCCCCC"
                    :path_Value="iconImageStorage.getPathData('Delete')"
            />
            </button>

            <!-- Cancel Button -->
            <button @click="openModal('Cancel')"
                ref="cancel">
                <SVGHandler
                    height="4em"
                    width="4em"
                    view_Box="0 -960 960 960"
                    fill_Colour="#CCCCCC"
                    :path_Value="iconImageStorage.getPathData('Cross')"
            />
            </button>

        </div>
    </Transition>

    <Transition name="fade">
        <Modal 
            v-if="isModalDisplay"
            @close="disableModal()">
        
            <template v-if="ifSelectedModal('Delete')">
                <WindowContainerDivider>
                    <template #header>
                        <h1>
                            Delete Layout
                        </h1>
                    </template>

                    <template #content>
                        <p>
                        Are you sure you want to delete this layout?
                        
                        <br>
                        All icons within containers and in the saved icons list will be deleted.
                        <br>
                        This cannot be undone.
                        </p>

                        <br>
                        <Checkbox
                            text="Do not remind me again"
                            @onChange="val => toggleOffModal = val">
                        </Checkbox>

                        <br>

                        <div class="split-button">

                            <SingleButton
                                m_IconString="Tick"
                                @click="deleteLayout() ">
                                Confirm
                            </SingleButton>
                            <SingleButton
                                m_IconString="Cross"
                                @click="disableModal()">
                                Cancel
                            </SingleButton>
                        </div>
                    </template>
                </WindowContainerDivider>
            </template>
        
            <template v-else-if="ifSelectedModal('Cancel')">
                <WindowContainerDivider>
                    <template #header>
                        <h1>
                            Cancel Layout
                        </h1>
                    </template>

                    <template #content>
                        <p>
                        Are you sure you want to cancel?
                        <br>
                        Any unsaved changes will be undone. This includes any new or deleted icons.
                        </p>

                        <br>
                        <Checkbox
                            text="Do not remind me again"
                            @onChange="val => toggleOffModal = val">
                        </Checkbox>

                        <br>

                        <div class="split-button">
                            <SingleButton
                                m_IconString="Tick"
                                @click="cancelEdit()">
                                Confirm
                            </SingleButton>
                            <SingleButton
                                m_IconString="Cross"
                                @click="disableModal()">
                                Cancel
                            </SingleButton>
                        </div>
                    </template>
                </WindowContainerDivider>
            </template>
        </Modal>
    </Transition>
</template>

<script>
import Modal from './Modal.vue';
import { containerData } from '../../Data/containerData.js'
import { layout } from '../../Data/layoutData.js';
import { iconData, iconStorage } from '../../Data/iconData.js';

import SVGHandler from '../Input Components/SVGHandler.vue';
import { iconImageStorage } from '../../Data/iconImages';

import { editVariables } from '../../Data/SettingVariables';

import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import Checkbox from '../Input Components/Checkbox.vue';
import SingleButton from '../Input Components/SingleButton.vue';

export default {
    components:{
        WindowContainerDivider,
        SingleButton,
        SVGHandler,
        Checkbox,
        Modal,
    },
    data(){
        return {
            iconImageStorage,
            containerData,
            editVariables,
            iconStorage,
            iconData,
            layout,

            iconSize: "5em",
            localStorageVarNames: {
                layoutDataName: "layoutData",
                displayData: "containerDisplayData",
                iconData: "iconData",
                iconStorage: "iconStorage",
                
                userSettings: "userSettings",
                importedIcons: "importedIcons",
            },

            // Confirmation.
            modalType: null,
            isModalDisplay: false,

            isDisplayPopup: false,
            popuptext: "",

            popupTimer: 2600, // The timer must be slighly lower than the actual animation timer to make sure it doesn't cause any visual bugs

            toggleOffModal: false, 
        }
    },
    created(){
        this.loadData();
    },
    methods: {

        setModalType(type){ this.modalType = type; },
        ifSelectedModal(type){ return ( this.modalType === type); },

        enableModal(){ this.isModalDisplay = true;},
        disableModal(){ this.isModalDisplay = false;},

        enableButtonTimer(){
            this.isDisplayPopup = true;

            setTimeout( () =>{
                this.isDisplayPopup = false;
            },this.popupTimer);
        },
        // Sets localstorage values
        setValues(){
            localStorage.setItem(this.localStorageVarNames.layoutDataName, JSON.stringify(layout.allData));
            localStorage.setItem(this.localStorageVarNames.displayData,    JSON.stringify(containerData.allData));
            localStorage.setItem(this.localStorageVarNames.iconData,       JSON.stringify(iconData.allData));
            localStorage.setItem(this.localStorageVarNames.iconStorage,    JSON.stringify(iconStorage.allData));

            localStorage.setItem(this.localStorageVarNames.importedIcons,  JSON.stringify(Array.from(iconImageStorage.importedSVGs.entries())));
            localStorage.setItem(this.localStorageVarNames.userSettings,   JSON.stringify(editVariables.userSettings));
        },

        saveLayout(){
            this.setValues();
            this.enableButtonTimer();
            this.popuptext = "Layout Saved!";
        },

        openModal(type){

            // Only open modal if the it is enabled.
            let showModal = (type === "Delete") ? editVariables.isShowDeleteModal : editVariables.isShowCancelModal;
            if(!showModal){

                // Run the corresponding function
                if(type==="Delete") this.deleteLayout();
                if(type==="Cancel") this.cancelEdit();

                return;
            }

            this.enableModal();
            this.setModalType(type);
            this.toggleOffModal = false;
        },

        // These functions should be call other functions from different areas and process them 
        deleteLayout(){
            this.disableModal();

            // turns off modal for next time
            if(this.toggleOffModal) { editVariables.setDeleteModal(false);}

            // Reset data
            containerData.resetData();
            layout.resetData();
            iconData.resetData();
            iconStorage.resetData();
            iconImageStorage.resetImports();

            this.setValues();
            this.resetFlag();
            // Reset selected
            editVariables.enableResetSelect();

            this.popuptext = "Layout Deleted!";
            this.enableButtonTimer();
        },

        // It is enabled for 1 tick to trigger the watchers
        resetFlag(){
            editVariables.enableResetFlag();
            this.$nextTick(() =>{
                editVariables.disableResetFlag();
            });
        },

        // Load from localstorage
        cancelEdit(){
            this.disableModal();

            // turns off modal for next time
            if(this.toggleOffModal) { editVariables.setCancelModal(false);}

            this.loadData();
            this.resetFlag();
            
            // Reset selected
            editVariables.enableResetSelect();


            this.popuptext = "Cancelled!";
            this.enableButtonTimer();
        },

        loadData(){
            const layoutData  = JSON.parse(localStorage.getItem(this.localStorageVarNames.layoutDataName));
            const displayData = JSON.parse(localStorage.getItem(this.localStorageVarNames.displayData));
            const dataIcon    = JSON.parse(localStorage.getItem(this.localStorageVarNames.iconData));
            const storageData = JSON.parse(localStorage.getItem(this.localStorageVarNames.iconStorage));

            const importIcons = JSON.parse(localStorage.getItem(this.localStorageVarNames.importedIcons));
            const userData    = JSON.parse(localStorage.getItem(this.localStorageVarNames.userSettings));
            
            if(layoutData  === null) { console.log("No Layout Data!");  return; }
            if(displayData === null) { console.log("No Display Data!"); return;}
            if(dataIcon === null)    { console.log("No Icon Data!");    return;}
            if(storageData === null) { console.log("No Icon Storage Data!");    return;}
            
            if(importIcons === null) { console.log("No icon Data!");}
            if(userData === null)    { console.log("No Settings Data!");    return;}

            layout.initializeData(layoutData);
            containerData.intializeData(displayData); 
            iconData.initializeData(dataIcon);
            iconStorage.initDataFromStorage(storageData); // Change later
            
            iconImageStorage.setImportedSVGs(importIcons);
            editVariables.loadUserSettings(userData);
            
            editVariables.enableRenderFinalNode();
        },
    }
}
</script>

<style scoped>
@import '../../assets/base.css';

.split-button{
    display:flex;
    justify-content:space-between;
}

.popup{
    
    position: absolute;
    background-color: var(--Secondary-background-colour);
    
    width: fit-content;
    height: fit-content;

    padding: 10px 15px;
    
    border: solid var(--WindowBorder-Thickness) var(--Secondary-background-colour);
    border-radius: var(--WindowBorder-Radius);
    box-shadow: var(--box-shadow);

    transform: translateY(-100%);

    z-index: 2;

    animation-name: popupMovement;
    animation-timing-function: ease-out;
    animation-duration: 1000ms;
    animation-delay: 1750ms;
}

@keyframes popupMovement {
    0% {
        transform: translateY(-100%);
        opacity: 100%;
    }
    100% {
        transform: translateY(-200%);
        opacity: 0%;
    }
}

.action-container{
    display: flex;
    position: absolute;

    background-color: var(--Secondary-background-colour);

    padding: 10px;

    border: solid var(--WindowBorder-Thickness) var(--Secondary-background-colour);
    border-radius: var(--WindowBorder-Radius);
    box-shadow: var(--box-shadow);

    right: 0;
    bottom: 0;
    margin: 1em;
    
    transition: all 0.2s;
}

</style>