<!-- 

    This requires a certain v-model to work:

    Model array of buttons:
    [
    
    { id: "" , selected: }
    { id: "" , selected: }
    ...

    ]

-->
<script>
export default {
    data() {
        return{
            m_SelectedIndex: -1
        }
    },

    props: {
        enable_Radio:{
            type: Boolean,
            default: false,
        },
    },
    props: ['modelValue'],
    emits: [ 'update:modelValue', 'clickEvent' ],

    // This needs to be as generalizable as it can be so that it can be used anywhere
    methods: {

        // Disable all but re-enable the used value.
        clickSelection(index){
            if(this.m_SelectedIndex === index){ return; }
            this.m_SelectedIndex = index;
            this.emitValue(index);    // To update modal value
            
            // Emits to parent the ID of selected modal
            this.$emit('clickEvent', this.modelValue[index].id); 
        },

        // Creates a copy and resets everything
        emitValue(index){
            if(!this.modelValue) return;
            let cpy = this.modelValue;

            // Resets all in the array
            cpy.forEach(el => { el.selected = false; });

            // Re-enable selected
            if(index >= 0) { cpy[index].selected = true; } 
            this.$emit('update:modelValue', cpy);
        },
    },
    watch: {
        // resets if disabled
        'enable_Radio'(val){ if(!val){ this.emitValue(-1); } }
    }
}
</script>

<template>
    <div class="radio-inputs">
        <template v-for="(object, index) in modelValue" :key="index">

            <!-- Label -->
            <label 
                class="radio"
                :class="{
                    'pointer' : enable_Radio,
                    'not-allowed' : !enable_Radio,                    
                }"
                :for="object.id"
                @click=" (enable_Radio) ? clickSelection(index) : null" >
                
                <input 
                    type="radio" 
                    :name="object.id"
                    :checked="object.selected"
                >

                <div class="name">{{ object.id }} </div>
            </label>
        </template>
    </div>

</template>

<style scoped>

.pointer{
    cursor: pointer;
}

.not-allowed{
    cursor: not-allowed;
}

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