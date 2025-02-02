<template>
    <div class="modal-mask">
        <div class="modal-wrapper"
        @mousedown.self="this.$emit('close')">
            <div class="modal-container">
                <slot></slot>
            </div>
        </div>
    </div>
    
</template>

<script>

import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';

export default {
    data(){
        return{
            WindowContainerDivider
        }
    },
    props:{
    },
    created(){
    },
    methods: {
    }
}
</script>

<style scoped>
@import '../../assets/base.css';

.modal-mask {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
}
  
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}
  
  .modal-container {
    width: fit-content;
    max-width: 55vw;
    max-height: 80vh;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: var(--Secondary-background-colour);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}
  
.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-header{
    background-color: var(--Secondary-background-colour);
}
  
.modal-body {
    margin: 20px 0;
}
  
.modal-default-button {
    float: right;
}
  
</style>