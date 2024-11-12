import { reactive } from "vue";

class WindowHandler{
    constructor(){ this.windows= {
        EditBtns: [
            { name: "edit",     toggle: false },
            { name: "settings", toggle: false },


            { name: "layout",     toggle: false },
            { name: "containers", toggle: false },
            { name: "widgets",    toggle: false },
            { name: "link maker", toggle: false },
            { name: "icon menu",  toggle: false },
            { name: "colour picker", toggle: false },
        ],

    } }

    // Setter

    closeAllWindows(){
        this.windows.EditBtns.forEach(window => {
            window.toggle = false;
        });
    }
    
    toggleWindowStack(toggleItem, itemName){

        if(toggleItem.toggle){
            this.$windowStack.value.push(itemName);
        }else{
            let index = this.$windowStack.value.indexOf(itemName);

            if(index > -1){
                this.$windowStack.value.splice(index, 1);
            }
        }
    }

    focusClickedTab(name){

        // Run code if > 1 element
        if(this.$windowStack.length <= 1) { return; }
    
        let windowString = name.toLowerCase();
        let index = this.$windowStack.value.indexOf(windowString);

        // Run code if not last
        if(index == this.$windowStack.value.length-1) { return; }

        if (index > -1) {
            let tmp = this.$windowStack.value[index];
            this.$windowStack.value.splice(index, 1);
            this.$windowStack.value.push(tmp);
        }
    }




    enableWindow(name){
        let val = this.getEditObj(name);
        if(!val){ return; } // no value

        val.toggle = true;
    }

    disableWindow(name){
        let val = this.getEditObj(name);
        if(!val){ return; } // no value
        if(val.name === "edit"){ this.closeAllWindows(); }

        val.toggle = false;
    }

    // Flip the value.
    toggleWindow(name){
        let val = this.getEditObj(name);
        if(!val){ return; } // no value

        val.toggle = !val.toggle;
    }

    // Getters
    
    getEditValue(input){
        return this.getEditObj(input).toggle;
    }

    getEditObj(input){
        return this.windows.EditBtns[this.getIndex(input)];
    }

    getIndex(input){
        for(let i = 0; i < this.windows.EditBtns.length; i++){
            if(this.windows.EditBtns[i].name === input.toLowerCase()){ return i; }
        }

        console.error(`Error (userWindow.js): Window type, '${type}' does not exist`);
        return null;
    }
}

const windowHandlerInstance = new WindowHandler;
export const windowHandler = reactive(windowHandlerInstance);