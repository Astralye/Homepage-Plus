<template>

    <!-- Button to open window -->
    <div class="palette-button palette-padding palette-margin"
        @click="windowHandler.toggleWindow('colour picker')">
        <SVGHandler
            view_Box="0 -960 960 960"
            height="100%"
            width="100%"
            fill_Colour="#E8EAED"
            :path_Value="iconImageStorage.getPathData('Colour_Palette')"
            >
            
        </SVGHandler>
    </div>
    
    <!-- Colour picker window -->
    <teleport to="body">
        <Transition name="fade">
            <Window
                v-if="windowHandler.getEditValue('colour picker')"
                title="Colour Picker"
                :width="350">
                <template #window-icon>
                    <SVGHandler
                        height="35px"
                        width="auto"
                        view_Box="0 -960 960 960"
                        fill_Colour="#CCCCCC"
                        :path_Value="iconImageStorage.getPathData('Colour_Palette')"
                    />
                </template>

                <template #window-content>
                <!-- Window content -->

                <WindowContainerDivider>
                    <template #content>

                        <!-- Display colour and value input -->
                        <div class="flex"
                            @mouseup="enableHexUpdate"> 
                            <div class="width-half half-item-margin">
                                <div class="square"
                                    :style="{ 'background-color' : m_HSLString }"
                                > </div>
                            </div>

                            <div class="width-half half-item-margin">
                                <p>Hex:</p>
                                <TextInput
                                    class="text-input-spacing"
                                    placeholder_text="Hex Value"
                                    :max_length="7"
                                    v-model="m_HexValue"/>
                                <p>HSL</p>
                                <TextInput
                                    placeholder_text="HSL Value"
                                    v-model="m_HSLString"/>
                            </div>
                        </div>

                        <!-- Colour queue -->
                        <div class="flex flex-space">
                            <template v-for="(item, index) in colourQueue.maxSize" :key="index">
                                <div
                                    class="Queue-Box"
                                    :style="{ 'background-color': colourQueue.getColour(index) }"
                                    @click="loadColour(index)"
                                >
                                </div>
                            </template>
                        </div>
                            
                        <p> Hue = {{ m_HSLValues.Hue }} </p>
                        <RangeSlider
                            :no_Items="300"
                            :start_Index="m_HSLValues.Hue"
                            v-model="m_HSLValues.Hue"

                            @mousedown="disableTextUpdate"
                            @mouseup="enableTextUpdate"
                        />

                        <p> Saturation = {{ m_HSLValues.Saturation }}% </p>

                        <RangeSlider
                            :no_Items="100"
                            :start_Index="m_HSLValues.Saturation"
                            v-model="m_HSLValues.Saturation"

                            @mousedown="disableTextUpdate"
                            @mouseup="enableTextUpdate"
                        />

                        <p> Light = {{ m_HSLValues.Light }}% </p>

                        <RangeSlider
                            :no_Items="100"
                            :start_Index="m_HSLValues.Light"
                            v-model="m_HSLValues.Light"

                            @mousedown="disableTextUpdate"
                            @mouseup="enableTextUpdate"
                        />

                        <div class="flex end">
                            <SingleButton
                            @click="saveColour"
                            m_IconString="Save"
                            >
                                Save Colour
                            </SingleButton>
                        </div>
                    </template>
                </WindowContainerDivider>
                </template>
            </Window>
        </Transition>
    </teleport>

</template>

<script>
import SVGHandler from './SVGHandler.vue';
import { iconImageStorage } from '../../Data/iconImages';
import { colourQueue } from '../../Data/savedColours';

import Window from '../Window Components/Window.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import { windowHandler } from '../../Data/userWindow';

import SingleButton from './SingleButton.vue';

import TextInput from './TextInput.vue';
import RangeSlider from './RangeSlider.vue';

