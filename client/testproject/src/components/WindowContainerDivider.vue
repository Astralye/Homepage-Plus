<template>
    <div class="container-divider">
        <div class="center-align margin-bottom">
            <slot name="header"></slot>
            <slot name="tooltip"></slot>
        </div>
        
        <slot name="content">

        </slot>            
    </div>
</template>

<style scoped>

.center-align{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.margin-bottom{
    margin-bottom: 2px
}

</style>