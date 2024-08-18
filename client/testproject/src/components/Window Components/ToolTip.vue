<template>
    <div class="tooltip-container">
        <span class="tooltip">
            <slot>
            </slot>
        </span>
    </div>
</template>

<!-- 
TODO:
    I realised I can make a tooltip without js.
    I will try refactor this some other time
-->

<style scoped>

.pt-serif-bold-italic {
    font-family: "PT Serif", serif;
    font-weight: 700;
    font-style: italic;
}

.tooltip-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s;
    background-color: #3167cc;
    padding: 11px 11px;
    border-radius: 12px;
    border: 2px solid #0f367d;
}

.tooltip {
    position: absolute;
    padding: 0.3em 0.6em;
    bottom: 150%;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s linear 0.3s;
    
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    color: rgb(34, 34, 34);

    width: 200px;
}

.tooltip-container:hover .tooltip {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}


</style>