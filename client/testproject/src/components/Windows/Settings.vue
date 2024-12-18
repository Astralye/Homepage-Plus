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
        
                        *Nonfunctional
                        <div class="button-row-align">
                            <SingleButton
                                m_IconString="Download">
                                Import Data
                            </SingleButton>
                            
                            <SingleButton
                                m_IconString="Upload">
                                Export Data
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
                                :view_Box="iconImageStorage.getViewBoxName('Github')"
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

import { editVariables } from '../../Data/SettingVariables';

export default {
    components:{
        WindowContainerDivider,
        SingleButton,
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
            ]
        }
    },
    methods: {

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