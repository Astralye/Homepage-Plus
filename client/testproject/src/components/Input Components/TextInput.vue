<template>
    <div>
        <input 
            class="input" 
            type="text" 
            :placeholder="placeholder_text"

            :value="modelValue" 
            @input="$emit('update:modelValue', $event.target.value)">
    </div>
</template>

<script>
    export default {
        props:{
            placeholder_text: String,
            modelValue: String,
        },
    }
</script>

<style scoped>
/* From Uiverse.io by ErzenXz */ 
.input {
    width: 100%;
    height: 30px;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid lightgrey;
    outline: none;
    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: 0px 0px 20px -20px;
}

.input:hover {
    border: 2px solid lightgrey;
    box-shadow: 0px 0px 20px -6px;
}

.input:active {
    transform: scale(0.98);
    box-shadow: 0px 0px 20px -3px;
}

.input:focus {
    border: 2px solid grey;
}
</style>