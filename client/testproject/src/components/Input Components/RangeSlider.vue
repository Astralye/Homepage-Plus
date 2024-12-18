<template>
    <div>
        <input type="range"
            min="0"
            :max="m_SliderData.max"
            :step="m_SliderData.stepSize"
            
            :value="modelToScale(modelValue)" 
            @input="computeNewValue($event.target.value)"
            :disabled="!enabled"
            />
        <!--
            list="my-datalist"

            within the input causes weird snapping bugs for the HUE value for 300.
            Snaps to 50, 75 and 100, maybe due to the same ID being used for other sliders.

            No currently documented errors, so will just comment it out.
        -->

        <template v-if="displayCaption">
            <datalist id="my-datalist">
                <template v-for="index in m_SliderData.divisions">
                    <option>{{ caption_Data[index-1] }}</option>
                </template>
            </datalist>
        </template>
    </div>
</template>
<script>
    export default {
        props:{
            modelValue: [Number, String],

            no_Items:{
                type: [Number, String],
                default: 2,
                required: true,
            },
            
            // Array of strings
            caption_Data:{ 
                type: Array,
                default: [],
            },

            start_Index:{
                type: [Number, String],
                default: null
            },

            enabled:{
                type: Boolean,
                default: true,
            }
        },
        emits: [ 'update:modelValue'],
        data(){
            return{
                m_SliderData: {
                    blocks: 0,
                    stepSize: 100,
                    max: 100,
                    divisions: 0,
                },

                sliderData: 0,
                displayCaption: false
            }
        },

        methods: {
            
            initData(){
                (this.caption_Data.length === 0) ? this.initValue() : this.initCategory();
                
                if(!this.start_Index){ this.m_SliderData.value = this.start_Index; }
            },

            initValue(){
                this.m_SliderData.stepSize  = 1;
                this.m_SliderData.divisions = this.no_Items;
                this.m_SliderData.max       = this.no_Items;
            },

            initCategory(){
                this.m_SliderData.divisions = this.caption_Data.length; // V-for becomes buggy if used no_Items prop
                this.m_SliderData.blocks    = this.no_Items - 1;
                this.m_SliderData.stepSize  = Math.round(100 / this.m_SliderData.blocks);
                this.m_SliderData.max       = this.m_SliderData.blocks * this.m_SliderData.stepSize;
            },

            checkDisplayCaption(){
                this.displayCaption = (this.no_Items == this.caption_Data.length && this.caption_Data.length != 0);
            },

            /*
                Update the parent v model depending on its type
                There are two types:
                    1. Category
                    2. Value

                Items based on category (contains caption data), will use the event value as the index
                If value was used, it just uses the index as the v-model data
            */
            valueToIndex(value){
                return value / this.m_SliderData.stepSize;
            },
            
            // Convert modal value to local slider value
            modelToScale(value){
                // If no array data, the value of the modal is the position itself.
                if(!this.displayCaption){ return value; }

                for(var i = 0; i < this.caption_Data.length; i++){
                    if(this.caption_Data[i] === value){ return i * this.m_SliderData.stepSize}
                }
                
                return 0; // If not found
            },

            computeNewValue(value){
                if(!this.displayCaption){ this.$emit('update:modelValue', value); return; }

                let index = this.valueToIndex(value);
                this.$emit('update:modelValue', this.caption_Data[index]);
            }
        },

        created(){
            this.initData();
            this.checkDisplayCaption();
        },
    }
</script>

<style scoped>
datalist{
    --list-length: v-bind("m_SliderData.divisions");
}

input[type=range] + datalist {
    display: flex;
    margin-top: -9px;
}
input[type=range] + datalist option {
    display: inline-block;
    width: calc((100% - 12px) / (var(--list-length) - 1));
    text-align: center;
}
input[type=range] + datalist option:first-child {
    width: calc((100% - 12px) / ((var(--list-length) - 1) * 2) + 6px);
    text-align: left;
}
input[type=range] + datalist option:last-child {
    width: calc((100% - 12px) / ((var(--list-length) - 1) * 2) + 6px);
    text-align: right;
    margin-right: 10px;
}

option{
    font-size: 12px;
}

