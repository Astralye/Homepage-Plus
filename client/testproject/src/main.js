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
        },
        dragStepSize: 0.25,
        resetSelect: false,
    },
    isInitialize: false,
    isRenderFinalNode: false,
    containerSelectionMode: false,
});

// Due to watchers and recursive size, variables are split up
// Page layout config. Root container
app.config.globalProperties.$layoutData = ref({

    // Container metadata
    level: 0,
    divisionType: "Vertical",
    id: "0A",
    NoChildren: 0,
    siblings: 0,
    evenSplit: true,
    unevenFRData: "",

    // Child container
    childContainers: [
    ],
});

// Container display config.
// This is built, maintained on runtime if there is not prior saved data for this
app.config.globalProperties.$containerData = ref({});


app.mount('#app')
