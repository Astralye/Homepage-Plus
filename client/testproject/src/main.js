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

app.mount('#app')
