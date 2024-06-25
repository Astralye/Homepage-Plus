
<script>

import Window from './Window.vue'
import WindowButton from './WindowButton.vue'

export default {
    
}
</script>

<!-- The idea is the user can subdivide the page however they like 
    The page would auto contain one large container and this would be able
    To be subdivided, and allowed to create more containers.
    -->
<template>
    <div class="wind-cont">

        <h2>
            Vertical Divisions
        </h2>

        <h3>
            Container Divisons
        </h3>
        <div class="divisionType">

                <!-- Maybe make this into a for loop? -->
            <label for="One" class="selectionContainer division-item"> 

                <div class="selection">
                    <!-- Image --> 
                    <div class="tmpSquare"></div> 
                    <input class="inputSelect" type="radio" id="One" name="Divisions" value="one">
                </div>

                <!-- TODO:
                    Align text with image -->
                <h4 class="Text">
                    One
                </h4>
            </label>
                
            <label for="Two" class="selectionContainer division-item"> 

                <div class="selection">
                    <!-- Image --> 
                    <div class="tmpSquare"></div> 
                    <input class="inputSelect" type="radio" id="Two" name="Divisions" value="two">
                </div>

                <h4 class="Text">

                    Two
                </h4>
            </label>

            <label for="Three" class="selectionContainer division-item"> 

                <div class="selection">
                    <!-- Image --> 
                    <div class="tmpSquare"></div> 
                    <input class="inputSelect" type="radio" id="Three" name="Divisions" value="three">
                </div>

                <h4 class="Text">
                    Three
                </h4>
            </label>

            <label for="Four" class="selectionContainer division-item"> 

                <div class="selection">
                    <!-- Image --> 
                    <div class="tmpSquare"></div> 
                    <input class="inputSelect" type="radio" id="Four" name="Divisions" value="four">
                </div>

                <h4 class="Text">
                    Four
                </h4>
            </label>        

        </div>

        <div>
            <label class="selection fullWidth">
                <input type="checkbox" id="EvenSpacing" name="EvenSpacing" value="EvenSpacing" class="EvenSpacing">

                <h3 for="EvenSpacing">
                    Even Spacing
                </h3>
            </label>
        </div>

        <hr>

        <div>
            % Spacing
            <input 
                type="range"
                min="1" 
                max="100"
                value="50"> 
        </div>
    </div>
</template>

<style scoped>

.EvenSpacing{
    margin-right: 10px;
}

.wind-cont{
    padding: 5px;
}

.fullWidth{
    width: 100%;
}

h4.Text{
    margin-left: 25px;
    font-size: 14px;
}

.division-item{
    margin: 5px;
}

.selection{
    display: inline-flex;
}

.inputSelect{
    margin-left: 10px;
}

.selectionContainer{
    display: grid;
    padding-left: 10px;
    padding-right: 10px;
}

.selectionContainer:nth-last-child(-n+2){
    margin-top: 0;
}

.tmpSquare{
    width: 80px;
    height: 80px;
    background-color: black;
}

.divisionType{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    height: auto;
    width: 90%;

    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    margin-bottom: 10px;

    border-style: solid;
    border-width: 1px;
    border-color: black;
}
</style>