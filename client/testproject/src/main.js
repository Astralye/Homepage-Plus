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
    edit: {
        enabled: false,
        containerSelected: null // ID of the container selected
    },
    containerSelectionMode: false,
});

// Each container ID is
// PARENTID + "Level + A/B/C/D"
app.config.globalProperties.$ContainerData = ref({
    level: 0,
    divisionType: "Vertical",
    id: "0A",
    NoChildren: 0,
    containerData: [
    ],
});

app.mount('#app')
