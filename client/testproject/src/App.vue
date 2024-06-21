
<script>

import ModifyButtons from './components/MainButton.vue'
import Window from './components/Window.vue'

export default{
    name: "App",
    components: {
        ModifyButtons,
        Window
    },
    data() {
        return{
            editIcon: "editing.png",
            settingIcon: "settings.png",

            toggleTab: [
                { type: "edit", toggle: false},
                { type: "settings", toggle: false},
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
    </Window>
    <Window 
        v-if="this.toggleTab[1].toggle"
        title="Settings"
        @close-window="openWindowTab"> 
    </Window>
    
    <footer> 
        This is a footer
    </footer>
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
