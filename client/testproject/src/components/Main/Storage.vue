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
            <button @click="deleteLayout"
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
            <button @click="cancelEdit"
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

    <Transition name="modal">
        <Modal 
            v-if="modal.show"
            @close="modal.show = false"
            @accept="modal.show = false; modal.confirmed = true">
            <template v-slot:header>
                {{ modal.header }}
            </template>
            <template v-slot:body>
                {{ modal.body }}
            </template>
            <template v-slot:footer>
                {{ modal.footer }}
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

export default {
    components:{
        Modal,
        SVGHandler
    },
    data(){
        return {
            containerData,
            layout,
            iconData,
            iconStorage,
            iconImageStorage,
            editVariables,

            iconSize: "5em",
            localStorageVarNames: {
                layoutDataName: "layoutData",
                displayData: "containerDisplayData",
                iconData: "iconData",
                iconStorage: "iconStorage"
            },

            // Confirmation.
            modal:{
                show: false,
                header: "",
                body: "",
                footer: "",
                confirmed: false
            },

            isDisplayPopup: false,
            popuptext: "",

            popupTimer: 2600, // The timer must be slighly lower than the actual animation timer to make sure it doesn't cause any visual bugs

        }
    },
    created(){
        this.loadData();
    },
    methods: {

        
        enableButtonTimer(){
            this.isDisplayPopup = true;

            setTimeout( () =>{
                this.isDisplayPopup = false;
            },this.popupTimer);
        },

        openModal(header, body, footer){
            this.modal.header = header;
            this.modal.body   = body;
            this.modal.footer = footer;
            this.modal.show   = true; 
        },

        // Sets localstorage values
        setValues(){
            localStorage.setItem(this.localStorageVarNames.layoutDataName, JSON.stringify(layout.allData));
            localStorage.setItem(this.localStorageVarNames.displayData,    JSON.stringify(containerData.allData));
            localStorage.setItem(this.localStorageVarNames.iconData,       JSON.stringify(iconData.allData));
            localStorage.setItem(this.localStorageVarNames.iconStorage,    JSON.stringify(iconStorage.allData));
        },
        saveLayout(){
            this.setValues();
            this.enableButtonTimer();
            this.popuptext = "Layout Saved!";
            
        },

        // These functions should be call other functions from different areas and process them 
        deleteLayout(){

            // this.openModal(
            //     "Delete layout",
            //     "Are you sure you want to delete this layout? \n This cannot be undone.",
            // );

            // if(!this.modal.confirmed){ return; }
    
            // Reset data
            containerData.resetData();
            layout.resetData();
            iconData.resetData();
            iconStorage.TMP_resetData(); // Remove later

            this.setValues();
            // Reset selected
            editVariables.enableResetSelect();
            this.modal.confirmed = false;

            this.popuptext = "Layout Deleted!";
            this.enableButtonTimer();
        },
        // Load from localstorage
        cancelEdit(){

            // Tmp
            // Show message
            // this.openModal(
            //     "Cancel layout",
            //     "Are you sure you want to cancel? \n Any unsaved changes will be lost",
            // );

            // if(!this.modal.confirmed){ return; }

            this.loadData();

            // Reset selected
            editVariables.enableResetSelect();
            this.modal.confirmed = false;

            this.popuptext = "Cancelled!";
            this.enableButtonTimer();
            // Could also try and toggle off the global enabled.
            // Turn off the edit mode.
        },

        loadData(){
            const layoutData  = JSON.parse(localStorage.getItem(this.localStorageVarNames.layoutDataName));
            const displayData = JSON.parse(localStorage.getItem(this.localStorageVarNames.displayData));
            const dataIcon    = JSON.parse(localStorage.getItem(this.localStorageVarNames.iconData));
            const storageData = JSON.parse(localStorage.getItem(this.localStorageVarNames.iconStorage));
            

            if(layoutData  === null) { console.log("No Layout Data!");  return; }
            if(displayData === null) { console.log("No Display Data!"); return;}
            if(dataIcon === null)    { console.log("No Icon Data!");    return;}
            if(storageData === null) { console.log("No Icon Storage Data!");    return;}
            

            layout.initializeData(layoutData);
            containerData.intializeData(displayData); 
            iconData.initializeData(dataIcon);
            iconStorage.TMP_initData(storageData); // Change later
            
            // this.$GlobalStates.clickLoad = true; 
            editVariables.enableRenderFinalNode();
        },
    }
}
</script>

<style scoped>
@import '../../assets/base.css';

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

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
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