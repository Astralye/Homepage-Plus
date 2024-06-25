<script>
    export default {
        props: {
            btnFunction: {
                type: Function,
                required: true
            }
        }
    }
</script>

<template>
    <button class="wind-button">
        <span class="btn-text"> <slot> </slot> </span>
    </button>
</template>

<style scoped>

.wind-button{
    display:flex;
    width: 100%;
    height: 2.5rem;
    margin-top: auto;
    margin-bottom: auto;
    padding-left: 1em;
    padding-right: 1em;
}

.wind-button:not(:last-child){
    border-width: 2px;
    border-color: black;
}

.btn-text{
    font-size: 18px;
    margin-top: auto;
    margin-bottom: auto;
}

</style>