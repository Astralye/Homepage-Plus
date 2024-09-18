<template>
    <!-- 
     Functionality comes from passing an 
     @click event from the parent container 
     Removes the need to pass a prop
     -->
     <button role="button" class="button-name">
         <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000">
             <path d="M186.67-186.67V-120q-27.5 0-47.09-19.58Q120-159.17 120-186.67h66.67ZM120-283.33V-350h66.67v66.67H120Zm0-163.34v-66.66h66.67v66.66H120ZM120-610v-66.67h66.67V-610H120Zm66.67-163.33H120q0-27.5 19.58-47.09Q159.17-840 186.67-840v66.67ZM283.33-120v-66.67H350V-120h-66.67Zm0-653.33V-840H350v66.67h-66.67ZM446.67-120v-66.67h66.66V-120h-66.66Zm0-653.33V-840h66.66v66.67h-66.66ZM610-120v-66.67h66.67V-120H610Zm0-653.33V-840h66.67v66.67H610Zm163.33 586.66H840q0 27.5-19.58 47.09Q800.83-120 773.33-120v-66.67Zm0-96.66V-350H840v66.67h-66.67Zm0-163.34v-66.66H840v66.66h-66.67Zm0-163.33v-66.67H840V-610h-66.67Zm0-163.33V-840q27.5 0 47.09 19.58Q840-800.83 840-773.33h-66.67Z"/>
        </svg>
        <slot> </slot>
    </button>
</template>

<style>
.single-button-dark{
    color: black;
}
</style>

<style scoped>
@import '../../assets/base.css';

/* 

Credit to Custyyyy on UIVerse
https://uiverse.io/Custyyyy/short-lizard-47

*/ 

.button-name {
    align-items: center;
    appearance: none;
    background-color: #FCFCFD;
    border-radius: 4px;
    border-width: 0;
    box-shadow: rgba(45, 35, 66, 0.2) 0 2px 4px,rgba(45, 35, 66, 0.15) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    font-family: "JetBrains Mono",monospace;
    height: 48px;
    justify-content: center;
    line-height: 1;
    list-style: none;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
    position: relative;
    text-align: left;
    text-decoration: none;
    transition: box-shadow .15s,transform .15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    will-change: box-shadow,transform;
    font-size: 18px;
}

.button-name:focus {
    box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
}

.button-name:hover {
    box-shadow: rgba(45, 35, 66, 0.3) 0 4px 8px, rgba(45, 35, 66, 0.2) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
    transform: translateY(-2px);
}

.button-name:active {
    box-shadow: #D6D6E7 0 3px 7px inset;
    transform: translateY(2px);
}
</style>