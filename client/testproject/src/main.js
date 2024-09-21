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
        iconDragData: null, // Object, store containerID + IconID
    },
    isInitialize: false,
    isRenderFinalNode: false,
    containerSelectionMode: false,
    parentIDGridUpdate: "",
});

app.mount('#app')
