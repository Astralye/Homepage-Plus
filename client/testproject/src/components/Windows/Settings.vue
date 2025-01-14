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
        
                        <h3> Data </h3>
                            
                        <!--
                            Importing and exporting should involve multiple ways
                        -->
                        <h4> Import</h4>

                        <div class="button-row-align">

                            <FileUpload
                                fileType="json"
                                @changeData="data => importAll(data)">
                            </FileUpload>

                        </div>
                        
                        Any imports must be saved before cancelling or leaving page.
                        
                        <br><br>

                        <h4> Exports </h4>

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
                                @click="'exportThemes()'">
                                Themes*
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
                            Themes
                        </h3>
                    </template>

                    <template #content>
                        Some kind of theme selector.

                        Maybe opens a list.
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
                        Version v1.3.0
                        
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

import { editVariables } from '../../Data/SettingVariables';
import { layout } from '../../Data/layoutData';
import { containerData } from '../../Data/containerData';
import { iconData } from '../../Data/iconData';

export default {
    components:{
        WindowContainerDivider,
        SingleButton,
        FileUpload,
        SVGHandler,
        Checkbox,
        RadioBtn,
        ToolTip,
    },
    data(){
        return{
            iconImageStorage,
            editVariables,

            vmodelValues: [
                { id: "Windows" , selected: false },
                { id: "Sidebar" , selected: false },
            ],

            // For Downloading
            localStorageVarNames: {
                
                // Get these to work for now.
                layoutDataName: "layoutData",
                displayData: "containerDisplayData",
                iconData: "iconData",
                
                importedIcons: "importedIcons",
                
                iconStorage: "iconStorage",
            },

        }
    },
    methods: {

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

            let data = {
                themes: [],
            }

            // If parameter contained data, merge
            if(dataToSave) return {...dataToSave, ...data};

            this.downloadData(data); 
        },

        exportImportedIcons(dataToSave = null){

            let data = {
                icons: JSON.parse(localStorage.getItem(this.localStorageVarNames.importedIcons))
            } 

            // If parameter contained data, merge
            if(dataToSave) return {...dataToSave, ...data};

            this.downloadData(data); 
        },

        exportLayout(dataToSave = null){

            var data = {
                layout: JSON.parse(localStorage.getItem(this.localStorageVarNames.layoutDataName)),
                containerData: JSON.parse(localStorage.getItem(this.localStorageVarNames.displayData)),
                iconPositions: JSON.parse(localStorage.getItem(this.localStorageVarNames.iconData))
            }

            // If parameter contained data, merge
            if(dataToSave) return {...dataToSave, ...data};

            this.downloadData(data); 
        },

        downloadData(dataToSave){
            var data = JSON.stringify(dataToSave , null, 4);

            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(data);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'HomepageLayoutSave.json';
            hiddenElement.click();
        },

    // Imports

        importAll(data){

            this.importLayout(data);
            this.importStoredIcons(data);
            this.importThemes(data);

            // Reset selection
            editVariables.enableResetSelect();
            editVariables.enableResetFlag();
        },

        // Not implemented
        importThemes(data){

            // Check if has data
            if(!data.hasOwnProperty('themes')) return;

            // Display what they are importing...
            
            // Give request to cancel action.
        },

        importStoredIcons(data){
            
            // Check if has property first
            if(!data.hasOwnProperty('icons')) return;
            
            // Display what they are importing...
            
            // Give request to cancel action.

            iconImageStorage.setImportedSVGs(data.icons);

        },

        importLayout(data){

            // Check for any unsaved changes before importing
            // Perhaps show a modal first before any unsaved changes.

            
            // Check if has property first
            if(!(data.hasOwnProperty('layout') || 
                 data.hasOwnProperty('containerData') ||
                 data.hasOwnProperty('iconPositions'))) return;
            
            // Display what they are importing...

            // Load all the data
            layout.initializeData(data.layout);
            containerData.intializeData(data.containerData);
            iconData.initializeData(data.iconPositions);
        },
        
        // -------------------------------------------------------------------------------------------------------

    },
}
</script>

<style scoped>

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