<!-- 
    This is the menu that appears when a right clicked.

-->

<template>
<div class="context-menu-container"
    :style="{
        'left' : (contextMenu.x + 'px'),
        'top' : (contextMenu.y + 'px')
    }">

    <!-- Maybe the contents would change depending on whatever was hovering it..? -->
    <div class="context-wrapper">
        <!-- Show icons in the top part -->
        <h3> 
            Context menu!
        </h3>
        
        <!-- Sub menus -->
        Open
        <br>
        Copy
        <br>
        Paste ?
        <br>
        New --
        <br>
        Delete
        <hr>
        
        <!-- Edit -->

        Change icon
        <br>
        Rename icon
        <br>
        Move Container
        <hr>

        Open Settings
        <br>
        <!-- <ul>
            <li>
                Copy
            </li>
            <li>
                Paste
            </li>
            <li>
                Delete
            </li>
        </ul> -->
        <!-- Show text with icons next -->
    </div>
</div>
</template>

<script>
import { contextMenu } from '../../Data/multiSelect';

export default {
    data(){
        return{
            contextMenu,
        }
    }
}
</script>

<style scoped>

.context-wrapper{
    position: relative;
    height: auto;

    border-radius: 1em;
    padding: 0.75em;
}

.context-menu-container{
    width: 200px;
    height: fit-content;
    
    background-color: var(--Secondary-background-colour);
    border: solid var(--WindowBorder-Thickness) var(--Secondary-background-colour);
    border-radius: 0.5em;
    box-shadow: var(--box-shadow);

    position: absolute;

    z-index: 20;
}

</style>