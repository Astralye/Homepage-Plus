<template>
    <div class="full-width relative"
        >
        <!-- Search input -->
        <input 
            class="dropdown-search"
            type="text"
            v-model="searchQuery"
            @input="enableDropDown"
            @click="enableDropDown"
            @keydown.enter="addValueToArray(searchQuery)"
        >

        <!-- Dropdown input -->
        <TransitionGroup name="dropdown">
            <div class="dropdown-item-wrapper full-width"
                :class="{ 'scroll' : filteredSearch.length > 4}"
                v-if="toggleDropDown"
                >
                <TransitionGroup name="list-item">
                    <div v-for="(item, index) in filteredSearch" :key="index" class="item-container flex">
                        <!-- Selection -->
                        <div class="text noselect"
                            @click.self="selectOption(item)">
                            {{ item }}
                        </div>

                        <div class="delete-button"
                            @click="removeValueFromArray(item)">
                            <SVGHandler
                                width="2em"
                                height="2em"
                                :path_Value="iconImageStorage.getPathData('Cross')"
                                view_Box="0 -960 960 960"
                                fill_Colour="#CCCCCC"
                            />
                        </div>

                    </div>
                </TransitionGroup>
                <!-- Display add item if not currently found in searches -->
                <div v-if="(!(isValueExist(searchQuery)) && searchQuery.length >= 1 )" class="item-container">
                    <div class="text"
                        @click.self="addValueToArray(searchQuery)">
                        Add new item?
                    </div>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script>
import { mouseData } from '../../Data/mouseData.js';

import { iconImageStorage } from '../../Data/iconImages.js';
import SVGHandler from './SVGHandler.vue';

export default {
    data(){
        return{
            mouseData,
            iconImageStorage,

            toggleDropDown: false,
            searchQuery: "",
        }
    },
    components: { SVGHandler },
    props:{
        // Data that is manipulated
        modelValue:{
            type: Array,
            required: true
        },

        // Index to load the value
        Selected_Index:{
            type: Number,
            default: -1,
        },

    },
    emits: [ 'update:modelValue', 'Selected-Value' ],
    unmounted() {
        this.disableDropDown();
    },
    methods:{
        
// Drop down menu toggle
// -----------------------------------------------------------------------------------------------
        toggle(){ this.toggleDropDown = !this.toggleDropDown; },
        enable(){ this.toggleDropDown = true;},
        disable(){ this.toggleDropDown = false;},

        enableDropDown(){
            window.addEventListener('click', this.checkClicked);
            this.enable();
        },

        disableDropDown(){
            window.removeEventListener('click', this.checkClicked);
            this.disable();
        },

// Input validator
// --------------------------------------------------------------------------------------------------
        
        // Input validator
        // taken from https://github.com/miguelmota/is-valid-hostname
        isValidInput(value){
    
            if (typeof value !== 'string') return false

            const validHostnameChars = /^[a-zA-Z0-9-.]{1,253}\.?$/g
            if (!validHostnameChars.test(value)) {
                return false
            }

            if (value.endsWith('.')) {
                value = value.slice(0, value.length - 1)
            }

            if (value.length > 253) {
                return false
            }

            const labels = value.split('.')

            const isValid = labels.every(function (label) {
                const validLabelChars = /^([a-zA-Z0-9-]+)$/g

                const validLabel = (
                validLabelChars.test(label) &&
                label.length < 64 &&
                !label.startsWith('-') &&
                !label.endsWith('-')
                )

                return validLabel
            })

            return isValid
        },

        isValueExist(queryValue){
            for(let i = 0; i < this.modelValue.length; i++){
                if(this.modelValue[i] === queryValue.toLowerCase()){
                    return true;
                }
            }

            return false;
        },

// Modal modification
// ---------------------------------------------------------------------------------

        // Sets the value of the search and emits the query to parent.
        selectOption(item){
            this.searchQuery = item;
            this.emitQuery();
            this.disable();
        },

        // Validates query before insertion
        addValueToArray(query){
            
            if(this.isValueExist(query)){ this.selectOption(query); return};
            if(!this.isValidInput(query)) return;

            this.modelValue.push(query.toLowerCase());
            this.updateModel();
            this.selectOption(query);
        },

        // Searches if item exist, if so remove from array.
        removeValueFromArray(item){

            // If value does not exist, no requirement to check for valid index.
            if(!this.isValueExist(item)) return;
            if(!this.isValidInput(item)) return;

            const index = this.modelValue.indexOf(item);
            
            this.modelValue.splice(index, 1);
            this.updateModel();

            this.searchQuery = "";
            this.emitQuery();
        },

        // check if element click was within container
        checkClicked(e){
            if (!this.$el.contains(e.target)) {
                this.disableDropDown();
            }
        },


// Emitter
// ------------------------------------------------------------------------------------------------------

        updateModel(){ this.$emit('update:modelValue', this.modelValue); },
        emitQuery(){ this.$emit('Selected-Value', this.searchQuery); },

// ------------------------------------------------------------------------------------------------------
    },
    computed:{
        // Searches letter by letter
        filteredSearch(){
            if(this.searchQuery === ""){ return this.modelValue; }

            // Filters based on user input
            return this.modelValue.filter(
                query => {
                    return query.toLowerCase()
                                .replace(/\s+/g, "")
                                .includes(this.searchQuery.toLowerCase().replace(/\s+/g, ""))
                }
            );
        }
    },

    watch:{
        Selected_Index(index){ 
            if(index < 0){ return; }
            this.searchQuery = this.modelValue[index];
         }
    }
}
</script>

<style scoped>
@import '../../assets/main.css';

.list-item-enter-active,
.list-item-leave-active {
    transition: all 0.1s ease;
}
.list-item-enter-from,
.list-item-leave-to {
    opacity: 0;
    transform: translateY(5px);
}

.dropdown-enter-active,
.dropdown-leave-active {
    clip: rect(auto, auto, 10rem, auto);
    transition: clip 150ms ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
    clip: rect(auto, auto, 0, auto);
}

.flex{
    display: flex;
}

.delete-button{
    height: 100%;

    position: relative;
    transition: all ease-in-out 0.2s;
    right: 0;
}

.delete-button:hover{
    background-color: var(--Secondary-background-colour);
}

.full-width{
    width: 100%;
}

.relative{
    position: relative;
}

.scroll{
    overflow-y: scroll;
}

.dropdown-item-wrapper{
    background-color: var(--Secondary-background-colour);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    max-height: 150px;

    box-sizing: content-box;
    position: absolute;

    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.4);
}

.item-container:not(:last-of-type){
    border-bottom: 2px solid black;
}

.text{
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    padding-left: 5px;
    margin: auto 0;

    transition: all ease-in-out 0.2s;
    border-radius: 5px;
}

.text:hover{
    background-color: var(--Secondary-background-colour);
    cursor: pointer;
}

.item-container{
    box-sizing: content-box;
    height: 2em;
    padding: 2px 0;
    margin: 0px 0.5em;
    justify-content: space-between;
    display: flex;
}

.dropdown-selection{
    width: 100%;
    background-color: brown;
    display: block;
    position: relative;
}

.dropdown-search:focus{
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.dropdown-search {
    width: 100%;
    height: 30px;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid lightgrey;
    outline: none;

    transition: all linear 0.1s;
}

/*
.dropdown:focus{

}
*/
</style>