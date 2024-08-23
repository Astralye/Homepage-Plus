<script>

import IconButton from '../Input Components/IconButton.vue'

export default{
    name: "MainBtn",
    components: {
        IconButton
    },
    emits: [
        'openWindowTab'
    ],
    data() {
        return{
            editIcon: "editing.png",
            settingIcon: "settings.png"
        }
    },
    methods: {
        imageLocation(fileName) {
            return new URL(`${fileName}`, "http://localhost:5173/src/assets/").href; 
        },
    }
}
</script>

<template>

<IconButton
    message="Edit"
    :icon="imageLocation(editIcon)"
    @click="this.$emit('openWindowTab','edit')"
    >
</IconButton>

<IconButton
    message="Settings"
    :icon="imageLocation(settingIcon)"
    @click="this.$emit('openWindowTab','settings')"
    > 
</IconButton>

</template>

<style>

</style>