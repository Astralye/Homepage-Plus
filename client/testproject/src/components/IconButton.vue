<script>
export default{
    props: {
        message: String,
        icon: { String, required: true },
        fnc: { Function, required: true}
    }
}
</script>

<template>
    <div class="container left-margin">
        <button class="center" @click="fnc">
            <img class="iconSize" :src="icon" alt="Image not found">
            <p> {{ message }} </p>
        </button>
    </div>
</template>

<style>

/* Invisible background
    On hover darken.
*/
button{
    width: 80px;
    border: 0;
    background-color: transparent;
}

button:hover{
    background-color: silver;
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

p {
    font-size: 12px;
}
    
</style>