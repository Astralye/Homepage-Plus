<template>
    <div>
        <WindowContainerDivider>
            <template #header>
                <h2>General</h2>
            </template>
            
            <template #content>

                <WindowContainerDivider>
                    <template #content>
                        <h3> Edit display type </h3>

                        *Nonfunctional
                        <RadioBtn
                            v-model="vmodelValues"
                            :enable_Radio="true"
                            @clickEvent=""
                        />
        
                        <br>

                        <h3> Import</h3>                        
                        <FileUpload
                            fileType="json"
                            @changeData="data => importModal(data)">
                        </FileUpload>

                        Any imports must be saved before cancelling or leaving page.
                        <br><br>

                        <h3> Exports </h3>

                        <div class="button-row-align">

                            <SingleButton
                                m_IconString="Download"
                                @click="profileHandler.exportEverything()">
                                Export Everything
                            </SingleButton>

                            <SingleButton
                                m_IconString="Download"
                                @click="profileHandler.exportProfile(profileHandler.selectedProfile)">
                                Current Profile
                            </SingleButton>
                        </div>
                        <br>
                        
                        <div class="button-row-align">

                            <SingleButton
                                m_IconString="Download"
                                @click="profileHandler.exportThemes(profileHandler.selectedProfile)">
                                Themes
                            </SingleButton>

                            <SingleButton
                                m_IconString="Download"
                                @click="profileHandler.exportAppearance(profileHandler.selectedProfile)">
                                Appearance
                            </SingleButton>


                            <SingleButton
                                m_IconString="Download"
                                @click="profileHandler.exportimportSVGs(profileHandler.selectedProfile)">
                                Imported Icons
                            </SingleButton> 

                            <SingleButton
                                m_IconString="Download"
                                @click="profileHandler.exportLayout(profileHandler.selectedProfile)">
                                Layout
                            </SingleButton> 


                        </div>
        
                        <br>
        
                        <h3> Tutorial </h3>
        
                        *Nonfunctional
                        <SingleButton
                            m_IconString="Restart-alt"
                            @click="console.log('restart tutorial')">
                            Restart Tutorial
                        </SingleButton>

                        <br>
                        <p> Layout Modifier Reminder Window</p>
                        <SingleButton
                            m_IconString="Restart-alt"
                            @click="editVariables.resetModal()">
                            Reset 'Cancel' and 'Delete'
                        </SingleButton>

                        <br>
                        <Checkbox
                            @onChange="val => editVariables.setStateContextMenu(!val)"
                            :checkValue="!editVariables.isEnabledSiteContextMenu"
                            text="Disable site context menu"
                        />

                        <!-- Language, mention it only supports english. -->

                    </template>
                </WindowContainerDivider>
            </template>
        </WindowContainerDivider>

        <WindowContainerDivider>
            <template #header>
                <h2>Help</h2>
            </template>
            
            <template #content>
                <p>Summary ?
                    <ol>
                        <li>
                            Directory to documentation?
                        </li>
                    </ol>
                </p>
            </template>
        </WindowContainerDivider>

        <WindowContainerDivider>
            <template #header>
                <h2> About Us</h2>
            </template>
            
            <template #content>

                <WindowContainerDivider>
                    <template #content>
                        <p>
                            The developer is a computer science graduate, and is their first project outside of university.
                            <br><br>
                            This project was an idea during their final year, having to keep track of many sites
                            for research, references and ideas.
                            <br>
                            They had expected other sites to be made, but it lacked the customizability.
                            This was designed as more like a site-builder, so anyone is able to make their own homepage,
                            to suit their own needs and their own organization.
                            <br><br>
                            Site design, Project Management, Development by: Ainsley Pilongo
                            <br>
                            Email: ainsleydatoon@gmail.com
                        </p>
                    </template>
                </WindowContainerDivider>
            </template>
        </WindowContainerDivider>

        <WindowContainerDivider>
            <template #header>
                <h2> Information </h2>
            </template>
            
            <template #content>

                <WindowContainerDivider>
                    <template #content>
                        The framework chosen for development was<a href="https://vuejs.org/">Vuejs</a>and is built using<a href="https://vite.dev/">Vite</a>.
        
                        <h3> Github Repository </h3>
                        <a href="https://github.com/Astralye/Homepage-Plus">
                            <SVGHandler
                                width="75px"
                                height="75px"
                                :path_Value="iconImageStorage.getPathData('Github')"
                                :view_Box="iconImageStorage.getViewBox('Github')"
                                fill_Colour="#000000"
                            />
                        </a>
                        <br>
        
                        Credits
                        <br>
                        Any resources, I have used goes here.
                        <br>
                        Version v1.4.0
                        
                        <div class="flex-container">
                            <div class="button-bottom-right">
                                <SingleButton>
                                    Full Reset
                                </SingleButton>
                            </div>
                        </div>
                    </template>
                </WindowContainerDivider>
            </template>
        </WindowContainerDivider>
    </div>

<!-- 
    Import modal
-->

