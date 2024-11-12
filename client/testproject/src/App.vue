<script>

import Window from './components/Window Components/Window.vue'
import WindowButton from './components/Main/ListButton.vue'
import PageContainer from './components/Main/Container.vue'
import PageSubDivision from './components/Windows/PageSubDivision.vue'
import ContainerContent from './components/Windows/ContainerContent.vue'
import LinkMaker from './components/Windows/LinkMaker.vue'
import Storage from './components/Main/Storage.vue'
import IconButton from './components/Input Components/IconButton.vue'

import { iconImageStorage } from './Data/iconImages'
import SVGHandler from './components/Input Components/SVGHandler.vue'

import { editVariables } from './Data/SettingVariables'
import { windowHandler } from './Data/userWindow'

export default{
    name: "App",
    components: {
        IconButton,
        Window,
        WindowButton,
        PageContainer,
        PageSubDivision,
        ContainerContent,
        LinkMaker,
        Storage,

        SVGHandler
    },
    data() {
        return{
            iconImageStorage,
            editVariables,
            windowHandler,

            // This is used just for iteration. To find the values,
            // See userWindow.js
            EditBtns: [
                "Layout",
                "Containers",
                "Widgets",
                "Link Maker"
            ],

            containerData: {
                isSelectionContainer: false,
                containerData: null
            }
        }
    },
    created(){
        // Resize window
        window.addEventListener("resize", () => { editVariables.enableRecalculation(); });
    },
}

</script>

<template>

    <teleport to="body">        
        <!-- icon div 
            Make this a loop later-->
        <div class="btnContainer"> 
            <IconButton
                message="Edit"
                @click="windowHandler.toggleWindow('edit')"
                >
                <SVGHandler
                    height="50px"
                    width="auto"
                    view_Box="0 -960 960 960"
                    :path_Value="iconImageStorage.getPathData('Pencil')"
                />
            </IconButton>
            
            <IconButton
                message="Settings"
                @click="windowHandler.toggleWindow('settings')">
                <SVGHandler
                    height="50px"
                    width="auto"
                    view_Box="0 -960 960 960"
                    :path_Value="iconImageStorage.getPathData('Gear')"
                />
            </IconButton>
        </div>
    </teleport>

    <!-- Windows -->
    <teleport to="body">

        <Transition name="fade">
            <Window 
                v-if="windowHandler.getEditValue('edit')"
                title="Edit"
                :width="200"
                @focusTab="focusClickedTab">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="35px"
                        width="35px"
                        view_Box="0 -960 960 960"
                        fill_Colour="#CCCCCC"
                        :path_Value="iconImageStorage.getPathData('Pencil')"
                    />
                </template>
                <template v-slot:window-content>
                    <WindowButton 
                        v-for="val in EditBtns" @click="windowHandler.toggleWindow(val)"> 
                        {{ val }} 
                    </WindowButton>
                </template>
            </Window>
        </Transition>

        <Transition name="fade">
            <Window 
                v-if="windowHandler.getEditValue('Settings')"
                title="Settings"
                :width="400"
                @focusTab="focusClickedTab">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="35px"
                        width="auto"
                        view_Box="0 -960 960 960"
                        fill_Colour="#CCCCCC"
                        :path_Value="iconImageStorage.getPathData('Gear')"
                    />
                </template>
                <template v-slot:window-content>
                    <div> Hello world but settings</div>
                </template>
            </Window>
        </Transition>

        <!-- Edit btn windows -->

        <!-- Layout button -->
        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('Layout')"
                title="Layout"
                :width="325"
                @focusTab="focusClickedTab">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="35px"
                        width="auto"
                        view_Box="0 -960 960 960"
                        fill_Colour="#CCCCCC"
                        :path_Value="iconImageStorage.getPathData('Row_Column')"
                    />
                </template>

                <template v-slot:window-content>
                    <PageSubDivision
                        @Container-Select="selectContainer">
                    </PageSubDivision>
                </template>
            </Window>
        </Transition>

        <!-- Container button -->
        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('Containers')"
                title="Containers"
                :width="350"
                @focusTab="focusClickedTab">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="35px"
                        width="auto"
                        view_Box="0 -960 960 960"
                        fill_Colour="#CCCCCC"
                        :path_Value="iconImageStorage.getPathData('Shelf')"
                    />
                </template>
                <template v-slot:window-content>
                    <ContainerContent/>
                </template>
            </Window>
        </Transition>

        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('Widgets')"
                title="Widgets"
                @focusTab="focusClickedTab">

                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="35px"
                        width="auto"
                        view_Box="0 -960 960 960"
                        fill_Colour="#CCCCCC"
                        :path_Value="iconImageStorage.getPathData('Block_TR_Tilt')"
                    />
                </template>
                
                <template v-slot:window-content>
                    <div> Widgets!</div>
                </template>
            </Window>
        </Transition>

        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('Link Maker')"
                title="Link Maker"
                :width="400"
                @focusTab="focusClickedTab">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="35px"
                        width="auto"
                        view_Box="0 -960 960 960"
                        fill_Colour="#CCCCCC"
                        :path_Value="iconImageStorage.getPathData('Bookmark_Plus')"
                    />
                </template>
                <template v-slot:window-content>
                    <LinkMaker> </LinkMaker>
                </template>
            </Window>
        </Transition>
    </teleport>

    <!-- Saving -->

    <Teleport to="body">
        <Storage/>
    </Teleport>

    <!-- Main body content -->

    <div class="main-body">
        <PageContainer :nest_level="0"/>
    </div>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.main-body{
    height: 100vh;
    overflow: hidden;
}

.btnContainer{
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: row ;
    margin: 10px;
    background-color: aliceblue;
    border-radius: 5px;
    border-color: black
}

.iconSize{
    width: 4rem;
}

footer {
    position: absolute;
    bottom: 0;
}
</style>
