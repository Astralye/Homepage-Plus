<template>
    <button class="wind-button">
        <h2 class="btn-text"> <slot> </slot> </h2>
    </button>
</template>

<style scoped>
@import '../assets/base.css';

.wind-button{
    display: flex;
    width: 100%;
    height: 2rem;
    border-width: 0;
    border-radius: 2px;
}

.wind-button:not(:last-child){
    margin-bottom: 3px;
}

.wind-button:hover{
    border: 5px;
    background: var(--Select-colour);
    border-width: 2px;
    border-color: black;
}

.wind-button:active{
    background-color: var(--Hover-colour);
}

.btn-text{
    margin: auto 0;
    color: var(--color-heading);
}

</style>