<script>

import ModifyButtons from './components/Main/MainButton.vue'
import Window from './components/Window Components/Window.vue'
import WindowButton from './components/Main/ListButton.vue'
import PageContainer from './components/Main/Container.vue'
import PageSubDivision from './components/Windows/PageSubDivision.vue'
import ContainerContent from './components/Windows/ContainerContent.vue'
import LinkMaker from './components/Windows/LinkMaker.vue'
import Storage from './components/Main/Storage.vue'

export default{
    name: "App",
    components: {
        ModifyButtons,
        Window,
        WindowButton,
        PageContainer,
        PageSubDivision,
        ContainerContent,
        LinkMaker,
        Storage
    },
    data() {
        return{
            editIcon: "editing.png",
            settingIcon: "settings.png",

            toggleTab: [
                { type: "edit", toggle: false},
                { type: "settings", toggle: false},
            ],

            EditBtns: [
                { name: "Layout", toggle: false },
                { name: "Containers", toggle: false },
                { name: "Widgets", toggle: false},
                { name: "Link Maker", toggle: false},
            ],

            containerData: {
                isSelectionContainer: false,
                containerData: null
            }
        }
    },
    created(){
        
        // Load User data
        this.loadData();

        // Resize window
        window.addEventListener("resize", () => {
            this.$GlobalStates.value.edit.windowSize.height = window.innerHeight;
            this.$GlobalStates.value.edit.windowSize.width = window.innerWidth;
        });
    },
    methods: {
        loadData(){
            const containerData = JSON.parse(localStorage.getItem("containerData"));
            
            if(containerData === null) {
                console.log ("No data!"); 
                return;
            }
            this.$ContainerData.value = containerData;
        },

        // imageLocation(fileName) {
        //     return new URL(`./assets/${fileName}`, import.meta.url).href; 
        // }

        // This opens a blank window with no content.
        openWindowTab(type){

            let windowType;
            let windowString = type.toLowerCase();

            switch (windowString){
                case "edit":
                {
                    windowType = this.toggleTab[0];
                    this.$GlobalStates.value.edit.enabled = !this.$GlobalStates.value.edit.enabled;
                    break;
                }
                case "settings":
                {
                    windowType = this.toggleTab[1];
                    break;
                }
            }

            windowType.toggle = !windowType.toggle;
            this.toggleWindowStack(windowType, windowString);
        },

        toggleWindowStack(toggleItem, itemName){

            if(toggleItem.toggle){
                this.$windowStack.value.push(itemName);
            }else{
                let index = this.$windowStack.value.indexOf(itemName);

                if(index > -1){
                    this.$windowStack.value.splice(index, 1);
                }
            }
        },

        // TODO
        // Maybe combined this with the function above
        test(btnType) {

            let windowType;
            let windowString = btnType.toLowerCase();

            switch (windowString){
                case "layout":
                {
                    windowType = this.EditBtns[0];
                    break;
                }
                case "containers":
                {
                    windowType = this.EditBtns[1]; 
                    break;
                }                
                case "widgets":
                {
                    windowType = this.EditBtns[2]; 
                    break;
                }
                case "link maker":
                {
                    windowType = this.EditBtns[3]; 
                    break;
                }
            }

            windowType.toggle = !windowType.toggle;
            this.toggleWindowStack(windowType, windowString);
        },

        selectContainer(){
            this.containerData.isSelectionContainer = true;
        },
        focusClickedTab(name){

            // Run code if > 1 element
            if(this.$windowStack.length <= 1) { return; }
        
            let windowString = name.toLowerCase();
            let index = this.$windowStack.value.indexOf(windowString);

            // Run code if not last
            if(index == this.$windowStack.value.length-1) { return; }

            if (index > -1) {
                let tmp = this.$windowStack.value[index];
                this.$windowStack.value.splice(index, 1);
                this.$windowStack.value.push(tmp);
            }
        },
    }
}

</script>