export default {
    components:{
        Window,
        WindowContainerDivider,
        TextInput,

        SingleButton,

        RangeSlider,
        SVGHandler,
    },
    props: {
        loaded_Data: {
            type: String,
            default: null
        }
    },
    emits: [ 'setColour'] ,
    data(){
        return{
            iconImageStorage,
            colourQueue,
            windowHandler,

            // Values modified by the vmodel
            // Because they are number, cannot use them directly
            m_HSLValues:{
                Hue: 0,           // 0 - 300
                Saturation: 0, // 0 - 100%
                Light: 0,      // 0 - 100%
            },

            m_HSLCSS:{
                Hue: 0,           // 0 - 300
                Saturation: 0, // 0 - 100%
                Light: 0,      // 0 - 100%
            },

            m_HexValue: "#000000",
            m_HSLString: "",

            isUpdateString: true,
        }
    },
    methods:{

        saveColour(){
            colourQueue.addData(this.m_HexValue);
            this.emitSave();
        },

// Emitter
// -----------------------------------------------------------------------------------------------

        emitSave() { this.$emit('setColour',    this.m_HexValue); },

// Math
// -----------------------------------------------------------------------------------------------

        clamp(number, min, max){
            return Math.max(min, Math.min(number, max));
        },


// Updaters
// --------------------------------------------------------------------------------------------------

        // After clicking the previous colour
        loadColour(index){
            let value = colourQueue.getColour(index);
            if(!value){ return; }

            this.m_HexValue = value;
            this.updateHSLCSSValues();
        },

        // update HSL CSS
        updateHSLCSSValues(){
            let hue = String(this.m_HSLValues.Hue);
            let saturation = String(this.m_HSLValues.Saturation) + "%";
            let light = String(this.m_HSLValues.Light) + "%"; 

            this.m_HSLString = `hsl( ${hue}, ${saturation}, ${light} )`;
        },

        // update HSL slider values
        updateHSLSlider(val){
            let values = val.replace(/[^\d,]/g, '').split(',');

            this.setHSL(this.clamp(values[0], 0, 300),
                        this.clamp(values[1], 0, 100),
                        this.clamp(values[2], 0, 100));
        },

        // update hex string from HSL slider
        updateHexString(){
            this.m_HexValue = this.hslToHex(this.m_HSLValues.Hue, this.m_HSLValues.Saturation,  this.m_HSLValues.Light);
        },

        setHSL(h,s,l){
            this.m_HSLValues.Hue = h;
            this.m_HSLValues.Saturation = s;
            this.m_HSLValues.Light = l;
        },

        // Check if the hex value is valid
        userHexParser(hexValue){
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
            if(!result){ return; } // null only if values exceed 255 in hex

            const { h, s, l } = this.hexToHSL(hexValue);
            this.setHSL(h, s, l);
            this.updateHSLCSSValues();
        },

// Conversions
// --------------------------------------------------------------------------------------------------------------------------------------------------

        /*
            These conversions use rounding and floating point numbers.
            Therefore, values can 'drift' if changing only a single value

            However, this is a minor issue and does not break the code.
        */

        // Code taken from https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
        hslToHex(h, s, l) {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
            };
            return `#${f(0)}${f(8)}${f(4)}`;  
        },

        // Code taken from https://stackoverflow.com/questions/62390243/java-script-how-can-i-pull-the-hsl-value-when-a-colour-is-selected-from-input-t
        hexToHSL(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            let r = parseInt(result[1], 16);
            let g = parseInt(result[2], 16);
            let b = parseInt(result[3], 16);

            r /= 255, g /= 255, b /= 255;
            let max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max == min){
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                
                h /= 6;
            }

            h = Math.round(h*360);
            s = Math.round(s*100);
            l = Math.round(l*100);

            return { h, s, l };
        },
    
// Boolean
// --------------------------------------------------------------------------------------------------------------------------------------------------
        
        /*
            Both the HSL sliders and Hex text both modify the string
            However, HSL modifies the hex, which runs the watcher.
            This disables the HSL slider to run the hex watcher 
        */
        disableTextUpdate(){
            this.isUpdateString = false;
        },

        enableTextUpdate(){
            this.isUpdateString = true;
        },

        loadIconColourData(){
            this.m_HexValue = this.loaded_Data;
        }

    },
    created(){
        this.loadIconColourData();
        this.updateHSLCSSValues();
        this.setHSL(this.hexToHSL(this.m_HexValue));
    },
    unmounted(){
        windowHandler.disableWindow('colour picker');
    },
    watch:{
        'loaded_Data'(){
            this.loadIconColourData();
            this.updateHSLCSSValues();
        },
        'm_HSLValues': {
            handler(){
                this.updateHSLCSSValues();
                this.updateHexString();
            },
            deep: true,
        },
        'm_HexValue'(val){
            if(!this.isUpdateString){ return; } // Only the user input string hex should be watched. 
            if(val.length != 7)   { return; } // Requires length of 7, # and 3x 2 hex values per channnel

            this.userHexParser(val);
        },
        'm_HSLString'(val){
            if(!this.isUpdateString){ return; } // Only the user input string hex should be watched. 
            if(!val){ return; }
            this.updateHSLSlider(val);
        }
    }
}
</script>
<!-- width: v-bind("windowWidth"); -->

<style scoped>

.flex-space{
    justify-content: space-between;
}

.Queue-Box{
    border: 2px solid black;
    border-radius: 5px;

    width: 30px;
    height: 30px;
}

.right{
    right: 0;
}

.end{
    justify-content: flex-end;
}


.text-input-spacing:not(:last-child){
    margin-bottom: 5px;
}

.flex{
    display: flex;
}

.width-half{
    width: 50%;
}

.half-item-margin{
    margin: 0.25em;
}

.square{
    box-sizing: border-box;
    border: 3px solid black;
    border-radius: 10px;
    aspect-ratio: 1;
}

.palette-padding{
    padding: 0.1em;
}

.palette-button{
    background-color: brown;
    width: 50px;
    height: 50px;

    border: 3px solid black;
    border-radius: 10px;
}
</style>