<template>

    <!-- General -->
    <WindowContainerDivider>

        <template #content>

            <TabWrapper
                :default_Tab="0"
                :tab_Buttons="m_ThemeTabButttons"
            >

    <!-- 
        THEMES
        &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&        
    -->
            <template #Tab-0>

                <h2>
                    Theme Selection
                </h2>

                <!-- This should display the primary, secondary and tertiary colours -->
                <div class="colour-header flex">
                    <div>
                        <h3> 
                            Primary
                        </h3>
                    </div>
                    <div>
                        <h3>
                            Secondary
                        </h3>
                    </div>
                    <div>
                        <h3>
                            Accent
                        </h3>
                    </div>
                </div>
                <div class="list-container">
    
                    
                    <TransitionGroup name="list">
    
                        <div v-for="(item, index) in themeStorage.storedThemes" :key="index"
                            class="theme-display"
                            :class="{
                                'selected'  :  themeStorage.isSelected(item.name),
                                'unselected': !themeStorage.isSelected(item.name),
                            }"
                            @click="themeStorage.clickChange(item.name); changeTheme(item)"> 
    
                            <div class="icon-center">
                                <template v-if="item.alias.length === 0">
                                    Theme {{ index }}
                                </template>
                                <template v-else>
                                    {{  item.alias }}
                                </template>
                            </div>
                            
                            <div class="colour-display flex">
    
    
                                <div class="colour-item left-colour"
                                    :style="{ 'background-color': item.primary }"
                                    @click="themeStorage.clickChange(item.name); changeType(item, 'primary'); ">
    
                                    <Transition name="fade">
                                        <div v-show="isSelected('primary') && themeStorage.isSelected(item.name)" 
                                            class="left-colour"
                                            :class="{ 'colourType' :  isSelected('primary'),
                                                      'unsel-col'  : !isSelected('primary') }"
                                            :style="{ 'border-color': themeStorage.getContrastYIQ(item.primary) }"
                                        />
                                    </Transition>
                                </div>
    
            
                                <div class="colour-item"
                                    :style="{ 'background-color': item.secondary }"
                                    @click="themeStorage.clickChange(item.name); changeType(item, 'secondary');">
    
                                    <transition name="fade">
                                        <div v-show="isSelected('secondary') && themeStorage.isSelected(item.name)"
                                            :class="{ 'colourType' : isSelected('secondary'),
                                                      'unsel-col' : !isSelected('secondary') }"
                                            :style="{ 'border-color': themeStorage.getContrastYIQ(item.secondary) }"
                                        />
                                    </transition>
    
                                </div>
            
                                <div class="colour-item right-colour"
                                    :style="{ 'background-color': item.tertiary }"
                                    @click="themeStorage.clickChange(item.name); changeType(item, 'tertiary')">
    
                                    <transition name="fade">
                                        <div v-show="isSelected('tertiary') && themeStorage.isSelected(item.name)"
                                             class="right-colour"
                                            :class="{ 'colourType' :  isSelected('tertiary'),
                                                      'unsel-col'  : !isSelected('tertiary')}"
                                            :style="{ 'border-color': themeStorage.getContrastYIQ(item.secondary) }"
                                        />
                                    </transition>
                                </div>
    
                            </div>
                        </div>
                    </TransitionGroup>
                    <div class="theme-display">
    
                        <div class="add-button">
    
                            <div class="icon-center add-text">
                                <h3>
                                    Add new theme
                                </h3>
                            </div>
                            <SingleButton
                                class="flex"
                                m_IconString="Add"
                                @click="themeStorage.addTheme()"
                            />
                        </div>
                    </div>
                </div>
    
                <br>
                <h3>
                    Theme Name
                </h3>
                <TextInput
                    :enabled="!isBaseTheme"
                    v-model="m_SelectedTheme.alias"/>
                
                <div class="theme-buttons">
                    <SingleButton
                        @click="themeStorage.deleteTheme()"
                        m_IconString="Delete"
                        :enabled="!isBaseTheme"
                    >
                        Delete
                    </SingleButton>
                
                    <ColourPicker
                        @setColour="(hex) => themeStorage.setRGBValues(m_SelectedTheme, typeSelected, hex)"
                        :enabled="!isBaseTheme"
                        :loaded_Data="m_SelectedTheme[typeSelected]"
                        />
    
                    <SingleButton
                        @click="themeStorage.save()"
                        m_IconString="Save"
                    >
                        Save
                    </SingleButton>
                </div>
            </template>

    <!-- 
        GRIDS AND LISTS
        &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&        
    -->
            <template #Tab-1>

        <!-- 
            Grids
            GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
        -->
                <h2>
                    Grids
                </h2>

                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Apply global settings"
                />
                <!-- This will apply these settings to every grid -->
                
                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Display Icon Labels"
                />

                Global icon size: in px

                <RangeSlider></RangeSlider>

                Grid item size: in px
                <RangeSlider></RangeSlider>


                <SingleButton
                    @click="console.log('resetCheckbox')">
                    Reset grids
                </SingleButton>
                <br>

        <!-- 
            Lists
            LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
        -->
                <h2>
                    Lists
                </h2>

                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Apply global settings"
                />

                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Display Icons"
                />

                Padding between content
                <RangeSlider> </RangeSlider>

                <br>
                List item height size: in px
                <RangeSlider></RangeSlider>

                <SingleButton
                    @click="console.log('resetCheckbox')">
                    Reset grids
                </SingleButton>

            </template>

    <!-- 
        FONTS
        &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    -->

            <template #Tab-2>

        <!-- 
            Font type 
            FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF        
        -->

                <h2>
                    Font
                </h2>

                <!-- Maybe make this more generalizable later -->
                <select name="font" id="font">
                    <option value="abc">arial</option>

                    <option value="def">def</option>
                    <option value="ghi">ghi</option>
                    <option value="jkl">comic sans</option>
                </select>

                <br> <br>
        <!-- 
            Font size
            SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS        
        -->
                <h3>
                    Font size
                </h3>

                in px
                <RangeSlider></RangeSlider>

                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Display Text Background"
                />
                <br>

        <!-- 
            Font Colour
            CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC        
        -->

                <h3>
                    Font colour
                </h3>

                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Override auto high contrast font"
                />
                *Font colour is calculated based on contrast of the secondary colour.
                On theme change, this will not update and may make the text unreadable. 

                <ColourPicker> </ColourPicker>
                <br>

                <h3>
                    Sample text
                </h3>

                Lorem ipsum dolor sit amet, consectetur adipiscing elit.

                <SingleButton
                    @click="console.log('resetFont')">
                    Reset Font
                </SingleButton>
            </template>

    <!-- 
        ICONS
        &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&        
    -->

            <template #Tab-3>
                <h2>
                    Icons
                </h2>

                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Apply global settings"
                />
                <br>


                <h3>
                    Icon colour
                </h3>

                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Use Tertiary colour"
                />

                in px
                <ColourPicker></ColourPicker>
                <br>


                <h3>
                    Icon sizes
                </h3>
                in px
                <RangeSlider></RangeSlider>

                <SingleButton
                    @click="console.log('resetCheckbox')">
                    Reset grids
                </SingleButton>
            </template>

    <!-- 
        Container Header
        &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&            
    -->
            <template #Tab-4>
                <h2>
                    Container Header
                </h2>

                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Apply global settings"
                />

                <br>
                
                <!-- Same Settings as font, but should just be applied to the header values -->
                <h3>
                    Font
                </h3>

                <!-- Maybe make this more generalizable later -->
                <select name="font" id="font">
                    <option value="abc">arial</option>

                    <option value="def">def</option>
                    <option value="ghi">ghi</option>
                    <option value="jkl">comic sans</option>
                </select>

                <h3>
                    Font size
                </h3>
                <RangeSlider> </RangeSlider>

                <h3>
                    Font colour
                </h3>

                <ColourPicker></ColourPicker>

                <br>
                Applied changes:
                <h2>
                    I am a header!
                </h2>

                <SingleButton
                    @click="console.log('resetHeader')">
                    Reset Header
                </SingleButton>

                <h2>
                    Container
                </h2>
                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Apply global settings"
                />

                <Checkbox
                    @onChange=""
                    :checkValue="false"
                    text="Display Container borders"
                />

                <h3>
                    Border thickness
                </h3>
                <RangeSlider> </RangeSlider>

            </template>

            </TabWrapper>

        </template>
    </WindowContainerDivider>
