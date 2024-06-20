<script>

import IconButton from './IconButton.vue'

export default{
    name: "MainBtn",
    components: {
        IconButton
    },
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

        // This opens a blank window with no content.
        helloBtn() {
            this.$emit('openWindowTab',"edit");
        },
        helloBtn2() {
            this.$emit('openWindowTab',"settings");
        }
    }
}
</script>

<template>

<IconButton
    message="Edit"
    :icon="imageLocation(editIcon)"
    :fnc="helloBtn"
    > 
</IconButton>

<IconButton
    message="Settings"
    :icon="imageLocation(settingIcon)"
    :fnc="helloBtn2"
    > 
</IconButton>

</template>

<style>

</style>