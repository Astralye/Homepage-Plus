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
    margin-left: 1em;
    margin-right: 1em;
    margin-top: 0.5em;
    margin-bottom: 1.5em;
}
.window-content-divider:last-child{
    margin-bottom: 0.5em;
}
</style>

<style scoped>

.center-align{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-margin{
    margin-bottom: 4px;
}

</style>