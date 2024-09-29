<template>

    <div>
        <div class="flex flex-space">
            <SingleButton
            class="flex"
            @click="generateIcon">
                <h2 class="single-button-dark"> New icon </h2>
            </SingleButton>
            <SingleButton
            class="flex"
            @click="deleteIcon">
                <h2 class="single-button-dark"> Delete icon </h2>
            </SingleButton>
        </div>
        <WindowContainerDivider
            class="container-divider">
                <template #header> 
                    <h2 class="inline">
                        Saved Icons
                    </h2>
                </template>
        
                <template #content>
                    <div class="saved-grid width-full grid"
                    @mouseup="checkDropIcon">
                        <template v-for="(item, index) in m_Rows * m_Columns" :key="index">
                            <div class="saved-icons grid-item">
        
                                <!-- For rendering any icons saved -->
                                <template v-if="RenderIcon(index)"></template> 
                            </div>
                        </template>
                    </div>
                </template>
            </WindowContainerDivider>
    </div>
        <!-- Grid -->
    <div class="flex">
        <div class="width-half">
            <WindowContainerDivider
            class="container-divider">
                <template #header>
                    <h2 class="inline">
                        Displayed icon
                    </h2>
                </template>
        
                <template #content>
                    <div class="image-placeholder"
                    @click="console.log('Click! select icon.')"/>
                    <!-- <RangeSlider/> -->
                </template>
            </WindowContainerDivider>
        </div>

        <div class="width-half">
            <WindowContainerDivider
            class="container-divider">
                <template #header>
                    <h2 class="inline">
                        Name
                    </h2>
                </template>
        
                <template #content>
                    <input placeholder="Item name">
                </template>
            </WindowContainerDivider>
    
            <WindowContainerDivider
            class="container-divider">
                <template #header>
                    <h2 class="inline">
                        Icon Size
                    </h2>
                </template>
        
                <template #content>
                    <RangeSlider
                    :m_function="tmp"
                    :input_Data="['50','75', '100', '125']"/>
                </template>

                <template #tooltip>
                    <ToolTip> Size in px of the icon</ToolTip>
                </template>
            </WindowContainerDivider>

        </div>

    </div>

    <WindowContainerDivider
    class="container-divider">
        <template #header> 
            <h2 class="inline">
                Domain Name
            </h2>
        </template>

        <template #content>
            <div class="custom-select width-full">
                <select class="width-full">
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
</template>

<script>
import ToolTip from '../Window Components/ToolTip.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import RangeSlider from '../Input Components/RangeSlider.vue';
import TextInput from '../Input Components/TextInput.vue';
import SingleButton from '../Input Components/SingleButton.vue';

export default {
    components: {
        WindowContainerDivider,
        ToolTip,
        RangeSlider,
        TextInput,
        SingleButton
    },
    data(){
        return {
            m_Rows: 4,
            m_Columns: 3,
        }
    },
    methods: {
// Icon functions
// ------------------------------------------------------------------------------------------------------------
        checkDropIcon(){ // icon drag onto saved storage
            if(!this.$GlobalStates.value.edit.iconDragData){ return; } // Requires data

            console.log("Drop!", this.$GlobalStates.value.edit.iconDragData);
            this.resetSelection();
        },

        resetSelection(){
            this.$GlobalStates.value.edit.iconDragData = null;
        },

        generateIcon(){

        },

        deleteIcon(){

        },

// ------------------------------------------------------------------------------------------------------------

        RenderIcon(){ // Get the data for any saved icons.
            return false;
        },
        tmp(){

        }
    }
}

</script>

<style scoped>

.grid-item{
    border: solid rgba(255, 255, 255, 0.4) 0.5px;
}

.saved-grid{
    border: 2px solid black;
    height: 150px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    overflow-y: scroll;
}

.width-half{
    width: 50%;
}

.width-full{
    width: 100%;
}

.saved-icons{
    height: 116px;
}

.grid{
    display: grid;
}

.flex{
    display: flex;
}

.flex-space{
    justify-content: space-between;
}

.image-placeholder{
    border: 2px solid black;
    width: 150px;
    height: 150px;
}
</style>