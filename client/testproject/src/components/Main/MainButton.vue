<script>

import { iconImageStorage } from '../../Data/iconImages';
import SVGHandler from '../Input Components/SVGHandler.vue';

import IconButton from '../Input Components/IconButton.vue'

export default{
    name: "MainBtn",
    components: {
        IconButton,
        SVGHandler,
    },
    emits: [
        'openWindowTab'
    ],
    data() {
        return{
            iconImageStorage,

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
    @click="this.$emit('openWindowTab','edit')"
    >
    <SVGHandler
        height="50px"
        width="auto"
        view_Box="0 -960 960 960"
        :path_Value="iconImageStorage.getPathData('Pencil')"
    />
</IconButton>

<IconButton
    message="Settings"
    @click="this.$emit('openWindowTab','settings')">
    <SVGHandler
        height="50px"
        width="auto"
        view_Box="0 -960 960 960"
        :path_Value="iconImageStorage.getPathData('Gear')"
    />
</IconButton>

</template>

<style>

</style>