<template>

    <teleport to="body">        
        <!-- icon div 
            Make this a loop later-->
        <div class="btnContainer"> 
            <ModifyButtons @open-window-tab="openWindowTab"> </ModifyButtons>
        </div>
    </teleport>

    <!-- Windows -->
    <teleport to="body">

        <Transition name="fade">
            <Window 
                v-if="this.toggleTab[0].toggle"
                title="Edit"
                :width="200"
                @close-window="openWindowTab"
                @focusTab="focusClickedTab">
                <template v-slot:window-icon>
                    <svg class="margin-y-auto" xmlns="http://www.w3.org/2000/svg" height="35px" width="auto" viewBox="0 -960 960 960" fill="#CCCCCC">
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                    </svg>
                </template>
                <template v-slot:window-content>
                    <WindowButton v-for="btn in EditBtns" @click="test(btn.name)"> {{ btn.name }} </WindowButton>
                </template>
            </Window>
        </Transition>

        <Transition name="fade">
            <Window 
                v-show="this.toggleTab[1].toggle"
                title="Settings"
                :width="400"
                @close-window="openWindowTab"
                @focusTab="focusClickedTab">
                <template v-slot:window-icon>
                    <svg class="margin-y-auto" xmlns="http://www.w3.org/2000/svg" height="35px" width="auto" viewBox="0 -960 960 960" fill="#CCCCCC">
                        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                    </svg> 
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
                v-show="this.EditBtns[0].toggle"
                title="Layout"
                :width="325"
                @close-window="test"
                @focusTab="focusClickedTab">
                <template v-slot:window-icon>
                    <svg class="margin-y-auto" xmlns="http://www.w3.org/2000/svg" height="35px" width="auto" viewBox="0 -960 960 960" fill="#CCCCCC">
                        <path d="M360-240h440v-107H360v107ZM160-613h120v-107H160v107Zm0 187h120v-107H160v107Zm0 186h120v-107H160v107Zm200-186h440v-107H360v107Zm0-187h440v-107H360v107ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z"/>
                    </svg>
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
                v-show="this.EditBtns[1].toggle"
                title="Containers"
                :width="350"
                @close-window="test"
                @focusTab="focusClickedTab">
                <template v-slot:window-icon>
                    <svg class="margin-y-auto" xmlns="http://www.w3.org/2000/svg" height="35px" width="auto" viewBox="0 -960 960 960" fill="#CCCCCC">
                        <path d="M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Zm160-320h80v-80h-80v80Zm160 320h80v-80h-80v80ZM360-520h80-80Zm160 320h80-80Z"/>
                    </svg>
                </template>
                <template v-slot:window-content>
                    <ContainerContent/>
                </template>
            </Window>
        </Transition>

        <Transition name="fade">
            <Window
                v-show="this.EditBtns[2].toggle"
                title="Widgets"
                @close-window="test"
                @focusTab="focusClickedTab">

                <template v-slot:window-icon>
                    <svg class="margin-y-auto" xmlns="http://www.w3.org/2000/svg" height="35px"  width="auto" viewBox="0 -960 960 960" fill="#CCCCCC">
                        <path d="M674.67-457.33 457.33-674.67 674.67-892 892-674.67 674.67-457.33ZM120-532v-307.33h307.33V-532H120Zm412 412v-307.33h307.33V-120H532Zm-412 0v-307.33h307.33V-120H120Zm66.67-478.67h174v-174h-174v174Zm490.33 50 123.67-123.66L677-796 553.33-672.33 677-548.67Zm-78.33 362h174v-174h-174v174Zm-412 0h174v-174h-174v174Zm174-412Zm192.66-73.66ZM360.67-360.67Zm238 0Z"/>
                    </svg>
                </template>
                
                <template v-slot:window-content>
                    <div> Widgets!</div>
                </template>
            </Window>
        </Transition>

        <Transition name="fade">
            <Window
                v-show="this.EditBtns[3].toggle"
                title="Link Maker"
                @close-window="test"
                @focusTab="focusClickedTab">
                <template v-slot:window-icon>
                    <svg class="margin-y-auto" xmlns="http://www.w3.org/2000/svg" height="35px"  width="auto" viewBox="0 -960 960 960" fill="#CCCCCC">
                        <path d="M200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Zm400 160v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/>
                    </svg>
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

<!-- 'scoped' means css only applies to this file -->
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
