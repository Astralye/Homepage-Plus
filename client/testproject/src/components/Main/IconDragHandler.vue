<!-- 
    This file is responsible for icon dragging CSS.

    Used a component to avoid repeating code within Grid Layout and List layout.
-->

<template>
    <!-- Visible icon that follows mouse -->


    <Teleport to="body">
        <Transition name="icon-success">

            <!-- Wrapper for both icon and list -->
            <!-- This is used the main render -->
            <div class="drag-container-wrapper"
                ref="drag-wrapper"
                v-show="dragAndDrop.isSavedIcon(m_iconIndex, component_ID)"
                
                :class="{ 'grid-transform' : dragAndDrop.isHoverGrid, }"
            >

                <div class="drag-container"
                    :class="{
                        'grid-display' : dragAndDrop.isHoverGrid,
                        'list-display' : !dragAndDrop.isHoverGrid,
                }">
                    <SVGHandler
                        :fill_Colour="dragAndDrop.iconColour"
                        :path_Value="dragAndDrop.iconImage"
                        :height="dragAndDrop.iconSize"
                        :width="dragAndDrop.iconSize"
                        :view_Box="dragAndDrop.viewBox"
                    />
                        
                    <div v-if="!dragAndDrop.isHoverGrid"
                        class="text">
                        {{ m_stringText }}
                    </div>

                </div>
            </div>
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
            m_isHoverGrid: false,
            m_stringText: "",
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
        dragDropSetup(event, index, iconData, contType, text){
            this.m_iconIndex = index; 
            this.m_stringText = iconData.iconString;

            dragAndDrop.setContainerOrigin(this.component_ID);
            dragAndDrop.setIconRef(this.$refs["drag-wrapper"]);
            dragAndDrop.initDragDrop(event, index, iconData.iconID, this.component_ID, contType);
        },
    },
}
</script>

<style scoped>

/*
    Naming convention for changing CSS found in dragDrop.js

    {grid/list}-type-{success/cancel} , -enter/leave-active is the transition values
*/

/*
    Grids
*/

.grid-type-success-enter-active{
    animation: grow 1000ms ease-out;
    transition: opacity 50ms ease-in;
}

.grid-type-success-leave-active{ 
    animation: grow 1000ms reverse ease-out;
    transition: opacity 50ms ease-in;
}

.icon-success-enter-active {
    animation: grow 200ms ease-out;
}

.icon-success-leave-active {
    animation: grow 200ms reverse ease-out;
}

/*
    List
*/


@keyframes grow {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.5);
    }
}

/*
    Grids
*/

.drag-container-wrapper{
    pointer-events: none;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */

    position: absolute;
    z-index: 20;
}

.drag-container{
    position: relative;
    display: flex;
    flex-direction: row;
}

/*

    Variable CSS for dragging elements

*/

.grid-transform{
    transform: scale(1.5);
}

.grid-display{
    background-color: rgba(0, 0, 0, 0.26);
    transition: background-color ease-out 200ms;

}

.list-display{
    background-color: rgba(255, 255, 255, 0.5);
    transition: background-color ease-out 200ms;
}

.text{
    text-align: center;
}

</style>