<Transition name="fade">
    <Modal 
        v-if="isModalDisplay"
        @close="disableModal()">

        <WindowContainerDivider>
            <template #header>
                <h1>
                    Import
                </h1>
            </template>
            
            <template #content>

                <template v-if="isFullImport">
                    Multiple imports!
                </template>

                
                <template v-for="(profile, index) in m_ImportData.storedProfiles" :key="index">
                
                    <h2>
                        {{ index }}
                    </h2>

                    <template v-if="importHasDataProperty(profile, profileHandler.storageNames.importSVGs)">
    
                        <div>
                            <h3> 
                                Icons
                            </h3>

                            <div class="flex iconDisplay">
                                <div v-for="(item, index) in profile.importSVGs" :key="index">
                                    <SVGHandler
                                        :height="getSize(profile.importSVGs)"
                                        :width="getSize(profile.importSVGs)"
                                        :path_Value="item[1].pathData"
                                        fill_Colour="#ffffff"
                                        :view_Box="item[1].viewBox"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <br>
    
                    </template>
    
                    <template v-if="importHasDataProperty(profile, profileHandler.storageNames.containerDisplayData)">
                        <div>
                            <h3> 
                                Layout
                            </h3>
                            How do we represent this data?
                        </div>
    
                        <br>
                    </template>
                    
                    <div v-if="importHasDataProperty(profile, profileHandler.storageNames.themeImports)">
                        <h3>
                            Themes
                        </h3>
    
                        <div v-for="(item, index) in profile.themeImports" :key="index">
    
                            {{  item.alias }}
                            
                            <div class="colour-display flex">
                                <div class="colour-item left-colour"
                                :style="{
                                    'background-color': item.primary
                                }"/>
            
                                <div class="colour-item"
                                :style="{
                                    'background-color': item.secondary
                                }"/>
            
                                <div class="colour-item right-colour"
                                :style="{
                                    'background-color': item.tertiary
                                }"/>
                            </div>
                        </div>
    
                        <br>
                    </div> 
                </template>

                
                <!-- Show a list of the things importing -->
                Any unsaved changes will be overwritten.
                Importing does not save any data.

                <!-- <br>
                <Checkbox
                    text="Do not remind me again"
                    @onChange="val => toggleOffModal = val">
                </Checkbox> -->

                <br>

                <div class="split-button">
                    <SingleButton
                        m_IconString="Tick"
                        @click="profileHandler.importAll(m_ImportData); disableModal()">
                        Confirm
                    </SingleButton>
                    <!--  disableModal() -->
                    <SingleButton
                        m_IconString="Cross"
                        @click="cancelImport()">
                        Cancel
                    </SingleButton>
                </div>
            </template>
        </WindowContainerDivider>
    </Modal>
</Transition>

</template>

<script>
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import ToolTip from '../Window Components/ToolTip.vue';
import { iconImageStorage } from '../../Data/iconImages';
import SVGHandler from '../Input Components/SVGHandler.vue';

import Checkbox from '../Input Components/Checkbox.vue';
import RadioBtn from '../Input Components/RadioBtn.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import FileUpload from '../Input Components/FileUpload.vue';
import Modal from '../Main/Modal.vue';

import { editVariables } from '../../Data/SettingVariables';
import { themeStorage } from '../../Data/themeStorage';
import { profileHandler } from '../../Data/profileHandler';

export default {
    components:{
        WindowContainerDivider,
        SingleButton,
        FileUpload,
        SVGHandler,
        Checkbox,
        RadioBtn,
        ToolTip,
        Modal,
    },
    data(){
        return{
            iconImageStorage,
            profileHandler,
            editVariables,
            themeStorage,

            vmodelValues: [
                { id: "Windows" , selected: false },
                { id: "Sidebar" , selected: false },
            ],

            isModalDisplay: false,
            m_ImportData: null,
        }
    },
    methods: {

        enableModal(){ this.isModalDisplay = true;},
        disableModal(){ this.isModalDisplay = false;},

        // Boolean
        importHasDataProperty(profile, prop){

            // Should only be a length of 1.
            let keys = Object.keys(profile);

            for(let i = 0; i < keys.length; i++){
                if(keys[i] === prop){

                    let propData = profile[prop];

                    if(!propData) return false; // null
                    if(Object.keys(propData).length == 0) return false; // empty object
                    if(propData.length == 0) return false; // empty array
                     
                    return true;
                }
            }
            return false;
        },

// Imports
// ----------------------------------------------------------------------------------------------------------------------

        cancelImport(){
            this.m_ImportData = null;
            this.disableModal();
        },

        importModal(data){

            // Check if valid data first.
            let validImport = profileHandler.validateImport(data); 
            if(!validImport){

                // Display some message for invalid import
                return;
            }

            
            // option to disable import modal?
            
            // let showModal = (type === "Delete") ? editVariables.isShowDeleteModal : editVariables.isShowCancelModal;
            // if(!showModal){
                
            //     // Run the corresponding function
            //     if(type==="Delete") this.deleteLayout();
            //     if(type==="Cancel") this.cancelEdit();
            
            //     return;
            // }
            
            this.m_ImportData = data;

            this.enableModal();
        },

        // Changes import icon size depending on number shown.
        getSize(iconArray){
            let size = iconArray.length;

            if(size <= 5) return "5em";
            if(size <= 10) return "4em";
            if(size <= 20) return "3em";

            return "1em";
        }
    },
    computed:{

        // Single imports will only have a single stored profile.
        isFullImport(){ return (Object.keys(this.m_ImportData.storedProfiles).length > 1) },
    }
}
</script>

<style scoped>

.colour-display{
    padding-left: 0.5em;
    padding-right: 0.5em;
    
    height: 2em;
    justify-content: space-evenly;
}

.flex{
    display: flex;
}

.left-colour{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    
}

.right-colour{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.colour-item{
    height: 100%;
    width: 100%;
}


.iconDisplay{
    display: flex;
    flex-wrap: wrap;
}

.split-button{
    display:flex;
    justify-content:space-between;
}

a:hover{
    background-color: rgba(0, 0, 0, 0);
}

.button-row-align{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.flex-container{
    position: relative;
}

.button-bottom-right{
    position: absolute;
    width: fit-content;
    right: 0;
}

/* 
    Im expecting the window to be quite large,
    so I figured it might be suitable for the window to have a max height and scrollability.

    Maybe this should be put on the window container instead
*/

</style>