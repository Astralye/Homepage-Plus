<template>

    <!-- Button to open window -->
    <div class="palette-button palette-padding palette-margin"
        @click="m_DisplayWindow = true">
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
                v-if="m_DisplayWindow"
                title="Colour Picker"
                :width="300"
                @close-window="toggleWindow()">
                <!-- @focusTab="focusClickedTab"> -->
                <template #window-icon>
                    <SVGHandler
                        height="35px"
                        width="auto"
                        view_Box="0 -960 960 960"
                        fill_Colour="#CCCCCC"
                        :path_Value="iconImageStorage.getPathData('Bookmark_Plus')"
                    />
                </template>

                <template #window-content>
                <!-- Window content -->

                <WindowContainerDivider>
                    <template #content>

                        <div class="square">
                        
                        </div>


                        Hue = {{ m_HSLValues.Hue }}
                        <RangeSlider
                            :no_Items="300"
                            :start_Index="m_HSLValues.Hue"
                            v-model="m_HSLValues.Hue"
                        />

                        Saturation = {{ m_HSLValues.Saturation }}%
                        <RangeSlider
                            :no_Items="100"
                            :start_Index="m_HSLValues.Saturation"
                            v-model="m_HSLValues.Saturation"
                        />

                        Light = {{ m_HSLValues.Light }}%
                        <RangeSlider
                            :no_Items="100"
                            :start_Index="m_HSLValues.Light"
                            v-model="m_HSLValues.Light"
                        />
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

import Window from '../Window Components/Window.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';

import RangeSlider from './RangeSlider.vue';

export default {
    components:{
        Window,
        WindowContainerDivider,

        RangeSlider,
        SVGHandler,
    },
    emits: [ 'getHEXValues'] ,
    data(){
        return{
            iconImageStorage,

            // Values modified by the vmodel
            // Because they are number, cannot use them directly
            m_HSLValues:{
                Hue: 0,           // 0 - 300
                Saturation: 50, // 0 - 100%
                Light: 50,      // 0 - 100%
            },

            m_HSLCSS:{
                Hue: 0,           // 0 - 300
                Saturation: 0, // 0 - 100%
                Light: 0,      // 0 - 100%
            },


            m_DisplayWindow: false,
        }
    },
    methods:{
        toggleWindow(){
            this.m_DisplayWindow = !this.m_DisplayWindow;
            return this.m_DisplayWindow;
        },
        updateHSLCSSValues(){
            this.m_HSLCSS.Hue = String(this.m_HSLValues.Hue);
            this.m_HSLCSS.Saturation = String(this.m_HSLValues.Saturation) + "%";
            this.m_HSLCSS.Light = String(this.m_HSLValues.Light) + "%"; 
        },
        emitValues(){
            this.$emit('getHEXValues', this.hslToHex(this.m_HSLValues.Hue, this.m_HSLValues.Saturation,  this.m_HSLValues.Light));
        },

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
    },
    mounted(){
        this.updateHSLCSSValues();
    },
    unmounted(){
        this.m_DisplayWindow = false;
    },
    watch:{
        'm_HSLValues': {
            handler(){ 
                this.updateHSLCSSValues();
                this.emitValues();
            },
            deep: true,
        }
    }
}
</script>
<!-- width: v-bind("windowWidth"); -->

<style scoped>

.square{
    display: block;
    width: 100px;
    height: 100px;
    
    background-color: hsl( v-bind("m_HSLCSS.Hue") , v-bind("m_HSLCSS.Saturation"), v-bind("m_HSLCSS.Light"));
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