
<script>

import ModifyButtons from './components/MainButton.vue'
import Window from './components/Window.vue'
import WindowButton from './components/WindowButton.vue'
import PageContainer from './components/Container.vue'
import PageSubDivision from './components/PageSubDivision.vue'

export default{
    name: "App",
    components: {
        ModifyButtons,
        Window,
        WindowButton,
        PageContainer,
        PageSubDivision
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
    methods: {

        // imageLocation(fileName) {
        //     return new URL(`./assets/${fileName}`, import.meta.url).href; 
        // }

        // This opens a blank window with no content.
        openWindowTab(type){
            switch (type.toLowerCase()){
                case "edit":
                {
                    this.toggleTab[0].toggle = !this.toggleTab[0].toggle; 
                    return;
                }
                case "settings":
                {
                    this.toggleTab[1].toggle = !this.toggleTab[1].toggle; 
                    return;
                }
            }
        },

        test(btnType) {
            switch (btnType.toLowerCase()){
                case "layout":
                {
                    this.EditBtns[0].toggle = !this.EditBtns[0].toggle; 
                    return;
                }
                case "containers":
                {
                    this.EditBtns[1].toggle = !this.EditBtns[1].toggle; 
                    return;
                }                
                case "widgets":
                {
                    this.EditBtns[2].toggle = !this.EditBtns[2].toggle; 
                    return;
                }
            }
        },

        selectContainer(){
            this.containerData.isSelectionContainer = true;
        }
    },

}

</script>

<template>
    
    <!-- icon div 
        Make this a loop later-->
    <div class="btnContainer"> 
        <ModifyButtons @open-window-tab="openWindowTab"> </ModifyButtons>
    </div>

    <!-- Windows -->

    <!-- Maybe put window in its own component  -->
    <Window 
        v-if="this.toggleTab[0].toggle"
        title="Edit"
        @close-window="openWindowTab">
        
        <template v-slot:window-content>
            <WindowButton v-for="btn in EditBtns" @click="test(btn.name)"> {{ btn.name }} </WindowButton>
        </template>
    </Window>

    <Window 
        v-if="this.toggleTab[1].toggle"
        title="Settings"
        @close-window="openWindowTab"> 

        <template v-slot:window-content>
            <div> Hello world but settings</div>
        </template>
    </Window>

    <!-- Edit btn windows -->
    <!-- Layout button -->
    <Window
        v-if="this.EditBtns[0].toggle"
        title="Layout"
        @close-window="test">
        <template v-slot:window-content>
            <PageSubDivision
            @Container-Select="selectContainer">
            </PageSubDivision>
        </template>
    </Window>

    <!-- Container button -->
    <Window
        v-if="this.EditBtns[1].toggle"
        title="Containers"
        @close-window="test">
        <template v-slot:window-content>
            <div> Containers!</div>
        </template>
    </Window>

    <Window
        v-if="this.EditBtns[2].toggle"
        title="Widgets"
        @close-window="test">
        <template v-slot:window-content>
            <div> Widgets!</div>
        </template>
    </Window>

    <!-- This has to go last -->
    <div class="main-body">
        <PageContainer :nestLevel="0">
            <template v-slot:container-content> 

                <PageContainer :nestLevel="1">
                    
                </PageContainer>

                <PageContainer :nestLevel="1"></PageContainer>

            </template>
        </PageContainer>
    </div> 
</template>

<!-- 'scoped' means css only applies to this file -->
<style>

.main-body{
    height: 100vh;
    width: 100vw;
}

    .btnContainer{
        position: absolute;
        right: 0;
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
