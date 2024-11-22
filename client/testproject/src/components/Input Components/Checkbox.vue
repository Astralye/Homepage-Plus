<template>
    <div>
        <label class="cyberpunk-checkbox-label">
        <input 
            type="checkbox" 
            class="cyberpunk-checkbox"
            v-model="check"
            @change="$emit('onChange', check)"
            :checked="checkValue"
        >
        <p> {{ text }} </p>
        </label>
    </div>
</template>

<script>

export default {
    props: ['checkValue', 'text'],
    emits: [ 'onChange'],
}
</script>

<style scoped>
/* 
    From Uiverse.io by adamgiebl
    https://uiverse.io/adamgiebl/curly-lizard-40
*/ 
.cyberpunk-checkbox {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-radius: 5px;
    background-color: transparent;
    display: inline-block;
    position: relative;
    margin-right: 10px;
    cursor: pointer;
}

.cyberpunk-checkbox:before {
    content: "";
    background-color: #6cd1f0;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 10px;
    height: 10px;
    border-radius: 3px;
    transition: all 200ms ease-in-out;
}

.cyberpunk-checkbox:checked:before {
    transform: translate(-50%, -50%) scale(1);
}

.cyberpunk-checkbox-label {
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
}
</style>