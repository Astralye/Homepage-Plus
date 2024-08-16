<template>
    <div class="radio-inputs">
        <template v-for="(text, index) in this.text_array" :key="index">
            <label class="radio">
                <input type="radio" name="radio" :checked="index === 0">
                <div class="name">{{ text }} </div>
            </label>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        // Temporary prop
        text_array: {
            type: Array,
            default: 0,
        },
    }

}
</script>

<style scoped>
/* 
    This is not original 

    Base code taken from Uiverse.io by Yaya12085
    https://uiverse.io/Yaya12085/rude-mouse-79
    
    Have made slight modifications to my own site.
*/

.radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #EEE;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 100%;
    font-size: 16px;
    height: auto;
}

/*
    Single focus two button -> height 60px
    Otherwise: auto
*/

  
.radio-inputs .radio {
    flex: 1 1;
    text-align: center;
}

.radio-inputs .radio input {
    display: none;
}

.radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: .5rem 0;
    color: rgba(51, 65, 85, 1);
    transition: all .1s ease-out;
    height: 100%;
}

.radio-inputs .radio input:checked + .name {
    background-color: silver;
    font-weight: 600;
    height: 100%;
}
</style>