/*

    Credit to S. Shahriar for the base code
    https://codepen.io/ShadowShahriar/pen/zYPPYrQ

*/
 
 /* === range theme and appearance === */
 input[type="range"] {
    font-size: 1.25rem;
    width: 100%;
    position: relative;
    background: #fff0;
    overflow: hidden;
 }
 
 input[type="range"] {
    color: #ef233c;
    --thumb-height: 1.125em;
    --track-height: 0.125em;
    --track-color: rgba(0, 0, 0, 0.2);
    --brightness-hover: 180%;
    --brightness-down: 80%;
    --clip-edges: 0.125em;
 }
 
 input[type="range"].win10-thumb {
     color: #2b2d42;
 
     --thumb-height: 1.375em;
     --thumb-width: 0.5em;
     --clip-edges: 0.0125em;
 }
 
 @media (prefers-color-scheme: dark) {
     html {
         background-color: #000;
     }
 
     html::before {
         background: radial-gradient(circle at center, #101112, #000);
     }
 
     input[type="range"] {
         color: #f07167;
         --track-color: rgba(255, 255, 255, 0.1);
     }
 
     input[type="range"].win10-thumb {
         color: #3a86ff;
     }
 }
 
 /* === range commons === */
 
 input[type="range"]:active {
     cursor: grabbing;
 }
 
 input[type="range"]:disabled {
     filter: grayscale(1);
     opacity: 0.3;
     cursor: not-allowed;
 }
 
 /* === WebKit specific styles === */
 input[type="range"],
 input[type="range"]::-webkit-slider-runnable-track,
 input[type="range"]::-webkit-slider-thumb {
     -webkit-appearance: none;
     transition: all ease 100ms;
     height: var(--thumb-height);
 }
 
 input[type="range"]::-webkit-slider-runnable-track,
 input[type="range"]::-webkit-slider-thumb {
     position: relative;
 }
 
 input[type="range"]::-webkit-slider-thumb {
     --thumb-radius: calc((var(--thumb-height) * 0.5) - 1px);
     --clip-top: calc((var(--thumb-height) - var(--track-height)) * 0.5 - 0.5px);
     --clip-bottom: calc(var(--thumb-height) - var(--clip-top));
     --clip-further: calc(100% + 1px);
     --box-fill: calc(-100vmax - var(--thumb-width, var(--thumb-height))) 0 0
         100vmax currentColor;
 
     width: var(--thumb-width, var(--thumb-height));
     background: linear-gradient(currentColor 0 0) scroll no-repeat left center /
         50% calc(var(--track-height) + 1px);
     background-color: currentColor;
     box-shadow: var(--box-fill);
     border-radius: var(--thumb-width, var(--thumb-height));
 
     filter: brightness(100%);
     clip-path: polygon(
         100% -1px,
         var(--clip-edges) -1px,
         0 var(--clip-top),
         -100vmax var(--clip-top),
         -100vmax var(--clip-bottom),
         0 var(--clip-bottom),
         var(--clip-edges) 100%,
         var(--clip-further) var(--clip-further)
     );
 }
 
 input[type="range"]:hover::-webkit-slider-thumb {
     filter: brightness(var(--brightness-hover));
     cursor: grab;
 }
 
 input[type="range"]:active::-webkit-slider-thumb {
     filter: brightness(var(--brightness-down));
     cursor: grabbing;
 }
 
 input[type="range"]::-webkit-slider-runnable-track {
     background: linear-gradient(var(--track-color) 0 0) scroll no-repeat center /
         100% calc(var(--track-height) + 1px);
 }
 
 input[type="range"]:disabled::-webkit-slider-thumb {
     cursor: not-allowed;
 }
 
 /* === Firefox specific styles === */
 input[type="range"],
 input[type="range"]::-moz-range-track,
 input[type="range"]::-moz-range-thumb {
     appearance: none;
     transition: all ease 100ms;
     height: var(--thumb-height);
 }
 
 input[type="range"]::-moz-range-track,
 input[type="range"]::-moz-range-thumb,
 input[type="range"]::-moz-range-progress {
     background: #fff0;
 }
 
 input[type="range"]::-moz-range-thumb {
     background: currentColor;
     border: 0;
     width: var(--thumb-width, var(--thumb-height));
     border-radius: var(--thumb-width, var(--thumb-height));
     cursor: grab;
 }
 
 input[type="range"]:active::-moz-range-thumb {
     cursor: grabbing;
 }
 
 input[type="range"]::-moz-range-track {
     width: 100%;
     background: var(--track-color);
 }
 
 input[type="range"]::-moz-range-progress {
     appearance: none;
     background: currentColor;
     transition-delay: 30ms;
 }
 
 input[type="range"]::-moz-range-track,
 input[type="range"]::-moz-range-progress {
     height: calc(var(--track-height) + 1px);
     border-radius: var(--track-height);
 }
 
 input[type="range"]::-moz-range-thumb,
 input[type="range"]::-moz-range-progress {
     filter: brightness(100%);
 }
 
 input[type="range"]:hover::-moz-range-thumb,
 input[type="range"]:hover::-moz-range-progress {
     filter: brightness(var(--brightness-hover));
 }
 
 input[type="range"]:active::-moz-range-thumb,
 input[type="range"]:active::-moz-range-progress {
     filter: brightness(var(--brightness-down));
 }
 
 input[type="range"]:disabled::-moz-range-thumb {
     cursor: not-allowed;
 }
 
</style>