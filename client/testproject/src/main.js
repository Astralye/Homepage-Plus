import './assets/main.css'

import { createApp } from 'vue'
import { ref } from 'vue'
import App from './App.vue'

const app = createApp(App);

// app.config.globalProperties is a global variable
// the next value is the name of the variable

    // For window priority 
    // Window click should bring it forward
    // Using a stack to store the window
    // Position in array determines z-index.
    
app.config.globalProperties.$windowStack = ref([]);
app.config.globalProperties.$GlobalStates = ref( {
    editMode: false,
    containerSelectionMode: false,
});

// Each container ID is
// PARENTID + "Level + A/B/C/D"
app.config.globalProperties.$ContainerData = ref({
    level: 0,
    divisionType: "a",
    id: "0A",
    NoChildren: 2,
    containerData: [
        {
            level: 1,
            divisionType: "b",
            id: "0A1A",
            NoChildren: 2,
            containerData: [
                {
                    level: 2,
                    divisionType: "c",
                    id: "0A1A2A",
                    NoChildren: 0,
                    containerData: []
                },

                {
                    level: 2,
                    divisionType: "d",
                    id: "0A1A2B",
                    NoChildren: 0,
                    containerData: []
                },
            ]
        },
        {
            level: 1,
            divisionType: "e",
            id: "0A1B",
            NoChildren: 1,
            containerData: [
                {
                    level: 2,
                    divisionType: "d",
                    id: "0A1B2A",
                    NoChildren: 0,
                    containerData: []
                },
            ]
        }
    ],
});

app.mount('#app')
