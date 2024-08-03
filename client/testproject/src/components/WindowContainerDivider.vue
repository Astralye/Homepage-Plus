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
    margin-top: auto;
    margin-bottom: auto;
}

.margin-bottom{
    margin-bottom: 2px
}


.inline{
    float: right;
}

</style>