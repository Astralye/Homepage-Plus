<script>
export default{
    props: {
        message: String,
    }
}
</script>

<template>
    <div class="container left-margin">
        <button class="center">
            <slot> </slot>
            <p class="text"> {{ message }} </p>
        </button>
    </div>
</template>

<style scoped>

.text{
    color: var(--vt-c-white-soft);
}

</style>

<style>
button{
    border-width: 0;
    background-color: transparent;
}

.button{
    width: 80px;
    border-width: 0;
    background-color: transparent;
}

button:hover{
    cursor: pointer;
}

.container{
    padding: 5px;
}

.left-margin:not(:first-of-type){
    padding-left: 0;
}

.left-margin:first-of-type{
    padding-right: 0;
}

.center{
    position: relative;
    margin: auto;
}

    
</style>