<!-- 
    This file is responsible for icon dragging CSS.

    Used a component to avoid repeating code within Grid Layout and List layout.
-->

<template>
    <!-- Visible icon that follows mouse -->
    <Teleport to="body">
        <Transition :name="dragAndDrop.transitionName">
            <SVGHandler
                v-show="dragAndDrop.isSavedIcon(m_iconIndex, component_ID)"
                ref="svgRef"
                class="icon-drag-effect"
                
                :class="{
                    'classA' : dragAndDrop.isHoverGrid,
                    'classB' : !dragAndDrop.isHoverGrid,
                }"
                
                :ref_Value="'draggingIcon'"

                :fill_Colour="dragAndDrop.iconColour"
                :path_Value="dragAndDrop.iconImage"
                :height="dragAndDrop.iconSize"
                :width="dragAndDrop.iconSize"
                :view_Box="dragAndDrop.viewBox"
            />
        </Transition>
    </Teleport>

</template>

<script>

import { dragAndDrop } from '../../Data/dragDrop';
import SVGHandler from '../Input Components/SVGHandler.vue';

export default {
    props:{
        component_ID: {
            type: String,
            required: true
        },
    },
    components:{
        SVGHandler
    },
    data(){
        return{
            dragAndDrop,

            m_iconIndex: -1,
            m_isHoverGrid: false
        }
    },
    methods:{

        /*
            Initializer for drag and drop event
            Timeout makes the user wait a certain time before dragging.
            Also defines what makes a drag and a click
        */

        // Setup for the components
        // This is done here because it uses the ref of the SVG which is not available
        // in the parent that it is used in. 
        dragDropSetup(event, index, iconID, contType){
            this.m_iconIndex = index; 
        
            dragAndDrop.setContainerOrigin(this.component_ID);
            dragAndDrop.setIconRef(this.$refs["svgRef"].$refs);
            dragAndDrop.initDragDrop(event, index, iconID, this.component_ID, contType);
        },
    },
}
</script>

<style scoped>

/* Transitions */

.icon-success-enter-active {
    animation: grow 200ms ease-out;
    transition: opacity 50ms ease-in;
}

.icon-success-leave-active {
    animation: grow 200ms reverse ease-out;
    transition: opacity 50ms ease-in;
}

.icon-cancel-leave-active {
    transition: opacity 50ms ease-in;
}

@keyframes grow {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.5);
    }
}

.icon-drag-effect{
    pointer-events: none;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */

    position: absolute;
    transform: scale(1.5);
    z-index: 20;
}

/*

    Variable CSS for dragging elements

*/

.classA{
    background-color: rgba(0, 0, 0, 0.5);
}

.classB{
    background-color: rgba(255, 255, 255, 0.5);
}

</style>