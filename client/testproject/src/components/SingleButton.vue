<template>
    <button class="unique-btn">
        <div class="text"> 
            <slot> </slot> 
        </div> 
    </button>
</template>

<!-- 
    This button is supposed to be slightly flashy to make sure it has
    direct attention. 
-->

<style scoped>
@import '../assets/base.css';

.unique-btn{
    display: flex;
    width: auto;
    height: auto;
    border-radius: 5px;
    transition: all 0.1s linear;
    box-sizing: border-box;
}

.unique-btn:not(:last-child){
    margin-bottom: 3px;
}

.unique-btn:hover{
    border: 4px solid var(--Accent-background-colour);
    box-shadow: 0px 0px 10px rgba(0,0,0,0.8);
}

.text{
    margin: 5px;
}

.unique-btn:hover > .btn-text{
    padding-left: 10px;
}
</style>