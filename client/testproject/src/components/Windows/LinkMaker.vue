<template>

    <WindowContainerDivider
    class="container-divider">
        <template #header>
        </template>

        <template #content>
            Image

            <input placeholder="Item name">

            <RangeSlider/>
        </template>
    </WindowContainerDivider>

    <WindowContainerDivider
    class="container-divider">
        <template #header> 
            <h2 class="inline">
                Domain Name
            </h2>
        </template>

        <template #content>
            <div class="custom-select">
                <select>
                  <option value="0"></option>
                  <option value="1">https://Youtube.com</option>
                  <option value="2">https://Facebook.com</option>
                  <option value="3">Add</option>
                </select>
              </div>
        </template>

        <template #tooltip>
            <ToolTip>
                Top level domain of the website. You can store folders based on the domain.
            </ToolTip>
        </template>
    </WindowContainerDivider>

    <WindowContainerDivider
    class="container-divider">
        <template #header> 
            <h3 class="inline">
                Subdirectory
            </h3>
        </template>

        <template #content>
            <TextInput></TextInput>
        </template>

        <template #tooltip>
            <ToolTip>
                Directory after the domain name e.g youtube.com/{XYZ}
                where XYZ is the input
            </ToolTip>
        </template>
    </WindowContainerDivider>

    <WindowContainerDivider
    class="container-divider">
        <template #content>
            Open on new window? 
            <input type="checkbox">

            </input>
        </template>
    </WindowContainerDivider>

    <WindowContainerDivider
    class="container-divider">
        <template #content>
            Saved, scrollable icons
        </template>
    </WindowContainerDivider>
</template>

<script>
import ToolTip from '../Window Components/ToolTip.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import RangeSlider from '../Input Components/RangeSlider.vue';
import TextInput from '../Input Components/TextInput.vue';

export default {
    components: {
        WindowContainerDivider,
        ToolTip,
        RangeSlider,
        TextInput
    }
}

</script>

<style scoped>

</style>