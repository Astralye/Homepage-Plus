<template>
    <div class="tab-main">
        <button
            v-for="tab in tab_Array"
            :key="tab"
            :class="['tab-button', { active: currentTab === tab }]"
            @click="currentTab = tab"
            >
        {{ tab }}
        </button>
        
        <div class="tab-border">
            <!-- Ensures values are kept -->     
            <KeepAlive> 
                <component :is="switchComponents" class="tab"></component>
            </KeepAlive>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { markRaw } from "vue";

export default {
    props: {
        tab_Array: {
            type: Array,
            default: [],
            required: true
        },
        folder_Name:{
            type: String,
            default: "",
            required: true
        }
    },
    data(){
        return{
            currentTab: '',

            loadedComponents: [] // Loaded dynamically 
        }
    },
    created(){
        this.currentTab = this.tab_Array[0];
        this.initComponents();
    },
    methods: {
        initComponents(){
            for(let i = 0; i < this.tab_Array.length; i++){
                this.loadedComponents.push(
                    {
                        component: markRaw(defineAsyncComponent(() => import(`./${this.folder_Name}/${this.tab_Array[i]}.vue`))),
                        name: this.tab_Array[i]
                    }
                );
            }
        },
    },

    computed: {
        switchComponents(){
            for(let i = 0; i < this.loadedComponents.length; i++){
                if(this.loadedComponents[i].name === this.currentTab){
                    return this.loadedComponents[i].component;
                }
            };

            // Not found, should not happen in theory.
            return null;
        }
    }
}
</script>

<style scoped>
@import '../../assets/base.css';

.tab-border{
    border: 2px solid var(--Accent-background-colour);
    border-radius: 5px;
}

.tab-button {
    padding: 6px 10px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border: 1px solid #ccc;
    cursor: pointer;
    background: #f0f0f0;
    margin-bottom: -1px;
    margin-right: -1px;
  }

.tab-main{
    width: 100%;
}

</style>