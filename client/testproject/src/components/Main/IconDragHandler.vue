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
                :class="{
                    'grid-display' : dragAndDrop.isHoverGrid,
                    'list-display' : dragAndDrop.isHoverList,
                }"
                >
                <div class="drag-container"
                >
                    <div
                        :class="{
                            'icon-spacing' : dragAndDrop.isHoverList
                        }">
                        <SVGHandler
                            :fill_Colour="dragAndDrop.iconColour"
                            :path_Value="dragAndDrop.iconImage"
                            :height="dragAndDrop.iconSize"
                            :width="dragAndDrop.iconSize"
                            :view_Box="dragAndDrop.viewBox"
                        />
                    </div>

                    <Transition :name="transitionName">
                        <div v-show="show || dragAndDrop.isHoverList"
                            ref="text-ref"
                            class="icon-center text prevent-overflow">
                            {{ m_stringText }}
                        </div>
                    </Transition>
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
            
            this.m_stringText = iconData.iconString;

            // truncate if longer than 30 chars
            if(this.m_stringText.length >= 30){
                this.m_stringText = 
                    this.m_stringText.substring(0,27)
                    + "...";
            }

            this.m_iconIndex = index; 
            
            // Displays the icon for a frame, but it is invisible, 
            // Required to find bounding box.
            this.show = true;
            
            // When bounding boxes has been initialized
            
            this.$nextTick( () => {
                this.show = false;

                // Set the new ref value
                dragAndDrop.setDragWrapperRef(this.$refs["drag-wrapper"]);
                dragAndDrop.setTextRef(this.$refs["text-ref"]);

                dragAndDrop.setVisibility("hidden"); 

                // Prevents the old transition from rendering. 

                // Start the drag and drop functionality
                dragAndDrop.initDragDrop(event, index, contType);
            });
        },
    },
    computed:{
        isDisplay(){
            return dragAndDrop.isSavedIcon(this.m_iconIndex, this.component_ID)
        },
        transitionName(){
            return (this.show) ? "" : "slide-text";
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


@keyframes grow {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.5);
    }
}

/*
    List
*/

.list-type-success-enter-active{
    animation: grow 200ms ease-out;
}

.list-type-success-leave-active{
    animation: grow 200ms reverse ease-out;
}

.icon-spacing{
    padding-right: 0.5em;
}

.text{
    font-size: 12px;
    text-wrap: nowrap;
    max-width: v-bind("dragAndDrop.textWidth");
}   


.slide-text-enter-active,
.slide-text-leave-active {
    transition: all 200ms ease-out;
}

.slide-text-enter-from,
.slide-text-leave-to {
    max-width: 0;
    opacity: 0;
}

/*
padding-right: 0.75em;
    Base CSS
*/

.drag-container-wrapper{
    cursor: grabbing; /* Does not work when pointer events is none */
    position: absolute;

    pointer-events: none;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    
    z-index: 20;

    transform: scale(1.5);

    background-color: rgba(255, 255, 255, 0.178);
    padding: 0.5em;
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.336);
}

.drag-container{
    position: relative;
    display: flex;

    flex-direction: row;
}

</style>