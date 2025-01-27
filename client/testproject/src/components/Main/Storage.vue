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
                    :fill_Colour="themeStorage.highContrastColour"
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
                    :fill_Colour="themeStorage.highContrastColour"
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
                    :fill_Colour="themeStorage.highContrastColour"
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
import { iconData, iconStorage } from '../../Data/iconData.js';
import { containerData } from '../../Data/containerData.js'
import { layout } from '../../Data/layoutData.js';
import { themeStorage } from '../../Data/themeStorage';

import { editVariables } from '../../Data/SettingVariables';
import { iconImageStorage } from '../../Data/iconImages';

import { profileHandler } from '../../Data/profileHandler.js';

import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import SVGHandler from '../Input Components/SVGHandler.vue';
import Checkbox from '../Input Components/Checkbox.vue';
import Modal from './Modal.vue';

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
            themeStorage,
            iconStorage,
            iconData,
            layout,

            iconSize: "5em",

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
        profileHandler.loadData();
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

        saveLayout(){
            profileHandler.setValues();
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
            profileHandler.resetData();
            profileHandler.resetFlag();

            this.popuptext = "Layout Deleted!";
            this.enableButtonTimer();
        },

        // Load from localstorage
        cancelEdit(){
            this.disableModal();

            // turns off modal for next time
            if(this.toggleOffModal) { editVariables.setCancelModal(false);}

            profileHandler.loadData(); // reload the saved data
            profileHandler.resetFlag();

            this.popuptext = "Cancelled!";
            this.enableButtonTimer();
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