</template>

<script>
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import FileUpload from '../Input Components/FileUpload.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import ColourPicker from '../Input Components/ColourPicker.vue';
import TextInput from '../Input Components/TextInput.vue';
import TabWrapper from '../Window Components/TabWrapper.vue';
import Checkbox from '../Input Components/Checkbox.vue';

import RangeSlider from '../Input Components/RangeSlider.vue';

import { themeStorage } from '../../Data/themeStorage';

export default {
    components:{
        WindowContainerDivider,
        ColourPicker,
        SingleButton,
        RangeSlider,
        TabWrapper,
        FileUpload,
        TextInput,
        Checkbox,
    },
    data(){
        return{
            themeStorage,

            typeSelected: 0, // primary, secondary or teriary
            m_SelectedThemeName: "",

            m_SelectedTheme: {},

            m_ThemeTabButttons: [
                { text: 'Themes', icon_Image: "Dotted_Square" },
                { text: 'Grids, Lists', icon_Image: "Dotted_Square"},
                { text: 'Text', icon_Image: "Dotted_Square"},
                { text: 'Icons', icon_Image: "Dotted_Square"},
                { text: 'Container', icon_Image: "Dotted_Square"},
            ]
        }
    },
    beforeUnmount(){
        // Set theme
        themeStorage.resetTheme();
    },
    methods:{

        changeTheme(item){
            this.m_SelectedTheme = item;
        },

        changeType(item, type){
            this.changeTheme(item);
            this.typeSelected = type;
        },
        isSelected(val){return (this.typeSelected === val)},
    },
    computed:{
        isBaseTheme(){
            if(!themeStorage.selectedTheme) return true; // no data
            return ((themeStorage.selectedTheme === "Default" || 
                     themeStorage.selectedTheme === "Light" || 
                     themeStorage.selectedTheme === "Dark"))
        }
    }
}
</script>

