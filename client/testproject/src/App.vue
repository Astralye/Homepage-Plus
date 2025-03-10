<script>
import Window from './components/Window Components/Window.vue'
import WindowButton from './components/Main/ListButton.vue'
import PageContainer from './components/Main/Container.vue'
import Storage from './components/Main/Storage.vue'
import IconButton from './components/Input Components/IconButton.vue'
import SVGHandler from './components/Input Components/SVGHandler.vue'

import { iconImageStorage } from './Data/iconImages'
import { editVariables } from './Data/SettingVariables'
import { windowHandler } from './Data/userWindow'
import { contextMenu } from './Data/multiSelect'
import { themeStorage } from './Data/themeStorage'
import { profileHandler } from './Data/profileHandler'

import WindowContainerDivider from './components/Window Components/WindowContainerDivider.vue'
import Multidrag from './components/Main/Multidrag.vue'
import ContextMenu from './components/Main/ContextMenu.vue'

// Windows
import LinkMaker from './components/Windows/LinkMaker.vue'
import PageSubDivision from './components/Windows/PageSubDivision.vue'
import ContainerContent from './components/Windows/ContainerContent.vue'
import Settings from './components/Windows/Settings.vue'
import ThemeMenu from './components/Windows/ThemeMenu.vue'
import Profiles from './components/Windows/Profiles.vue'

export default{
    name: "App",
    components: {
        WindowContainerDivider,
        ContainerContent,
        PageSubDivision,
        PageContainer,
        WindowButton,
        ContextMenu,
        IconButton,
        Multidrag,
        ThemeMenu,
        LinkMaker,
        Profiles,
        Settings,
        Storage,
        Window,

        SVGHandler
    },
    data() {
        return{
            iconImageStorage,
            profileHandler,
            editVariables,
            windowHandler,
            themeStorage,

            contextMenu,

            // This is used just for iteration. To find the values,
            // See userWindow.js
            EditBtns: [
                "Layout",
                "Containers",
                "Link Maker",
                
                "Appearance",
                // "Widgets",
                "Profiles"
            ],

            containerData: {
                isSelectionContainer: false,
                containerData: null
            },
        }
    },
    created(){
        // Resize window
        window.addEventListener("resize", () => { editVariables.enableRecalculation(); });
    },
    methods:{
        contextHandler(event) {
            if(!editVariables.isEnabledSiteContextMenu) return;
            event.preventDefault();

            contextMenu.enable();
            contextMenu.setStartLocation(event.x, event.y);
        },
        disableContext(){
            contextMenu.disable();
            contextMenu.resetStartLocation();
        }
    }
}

</script>

