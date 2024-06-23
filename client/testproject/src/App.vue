
<script>

import ModifyButtons from './components/MainButton.vue'
import Window from './components/Window.vue'
import WindowButton from './components/WindowButton.vue'

export default{
    name: "App",
    components: {
        ModifyButtons,
        Window,
        WindowButton
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
                { name: "Layout"},
                { name: "Containers"},
                { name: "Folder"},
                { name: "Widgets"}
            ]
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
            <WindowButton v-for="btn in EditBtns"> {{ btn.name }} </WindowButton>
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
    
    <body>
        This is the body
    </body>
    <!-- <footer> 
        This is a footer
    </footer> -->
</template>

<!-- 'scoped' means css only applies to this file -->
<style>
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
