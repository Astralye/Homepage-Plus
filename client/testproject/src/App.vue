<script>

import ModifyButtons from './components/MainButton.vue'
import Window from './components/Window.vue'
import WindowButton from './components/ListButton.vue'
import PageContainer from './components/Container.vue'
import PageSubDivision from './components/PageSubDivision.vue'
import ContainerContent from './components/ContainerContent.vue'

export default{
    name: "App",
    components: {
        ModifyButtons,
        Window,
        WindowButton,
        PageContainer,
        PageSubDivision,
        ContainerContent
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
                { name: "Widgets", toggle: false}
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
        <div class="btnContainer"> 
            <ModifyButtons @open-window-tab="openWindowTab"> </ModifyButtons>
        </div>
        
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
                width="150"
                @close-window="openWindowTab"
                @focusTab="focusClickedTab">
                <template v-slot:window-content>
                    <WindowButton v-for="btn in EditBtns" @click="test(btn.name)"> {{ btn.name }} </WindowButton>
                </template>
            </Window>
        </Transition>

        <Transition name="fade">
            <Window 
                v-if="this.toggleTab[1].toggle"
                title="Settings"
                @close-window="openWindowTab"
                @focusTab="focusClickedTab">

                <template v-slot:window-content>
                    <div> Hello world but settings</div>
                </template>
            </Window>
        </Transition>

        <!-- Edit btn windows -->

        <!-- 
        TODO
        -----------------
        Standardize the window content
        Currently each window and its contents are styled independently of each other
        And this will make editing, styling alot more painful.

        Please, Future me, just take one day and standardize the stylings, fonts, buttons.
        Into a giant tree of components in which I can just use those instead of thinking about
        the styling for each individual.

        Also, Think about putting the stylings into a global css. Not sure right now, but
        try and make sure I can swap classes. Obviously this uses a function but globally, not 
        that sure.
        
        30/7/24
        
        -->

        <!-- Layout button -->
        <Transition name="fade">
            <Window
                v-if="this.EditBtns[0].toggle"
                title="Layout"
                @close-window="test"
                @focusTab="focusClickedTab">
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
                v-if="this.EditBtns[1].toggle"
                title="Containers"
                @close-window="test"
                @focusTab="focusClickedTab">
                <template v-slot:window-content>
                    <ContainerContent/>
                </template>
            </Window>
        </Transition>

        <Transition name="fade">
            <Window
                v-if="this.EditBtns[2].toggle"
                title="Widgets"
                @close-window="test"
                @focusTab="focusClickedTab">
                <template v-slot:window-content>
                    <div> Widgets!</div>
                </template>
            </Window>
        </Transition>
    </teleport>



    <!-- Main body content -->

    <div class="main-body">
        <PageContainer
            :nest_level="0"/>
    </div>
</template>

<!-- 'scoped' means css only applies to this file -->
<style>

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.main-body{
    height: 100vh;
    width: 100vw;
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
