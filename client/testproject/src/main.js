import './assets/main.css'

import { createApp } from 'vue'
import { ref } from 'vue'
import App from './App.vue'

const app = createApp(App);

// app.config.globalProperties is a global variable
// the next value is the name of the variable
    
app.config.globalProperties.$windowStack = ref([]);
app.config.globalProperties.$GlobalStates = ref( {
    edit: {
        enabled: false,
        containerSelected: null, // ID of the container selected
        windowSize: {
            width: 0,
            height: 0,
        }
    },
    clickLoad: false,
    containerSelectionMode: false
});

// Each container ID is
// PARENTID + "Level + A/B/C/D"
app.config.globalProperties.$ContainerData = ref({
    level: 0,
    divisionType: "Vertical",
    id: "0A",
    NoChildren: 0,
    siblings: 0,
    evenSplit: true,
    unevenFRData: "",
    containerData: [
    ],
});

app.mount('#app')
