<template>
    <div>
        <div 
            class="toolTipIcon" 
            @mouseenter.self="mouseHoverHold"
            @mouseleave.self="closeToolTipWindow">
            <p class="centerText pt-serif-bold-italic">i</p>
        </div>
        
        <!-- 
            This component is purely for the icon, and hovering functions
            NOTHING ELSE -->

        <!-- 
        Because this is teleported and disabled with v-show, i could try and re-use this 
        by re-running some code, changing the text and position.
        This means I don't have to keep an instance of N tooltip windows

        This means the tooltip should be stored elsewhere, in its own component,
        and not here.
        If I then store it in 'App', I can just pass the description as a prop.
        
        I could then have a global variable to determine to switch it on.
        This current component can be used to show the tooltip using a global variable
        This would also determine the tooltip position on the mouse.

        30/07/24
        -->
        
        <Teleport to="body">
        <div v-show="this.m_hover"
            class='toolTipWindow'
            ref="toolTipContainer">
            <slot></slot>            
        </div>
        </Teleport>
    </div>
</template>

<script>
export default {
    data() {
        return{
            m_hover: false,
            m_hoverHold: false,
        }
    },
    methods: {
        mouseHoverHold: function ( event ){
            this.m_hoverHold = true;
            setTimeout( () => { 
                if(this.m_hoverHold)
                {this.wrapper(event)} 
            }, 400);

        },

        wrapper(event){
            let height = 50;
            
            this.$refs.toolTipContainer.style.top = event.clientY - height + "px"
            this.$refs.toolTipContainer.style.left = event.clientX + "px";
            this.openToolTipWindow();
        },
        
        openToolTipWindow(){
            this.m_hover = true;
        },
        closeToolTipWindow(){
            this.m_hoverHold = false;
            this.m_hover = false;
        }
    }
}
</script>

<!-- 
TODO:
    I realised I can make a tooltip without js.
    I will try refactor this some other time
-->

<style scoped>

.icon-center{
    margin-top: auto;
    margin-bottom: auto;
}

.pt-serif-bold-italic {
    font-family: "PT Serif", serif;
    font-weight: 700;
    font-style: italic;
  }

.toolTipWindow{
    width: 200px;
    height: 50px;
    background-color: grey;
    z-index: 20;
    position: absolute;

    border-radius: 3px;
    border-color: black;
}

.centerText{
    text-align: center;
}

.toolTipIcon{
    background: #3167cc;
    width: 25px;
    height: 25px;
    border: 2px solid #0f367d;
    border-radius: 50%;
}
</style>