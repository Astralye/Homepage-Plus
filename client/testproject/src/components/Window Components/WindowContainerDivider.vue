<template>
    <div class="window-content-divider">
        <div class="center-align header-margin">
            <slot name="header"></slot>
            <slot name="tooltip"></slot>
        </div>
        
        <slot name="content">

        </slot>            
    </div>
</template>

<style>
.window-content-divider{
    margin: 1em 0.5em;
}
</style>

<style scoped>

.center-align{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-margin{
    margin-bottom: 0.25em;
}

</style>