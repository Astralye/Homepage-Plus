<template>
    <Transition name="fade">
        <div class="action-container" v-if="this.$GlobalStates.value.edit.enabled">
            <!-- Save button -->
            <button @click="saveLayout">
                <svg xmlns="http://www.w3.org/2000/svg" :height="iconSize" viewBox="0 -960 960 960" fill="#CCCCCC">
                    <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
                </svg>
            </button>

            <!-- Delete button -->
            <button @click="deleteLayout">
                <svg xmlns="http://www.w3.org/2000/svg" :height="iconSize" viewBox="0 -960 960 960" fill="#CCCCCC">
                    <path d="M283-130q-30.94 0-52.97-22.03Q208-174.06 208-205v-512h-39v-75h193v-38h237v38h193v75h-39v512q0 30.94-22.03 52.97Q708.94-130 678-130H283Zm395-587H283v512h395v-512ZM365-283.5h75v-355h-75v355Zm156 0h75v-355h-75v355ZM283-717v512-512Z"/>
                </svg>
            </button>

            <!-- Cancel Button -->
            <button @click="cancelEdit">
                <svg xmlns="http://www.w3.org/2000/svg" :height="iconSize" viewBox="0 -960 960 960" fill="#CCCCCC">
                    <path d="m259-206-52-53 220-221-220-221 52-53 221 221 221-221 52 53-220 221 220 221-52 53-221-221-221 221Z"/>
                </svg>
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

export default {
    components:{
        Modal
    },
    data(){
        return {
            iconSize: "5em",
            modal:{
                show: false,
                header: "",
                body: "",
                footer: "",
                confirmed: false
            },
            localStorageVarNames: {
                layoutDataName: "layoutData",
                displayData: "containerDisplayData",
                containerContent: "containerContentData", 
            }
        }
    },
    methods: {

        openModal(header, body, footer){
            this.modal.header = header;
            this.modal.body = body;
            this.modal.footer = footer;
            this.modal.show = true; 
        },
        saveLayout(){
            let containerObj = this.$layoutData.value;

            let container_serialized = JSON.stringify(containerObj);
            localStorage.setItem(this.localStorageVarNames.layoutDataName, container_serialized);
            
            this.showPopup("Saved");
        },

        // These functions should be call other functions from different areas and process them 
        deleteLayout(){

            this.openModal(
                "Delete layout",
                "Are you sure you want to delete this layout? \n This cannot be undone.",
            );

            if(!this.modal.confirmed){ return; }

            let baseObject = {
                level: 0,
                divisionType: "Vertical",
                id: "0A",
                NoChildren: 0,
                siblings: 0,
                evenSplit: "true",
                unevenFRData: "",
                childContainers: []
            }

            // Reset Container Object
            this.$layoutData.value = baseObject;
            this.saveLayout();
            
            // Reset selected
            this.$GlobalStates.value.edit.resetSelect = true;
            this.showPopup("deleted");
            this.modal.confirmed = false;
        },
        // Load from localstorage
        cancelEdit(){

            // Tmp
            // Show message
            this.openModal(
                "Cancel layout",
                "Are you sure you want to cancel? \n Any unsaved changes will be lost",
            );

            if(!this.modal.confirmed){ return; }

            const layoutData = JSON.parse(localStorage.getItem(this.localStorageVarNames.layoutDataName));

            if(layoutData === null) {
                console.log("No data!"); 
                return;
            }

            this.$GlobalStates.clickLoad = true; 
            this.$layoutData.value = layoutData;

            // Reset selected
            this.$GlobalStates.value.edit.resetSelect = true;
            this.showPopup("cancelled");
            this.modal.confirmed = false;

            // Could also try and toggle off the global enabled.
            // Turn off the edit mode.
        },

        // Above the containers, show a message showing what the user has clicked.
        // E.g ___ Successfully.
        showPopup(message){
            console.log(message);
        }
    }
}
</script>

<style scoped>
@import '../../assets/base.css';

  
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
    background-color: black;

    right: 0;
    bottom: 0;
    margin: 1em;
    
    transition: all 0.2s;
}

</style>