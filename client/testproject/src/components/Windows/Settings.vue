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
                                @click="exportAll()">
                                All data
                            </SingleButton>
                        </div>
                        <br>
                        
                        <div class="button-row-align">

                            <SingleButton
                                m_IconString="Download"
                                @click="exportThemes()">
                                Themes
                            </SingleButton>

                            <SingleButton
                                m_IconString="Download"
                                @click="exportImportedIcons()">
                                Imported Icons
                            </SingleButton> 

                            <SingleButton
                                m_IconString="Download"
                                @click="exportLayout()">
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
                <h2> Appearance </h2>
            </template>
            
            <template #content>
                <WindowContainerDivider>
                    <template #header> 
                        <h3>
                            Grids
                        </h3>
                    </template>

                    <template #content>
                        <Checkbox
                            @onChange=""
                            :checkValue="false"
                            text="Display Icon Labels"
                        />
                        Global icon size: in px
                    </template>

                </WindowContainerDivider>

                <WindowContainerDivider>
                    <template #header>
                        <h3>
                            Lists
                        </h3>
                    </template>

                    <template #content>
                        <Checkbox
                            @onChange=""
                            :checkValue="false"
                            text="Display Icons"
                        />
                    </template>

                </WindowContainerDivider>

                <WindowContainerDivider>
                    <template #header>
                        <h3>
                            Text
                        </h3>
                    </template>

                    <template #content>
                        Default fontsize:
                        
                        Font: Dropdown

                        Import fonts,

                        <Checkbox
                            @onChange=""
                            :checkValue="false"
                            text="Display Text Background"
                        />
                        Background Colour
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
                    Importing 
                </h1>
            </template>
            
            <template #content>

                <template v-if="importHasDataProperty(localStorageVarNames.importedIcons)">

                    <div v-if="importHasDataProperty(localStorageVarNames.importedIcons)">
                        <h3> 
                            Icons
                        </h3>
                        <div class="flex iconDisplay">
                            <div v-for="(item, index) in m_ImportData.importedIcons" :key="index">
                                <SVGHandler
                                    :height="getSize"
                                    :width="getSize"
                                    :path_Value="item[1].pathData"
                                    fill_Colour="#ffffff"
                                    :view_Box="item[1].viewBox"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <br>

                </template>

                <template v-if="importHasDataProperty(localStorageVarNames.containerDisplayData)">
                    <div>
                        <h3> 
                            Layout
                        </h3>
                        How do we represent this data?
                    </div>

                    <br>
                </template>
                
                <div v-if="importHasDataProperty(localStorageVarNames.savedTheme)">
                    <h3>
                        Themes
                    </h3>

                    <div v-for="(item, index) in m_ImportData.customThemes" :key="index">

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
                        @click="importAll()">
                        Confirm
                    </SingleButton>
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
import { layout } from '../../Data/layoutData';
import { containerData } from '../../Data/containerData';
import { iconData } from '../../Data/iconData';
import { themeStorage } from '../../Data/themeStorage';

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
            editVariables,
            themeStorage,

            vmodelValues: [
                { id: "Windows" , selected: false },
                { id: "Sidebar" , selected: false },
            ],

            // For Downloading
            localStorageVarNames: {
                
                // Variable are the same name as the string
                // For object lookups for validation
                layoutData: "layoutData",
                containerDisplayData: "containerDisplayData",
                iconData: "iconData",
                
                iconStorage: "iconStorage",
                importedIcons: "importedIcons",

                savedTheme: 'savedTheme',
                customThemes: 'customThemes',
            },

            isModalDisplay: false,
            m_ImportData: null,
        }
    },
    methods: {

        enableModal(){ this.isModalDisplay = true;},
        disableModal(){ this.isModalDisplay = false;},

        // Boolean
        importHasDataProperty(prop){
            return (this.m_ImportData.hasOwnProperty(prop));
        },

// Data
// -------------------------------------------------------------------------------------------------------

    // Exports

        // If given a parameter, add it to an object
        // if not, just export itself

        exportAll(){

            var dataToSave = {};

            dataToSave = this.exportLayout(dataToSave);
            dataToSave = this.exportThemes(dataToSave);
            dataToSave = this.exportImportedIcons(dataToSave);

            this.downloadData(dataToSave);
        },

        // Not implemented yet
        exportThemes(dataToSave = null){

            let data = {};

            // Property is the same name as the main string variable 
            data[this.localStorageVarNames.savedTheme] = JSON.parse(localStorage.getItem(this.localStorageVarNames.savedTheme));
            data[this.localStorageVarNames.customThemes] = JSON.parse(localStorage.getItem(this.localStorageVarNames.customThemes));

            // If parameter contained data, merge
            if(dataToSave) return {...dataToSave, ...data};

            this.downloadData(data); 
        },

        exportImportedIcons(dataToSave = null){

            let data = {};

            // Property is the same name as the main string variable 
            data[this.localStorageVarNames.importedIcons] = JSON.parse(localStorage.getItem(this.localStorageVarNames.importedIcons));
             
            // If parameter contained data, merge
            if(dataToSave) return {...dataToSave, ...data};

            this.downloadData(data); 
        },

        exportLayout(dataToSave = null){

            var data = {};

            // Property is the same name as the main string variable 
            data[this.localStorageVarNames.layoutData] = JSON.parse(localStorage.getItem(this.localStorageVarNames.layoutData));
            data[this.localStorageVarNames.containerDisplayData] = JSON.parse(localStorage.getItem(this.localStorageVarNames.containerDisplayData));
            data[this.localStorageVarNames.iconData] = JSON.parse(localStorage.getItem(this.localStorageVarNames.iconData));
            
            // If parameter contained data, merge
            if(dataToSave) return {...dataToSave, ...data};

            this.downloadData(data); 
        },

        downloadData(dataToSave){
            var data = JSON.stringify(dataToSave , null, 4);

            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(data);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'HomepageLayoutSave.json'; // Generate a name ...
            hiddenElement.click();
        },

// Imports
// ----------------------------------------------------------------------------------------------------------------------

        cancelImport(){
            this.m_ImportData = null;
            this.disableModal();
        },

        // Boolean
        validateImport(data){

            if(typeof(data) != "object") return false;

            // Check for valid property
            for (var key in data) {

                if(!this.localStorageVarNames.hasOwnProperty(key)) return false;
            }

            return true;
        },

        importModal(data){

            // Check if valid data first.
            let validImport = this.validateImport(data); 
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
            // console.log(this.m_ImportData);
            this.enableModal();
        },

        importAll(){

            var data = this.m_ImportData;

            this.importLayout(data);
            this.importStoredIcons(data);
            this.importThemes(data);

            // Reset selection
            editVariables.enableResetSelect();
            editVariables.enableResetFlag();

            this.disableModal();
        },

        // Not implemented
        importThemes(data){

            // Check if has data
            if(!data.hasOwnProperty(`${this.localStorageVarNames.customThemes}`)) return;
            
            themeStorage.setImportThemes(data);
        },

        importStoredIcons(data){
            
            // Check if has property first
            if(!data.hasOwnProperty(`${this.localStorageVarNames.importedIcons}`)) return;

            iconImageStorage.setImportedSVGs(data.importedIcons);
        },

        importLayout(data){

            // Check for any unsaved changes before importing
            // Perhaps show a modal first before any unsaved changes.

            // Check if has property first
            if(!(data.hasOwnProperty(`${this.localStorageVarNames.layoutData}`) || 
                 data.hasOwnProperty(`${this.localStorageVarNames.containerDisplayData}`) ||
                 data.hasOwnProperty(`${this.localStorageVarNames.iconData}`))) return;


            // Load all the data
            // Any null data will not do anything
            layout.initializeData(data.layoutData);
            containerData.intializeData(data.containerDisplayData);
            iconData.initializeData(data.iconData);
        },
        
        // ------------------------------------------------------------------------------------------------------
    },
    computed:{

        // Changes import icon size depending on number shown.
        getSize(){
            
            let size = this.m_ImportData.importedIcons.length;

            if(size <= 5) return "5em";
            if(size <= 10) return "4em";
            if(size <= 20) return "3em";

            return "1em";
        }
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