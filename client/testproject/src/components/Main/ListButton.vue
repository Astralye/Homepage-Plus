<template>
    <button class="list-button">
        <h2 class="btn-text">  <slot> </slot> </h2>
    </button>
</template>

<style scoped>
@import '../../assets/base.css';
.list-button{
    display: flex;
    width: 100%;
    height: 2rem;
    border-width: 0;
    border-radius: 3px;
    transition: all 0.2s ease-in-out;
}

.list-button:not(:last-child){
    margin-bottom: 3px;
}

.list-button:hover{
    background: var(--Hover-colour);
    border-color: black;
}

.btn-text{
    margin: auto 0;
    color: var(--color-heading);
    transition: all 0.2s ease-in-out
}

.list-button:hover > .btn-text{
    padding-left: 10px;
}

</style>