<template>

    <teleport to="body">

        <div class="btnContainer"> 
            <IconButton
                message="Edit"
                @click="windowHandler.toggleWindow('edit')"
                >
                <SVGHandler
                    height="3em"
                    width="3em"
                    view_Box="0 -960 960 960"
                    :fill_Colour="themeStorage.highContrastColour"
                    :path_Value="iconImageStorage.getPathData('Pencil')"
                />
            </IconButton>
            
            <IconButton
                message="Settings"
                @click="windowHandler.toggleWindow('settings')">
                <SVGHandler
                    height="3em"
                    width="3em"
                    view_Box="0 -960 960 960"
                    :fill_Colour="themeStorage.highContrastColour"
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
                :width="225">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="2em"
                        width="2em"
                        view_Box="0 -960 960 960"
                        :fill_Colour="themeStorage.highContrastColour"
                        :path_Value="iconImageStorage.getPathData('Pencil')"
                    />
                </template>
                <template v-slot:window-content>
                    <WindowContainerDivider>
                        <template #header>
                        </template>
                        <template #content>
                            <WindowButton 
                                v-for="val in EditBtns" @click="windowHandler.toggleWindow(val)"> 
                                {{ val }} 
                            </WindowButton>
                        </template>
                    </WindowContainerDivider>
                </template>
            </Window>
        </Transition>

        <Transition name="fade">
            <Window 
                v-if="windowHandler.getEditValue('Settings')"
                title="Settings"
                :width="450">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="2em"
                        width="2em"
                        view_Box="0 -960 960 960"
                        :fill_Colour="themeStorage.highContrastColour"
                        :path_Value="iconImageStorage.getPathData('Gear')"
                    />
                </template>
                <template v-slot:window-content>
                    <Settings/>
                </template>
            </Window>
        </Transition>

        <!-- Edit btn windows -->

        <!-- Layout button -->
        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('Layout')"
                title="Layout"
                :width="400">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="2em"
                        width="2em"
                        view_Box="0 -960 960 960"
                        :fill_Colour="themeStorage.highContrastColour"
                        :path_Value="iconImageStorage.getPathData('Row_Column')"
                    />
                </template>

                <template v-slot:window-content>
                    <PageSubDivision/>
                </template>
            </Window>
        </Transition>

        <!-- Container button -->
        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('Containers')"
                title="Containers"
                :width="450">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="2em"
                        width="2em"
                        view_Box="0 -960 960 960"
                        :fill_Colour="themeStorage.highContrastColour"
                        :path_Value="iconImageStorage.getPathData('Shelf')"
                    />
                </template>
                <template v-slot:window-content>
                    <ContainerContent/>
                </template>
            </Window>
        </Transition>

        <!-- Widgets -->
        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('Widgets')"
                title="Widgets">

                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="2em"
                        width="2em"
                        view_Box="0 -960 960 960"
                        :fill_Colour="themeStorage.highContrastColour"
                        :path_Value="iconImageStorage.getPathData('Block_TR_Tilt')"
                    />
                </template>
                
                <template v-slot:window-content>
                    <div> Widgets!</div>
                </template>
            </Window>
        </Transition>

        <!-- Link maker -->
        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('Link Maker')"
                title="Link Maker"
                :width="450">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="2em"
                        width="2em"
                        view_Box="0 -960 960 960"
                        :fill_Colour="themeStorage.highContrastColour"
                        :path_Value="iconImageStorage.getPathData('Bookmark_Plus')"
                    />
                </template>
                <template v-slot:window-content>
                    <LinkMaker/>
                </template>
            </Window>
        </Transition>

        <!-- Themes -->
        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('Appearance')"
                title="Appearance"
                :width="450">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="2em"
                        width="2em"
                        view_Box="0 -960 960 960"
                        :fill_Colour="themeStorage.highContrastColour"
                        :path_Value="iconImageStorage.getPathData('Paint_Bucket')"
                    />
                </template>
                <template v-slot:window-content>
                    <ThemeMenu/>
                </template>
            </Window>
        </Transition>

        <!-- Profiles -->
        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('Profiles')"
                title="Profiles"
                :width="500">
                <template v-slot:window-icon>
                    <SVGHandler
                        class="icon-center"
                        height="2em"
                        width="2em"
                        view_Box="0 -960 960 960"
                        :fill_Colour="themeStorage.highContrastColour"
                        :path_Value="iconImageStorage.getPathData('Paint_Bucket')"
                    />
                </template>
                <template v-slot:window-content>
                    <Profiles/>
                </template>
            </Window>
        </Transition>

    </teleport>

    <!-- Saving -->

    <Teleport to="body">
        <Storage/>
    </Teleport>

    <!-- Main body content -->

    <div class="main-body"
        @contextmenu="contextHandler($event)"
        @click="disableContext()">
        <PageContainer 
            :nest_level="0"
            :profileDisplayName="profileHandler.selectedProfile"
        />
    </div>

    <Teleport to="body">
        <Multidrag/>
    </Teleport>

    <Teleport to="body">
        <ContextMenu v-show="contextMenu.isEnabled"/>
    </Teleport>
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

    background-color: var(--Secondary-background-colour);
    border: solid var(--WindowBorder-Thickness) var(--Secondary-background-colour);
    border-radius: var(--WindowBorder-Radius);
    box-shadow: var(--box-shadow);

    box-shadow: 0 0 0.75em rgb(0, 0, 0);
}

.iconSize{
    width: 4rem;
}

footer {
    position: absolute;
    bottom: 0;
}
</style>