<style scoped>

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 500ms ease-in-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.theme-buttons{
    display: flex;
    padding-top:   1em;
    padding-right: 1em;
    padding-left:  1em;
    
    justify-content: space-between;
}

.left-colour{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    
}

.right-colour{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.colourType{
    border: 2px solid;

    height: 100%;
    transition: opacity 150ms ease-in-out;
}

.unsel-col{
    border: 2px solid;
    opacity: 0;

    height: 100%;
    transition: opacity 150ms ease-in-out;

}

.colour-item{
    height: 100%;
    width: 100%;
}

.flex{
    display: flex;
}

.theme-display{
    margin: 0.25em;
    margin-top: 0.5em;
    padding-bottom: 0.5em;
}

.colour-header{
    margin-top: 1em;
    margin-left: 1.5em;
    margin-right: 2.5em;
    justify-content: space-between;
}

.add-button{
    height: 5em;
    display: flex;
    justify-content: space-between;
}

.add-text{
    margin-left: 2em;
}

.colour-display{
    padding-left: 0.5em;
    padding-right: 0.5em;
    
    height: 3.5em;
    justify-content: space-evenly;
}

.unselected{
    transition: all 150ms ease-out;
    border: 3px solid rgba(0, 0, 0, 0);
    
    border-radius: 8px;
}
.selected{
    transition: all 150ms ease-out;
    
    border: 3px solid var(--Accent-background-colour);
    border-radius: 8px;
}

.list-container{
    max-height: 350px;
    min-height: 100px;

    box-sizing: content-box;

    overflow-y: auto;
}
</style>