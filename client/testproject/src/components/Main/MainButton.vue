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
    @click="helloBtn"
    >
</IconButton>

<IconButton
    message="Settings"
    :icon="imageLocation(settingIcon)"
    @click="helloBtn2"
    > 
</IconButton>

</template>

<style>

</style>