<template>
    <WindowContainerDivider>
        <template #header>
            <h2 class="inline">
                Container Selection
            </h2>
        </template>
        <template #content>
            
            <WindowContainerDivider>
                <template #content>
                    <div class="space-between flex">
                        <div class="flex-row flex">
                            <SingleButton
                                class="flex"
                                @click="activateSelectionMode" 
                                :button_toggle="true"
                                m_IconString="Dotted_Square"
                                >
                                Select
                            </SingleButton>
                            <SingleButton
                                class="flex button-left-padding"
                                @click="resetSelected"
                                m_IconString="Remove_Select"
                                >
                                Deselect
                            </SingleButton>
                        </div>
                        <SingleButton
                            class="flex"
                            @click="deleteContainer" 
                            m_IconString="Delete"
                            :enabled="isDeleteButtonActive"
                            >
                            Delete
                        </SingleButton>
                    </div>
                    <br>
                    <p>
                        ID: {{ displayID }} 
                    <br>
                        Level : {{  displayLevel }}
                    </p>
                </template>
            </WindowContainerDivider>
        </template>

        <template #tooltip>
        </template>
    </WindowContainerDivider>
</template>

<script>
import WindowContainerDivider from './WindowContainerDivider.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import { LayoutDataClass, layout } from '../../Data/layoutData';

import { editVariables } from '../../Data/SettingVariables';

export default {
    components:{
        WindowContainerDivider,
        SingleButton,
    },
    data(){
        return {
            editVariables,
            layout,

            m_SelectedID: null,
            m_SelectedLevel: null,
        }
    },
    
    /*
        Check if there is already loaded data
        Automatically update parents data due to emitter
    */
    created(){
        if(editVariables.containerSelected){ this.updateSelected(editVariables.containerSelected); }
    },
    emit: [ 'updateSelected', 'reset' ],
    methods: {
        activateSelectionMode() {
            editVariables.enableContainerSelection();
        },

        // Reset the parent values to reset the values here
        resetSelected(){ 
            editVariables.setContainerSelected(null);
            editVariables.disableResetSelect();

            this.m_SelectedID = null;
            this.m_SelectedLevel = null;

            this.$emit('reset');
        },

        // Deletes container from layout and resets the selection
        deleteContainer(){
            // A modal should appear to make sure if the user wants to confirm their action
            // Give an option 'do not show again'

            if(!this.isDeleteButtonActive) return; // Return in the event of somehow being active. 

            LayoutDataClass.removeChildByID(layout.data, this.selected_Container.id, this.selected_Container.level );
            this.resetSelected()
        },

        updateSelected(newContainerID){
            if(this.isNoSelect) { this.resetSelected(); return;};
            const level = Number(newContainerID.charAt(newContainerID.length - 2));

            this.m_SelectedID = newContainerID;
            this.m_SelectedLevel = level;

            this.$emit('updateSelected', newContainerID);
        }
    },
    computed:{
        displayID(){
            return (this.m_SelectedID) ? this.m_SelectedID : "Not selected"
        },
        displayLevel(){
            return (this.m_SelectedLevel) ? this.m_SelectedLevel : "Not selected"
        },
        isDeleteButtonActive(){
            return (this.m_SelectedID != null || this.m_SelectedLevel != null);
        },

        // If a container is selected
        isNoSelect(){ return (editVariables.containerSelected === null); },
    },
    watch: {
        // Send emit to parent, force update any variables used.
        'editVariables.containerSelected'(val){ this.updateSelected(val); },

        // reset if true
        'editVariables.resetSelect'(val){ if(val){ this.resetSelected(); } }, 
    }
}
</script>

<style scoped>
.space-between{
    justify-content: space-between;
}

.button-left-padding{
    margin-left: 0.5em;
}

.flex{
    display: flex;
}

.inline{
    display: inline;
}

.flex-row{
    flex-direction: row;
}
</style>