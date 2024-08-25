<template>
    <div class="modal-mask">
        <div class="modal-wrapper"
        @mousedown.self="this.$emit('close')">
            <div class="modal-container">
                <div class="modal-header">
                    <h1>
                        <slot name="header"></slot>
                    </h1>
                </div>

                <div class="modal-body">
                    <slot name="body">
                        default body
                    </slot>
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                        default footer
                    </slot>
                    <button class="modal-default-button" @click="$emit('accept')">
                        OK
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
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
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
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