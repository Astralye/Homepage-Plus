<!-- 

    This gets created from App.vue using v-if whenever a click event is noticed on a valid location,
    so that the mount method is able to run every initialize.

    This file is responsible for displaying and ... calculating? 
    the user multidrag select.

-->

<template>
    <Transition name="fade">
        <div
            ref="multidrag-ref"
            v-if="multiSelect.isEnabled && (multiSelect.width > 5 || multiSelect.height > 5)"
            class="container"
            :class="{
                'transform-inverse' : (multiSelect.isInverseX || multiSelect.isInverseY),
            }"
            :style="{
                'left' : (multiSelect.x + 'px'),
                'top' : (multiSelect.y + 'px'),
                'height' : m_Height,
                'width'  : m_Width,
            }">

            <div v-if="m_Debug">
                <!-- Temporary -->
                Top left: {{  multiSelect.TLBounds.x }} , {{  multiSelect.TLBounds.y }}
                <br>
                Max Bounds: {{  multiSelect.TLBounds.maxX}} , {{  multiSelect.TLBounds.maxY }}
            </div>
        </div>
    </Transition>
</template>

<script>
import { mouseData } from '../../Data/mouseData';
import { editVariables } from '../../Data/SettingVariables';
import { multiSelect } from '../../Data/multiSelect';

export default {
    data(){
        return{
            editVariables,
            multiSelect,
            mouseData,

            m_StartedDrag: false,
            m_InverseWidth: 0,
            m_InverseHeight: 0,

            m_Debug: false,
        }
    },
    methods:{
        setTLBounds(){
            if(!this.$refs['multidrag-ref']) return;

            let dims = this.$refs['multidrag-ref'].getBoundingClientRect();
            multiSelect.setTopLeftCoord(dims.x, dims.y);
            multiSelect.setMaxBounds();
        }
    },
    computed:{
        m_Width(){
            let val = multiSelect.width;
            this.m_InverseWidth = (multiSelect.isInverseX) ? -val + "px" : 0;
            this.setTLBounds();
            return val + "px";
        },
        m_Height(){
            let val = multiSelect.height;
            this.m_InverseHeight = (multiSelect.isInverseY) ? -val + "px" : 0;
            this.setTLBounds();
            return val + "px";
        }
    }
}
</script>

<style scoped>

.transform-inverse{
    transform: translate(
        v-bind("m_InverseWidth"),
        v-bind("m_InverseHeight")
    );
}

.container{
    position: absolute;
    
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.568);
    border-radius: 4px;
}

</style>