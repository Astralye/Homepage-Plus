<template>
    <div 
        class="tmp noselect"
        >
        {{ icon_data.iconID }}
    </div>
</template>

<script>

// This will be drag and drop.
export default {
    props:{
        icon_data: {
            type: Object,
            default: null,
            required: true,
        },
    },
    created(){
        // console.log(this.icon_data);
    },
    methods: {
    }
}
</script>

<style scoped>
@import '../../assets/main.css';

.tmp{
    background-color: rgba(100, 100, 150, 0.4);
    width: 100%;
}

</style>