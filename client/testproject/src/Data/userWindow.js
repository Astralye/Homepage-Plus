import { reactive } from "vue";

import { editVariables } from './SettingVariables.js' // Used to enable and disable edit.

class WindowHandler{
    constructor(){ this.windows= {
        EditBtns: [
            { name: "edit",     toggle: false },
            { name: "settings", toggle: false },


            { name: "layout",     toggle: false },
            { name: "containers", toggle: false },
            { name: "widgets",    toggle: false },
            { name: "link maker", toggle: false },
            { name: "colour picker", toggle: false },
        ],

        windowStack: []
    } }

    // Setter

    closeAllWindows(){
        this.windows.EditBtns.forEach(window => { window.toggle = false; });
        this.windows.windowStack = [];
    }

    // Stack

    moveToTopStack(obj){
        // Only run if length min 2 or value not already the top. 
        if(this.windowStackLength <= 1 || this.windowStack[this.windowStackLength-1] == obj.name){ return; }

        this.checkRemoveStack(obj.name);
        this.checkAddStack(obj.name);
    }


    // Add to stack
    checkAddStack(name){
        // Run code if > 1 element
        if(this.windows.windowStack.length == 0) { 
            this.windows.windowStack.push(name);
            return;
        }
    
        // Skip if value within array
        if(this.getIndexWindowStack(name) >= 0) { return; }
        this.windows.windowStack.push(name);
    }

    // Remove from stack
    checkRemoveStack(name){
        if(this.windows.windowStack.length == 0 ) { return; }
    
        // Find index of the tab
        let index = this.getIndexWindowStack(name);
        this.windows.windowStack.splice(index, 1);
    }


    // Check which function to use
    modifyStack(window){ (window.toggle) ? this.checkAddStack(window.name) : this.checkRemoveStack(window.name); }

    // Value functions

    // Enable or disable Edit menu
    checkIfEdit(obj){ 
        if(obj.name === "edit"){ 
            if(!obj.toggle){ this.closeAllWindows(); }
            editVariables.setEdit(obj.toggle);
        }
    }

    enableWindow(name){
        let val = this.getEditObj(name);
        if(!val){ return; } // no value

        val.toggle = true;
        this.checkIfEdit(val);
        this.modifyStack(val);
    }

    disableWindow(name){
        let val = this.getEditObj(name);
        if(!val){ return; } // no value
        
        val.toggle = false;
        this.checkIfEdit(val);
        this.modifyStack(val);
    }

    // Flip the value.
    toggleWindow(name){
        let val = this.getEditObj(name);
        if(!val){ return; } // no value

        val.toggle = !val.toggle;
        this.checkIfEdit(val);
        this.modifyStack(val);
    }

    // Getters

    getEditValue(input){ return this.getEditObj(input).toggle; }

    // obj of edit button
    getEditObj(input){ return this.windows.EditBtns[this.getIndex(input)]; }

    // index of Edit button,
    getIndex(input){
        for(let i = 0; i < this.windows.EditBtns.length; i++){
            if(this.windows.EditBtns[i].name === input.toLowerCase()){ return i; }
        }

        console.error(`Error (userWindow.js): Window type, '${type}' does not exist`);
        return null;
    }

    getIndexWindowStack(name){ return this.windowStack.indexOf(name.toLowerCase()); }

    // Read only
    get windowStack(){ return this.windows.windowStack; }
    get windowStackLength(){ return this.windows.windowStack.length; }
}

const windowHandlerInstance = new WindowHandler;
export const windowHandler = reactive(windowHandlerInstance);