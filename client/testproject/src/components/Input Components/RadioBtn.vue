<script>
export default {
    data() {
        return{
            m_ParentVariableData: null,
            m_functions: {},
            m_cursor: "not-allowed",
        }
    },
    /*
        IMPORTANT
        -----------------------------------------------------------------------------------------------------
        Read before manipulating and or using the radio button.

        To ensure reusability, this has a specific architecture.
        This has dependencies on the PARENT component:

        E.g This component is expected to be placed in another component to manipulate the data
            and allow radio buttons to modify and update values.

        If you require to global variables, you need to add extra code.

        REQUIREMENTS:        
        > This is placed in a parent container
        > A parent to contain a selected state 
        _______________________________________
            state_name: Array
                [
                    {
                        index: Number,
                        id: String,
                        selected: Boolean,
                    }
                    ...
                ]
            }

        > Prop data MUST be structured as such:
            That means only two functions are allowed, 
            One for the checked and clicked condition.

        > fncName MUST be a parent function that returns a | boolean |
        _______________________________________________
            
            checkedFncDetails
            {
                fncName: ""
                parameterType: index / object / id 
            }
            clickedFncDetails{
                fncName: ""
                parameterType: index / object / id 
            }
        
        Therefore the prop values are:
        a. Parent component variable needed to modify (String)
        b. Function name suggested from 2.

    */
    props: {
        parent_Variable_String: {
            type: String,
            default: "",
            required: true,
        },
        parent_Fnc_Data: {
            type: Object,
            default: {},
            required: true,
        },
        enable_Radio:{
            type: Object,
            default: null,
        }
    },
    created() {
        if(this.$parent.$parent[this.parent_Fnc_Data.checkedFncDetails.fncName] === undefined ||
        this.$parent.$parent[this.parent_Fnc_Data.clickedFncDetails.fncName] === undefined) { 
            console.warn(`ERROR (RadioBtn.vue): There is no parent function named '${this.parent_Fnc_Data}'`);
            return;
        }
        
        this.m_ParentVariableData = this.$parent.$parent.$data[this.parent_Variable_String];
        // Runs the parent function of the prop name to return an object
        this.m_functions = this.parent_Fnc_Data;
        this.checkEnabled();
    },
    // This needs to be as generalizable as it can be so that it can be used anywhere
    methods: {
        checkEnabled(){ this.cursor = (this.enable_Radio === null) ? "not-allowed" : "pointer"; },

        runParentFunction(index, object, type){
            const checkedFnc = (type === "click") ? this.m_functions.clickedFncDetails : this.m_functions.checkedFncDetails;
            var result;
            
            if(checkedFnc === undefined) {
                console.warn(`ERROR (RadioBtn.vue): Function does not exist.`);                
            }

            if(!(checkedFnc.parameterType === "index" || checkedFnc.parameterType === "object" || checkedFnc.parameterType === "id" )){
                console.warn(`ERROR (RadioBtn.vue): Parameter Type undefined, '${checkedFnc.parameterType}'`);
                return;
            }

            
            // Runs the parent function with the correct parameter
            switch(checkedFnc.parameterType){
                case "index":{
                    result = this.$parent.$parent[checkedFnc.fncName](index);
                    break;
                }
                case "object":{
                    result = this.$parent.$parent[checkedFnc.fncName](object);
                    break;
                }
                case "id":{
                    result = this.$parent.$parent[checkedFnc.fncName](object.id);
                    break;
                }
            }

            return result;
        }
    },
    watch: { 'enable_Radio'(){ this.checkEnabled(); } }
}
</script>

<template>
    <div class="radio-inputs">
        <template v-for="(object, index) in this.m_ParentVariableData" :key="index">
            <label 
                class="radio"
                :style="{ 'cursor': cursor }"
                :for="this.m_ParentVariableData[index].id"
                @click="this.runParentFunction(index, object, 'click')">
                
                <input 
                    type="radio" 
                    :name="this.parent_Variable_String"
                    :checked="this.runParentFunction(index, object, 'checked')"
                >

                <div class="name">{{ object.id }} </div>
            </label>
        </template>
    </div>
</template>

<style scoped>

/* 

    Base code taken from Uiverse.io by Yaya12085
    https://uiverse.io/Yaya12085/rude-mouse-79
    
    Have made slight modifications to my own site.
*/

.radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #EEE;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 100%;
    font-size: 16px;
    height: auto;
}

/*
    Todo: 

    Single focus two button -> height 60px
    Otherwise: auto
*/

  
.radio-inputs .radio {
    flex: 1 1;
    text-align: center;
}

.radio-inputs .radio input {
    display: none;
}

.radio-inputs .radio .name {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: .5rem 0;
    color: rgba(51, 65, 85, 1);
    transition: all .1s ease-out;
    height: 100%;
}

.radio-inputs .radio input:checked + .name {
    background-color: silver;
    font-weight: 600;
    height: 100%;
}
</style>