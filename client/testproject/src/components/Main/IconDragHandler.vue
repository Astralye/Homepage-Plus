<!-- 
    This file is responsible for icon dragging CSS.

    Used a component to avoid repeating code within Grid Layout and List layout.
-->

<template>
    <!-- Visible icon that follows mouse -->
    <Teleport to="body">
        <Transition :name="dragAndDrop.transitionName">

            <!-- Wrapper for both icon and list -->
            <!-- This is used the main render -->
            <div class="drag-container-wrapper"
                ref="drag-wrapper"
                v-show="show || isDisplay"

                :class="{ 'grid-transform' : dragAndDrop.isHoverGrid,   
                }"
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
                        
                    <div v-if="dragAndDrop.isHoverList"
                        class="text prevent-overflow">
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
            m_stringText: "",
            show: false,
        }
    },
    methods:{
        
        // Setup for the components
        // This is done here because it uses the ref of the SVG which is not available
        // in the parent that it is used in. 
        dragDropSetup(event, index, iconData, contType){

            // Initialize variables for drag and drop start
            dragAndDrop.initVariables(iconData.iconID, this.component_ID, contType);
            
            this.m_iconIndex = index; 
            this.m_stringText = iconData.iconString;
            
            // Displays the icon for a frame, but it is invisible, 
            // Required to find bounding box.
            this.show = true; 
            
            // When bounding boxes has been initialized
            this.$nextTick( () => {
                this.show = false;

                // Set the new ref value
                dragAndDrop.setDragWrapperRef(this.$refs["drag-wrapper"]);

                // Prevents the old transition from rendering. 
                dragAndDrop.setVisibility("hidden"); 

                // Start the drag and drop functionality
                dragAndDrop.initDragDrop(event, index, contType);
            });
        },
    },
    computed:{
        isDisplay(){
            return dragAndDrop.isSavedIcon(this.m_iconIndex, this.component_ID)
        }
    }
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
    animation: grow 200ms ease-out;
}

.grid-type-success-leave-active{ 
    animation: grow 200ms reverse ease-out;
}


.list-type-success-enter-active,
.list-type-success-leave-active {
  transition: opacity 50ms ease-out;
}

.list-type-success-enter-from,
.list-type-success-leave-to {
  opacity: 0;
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
    transition: width ease-out 500ms;
}

.list-display{
    background-color: rgba(255, 255, 255, 0.5);
    transition: width ease-out 500ms;
}

.text{
    text-align: center;
}

</style>