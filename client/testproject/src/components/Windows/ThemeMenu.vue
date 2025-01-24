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
                    @onChange="val => editVariables.setAppearance_Grid_applyGlobal(val)"
                    :checkValue="editVariables.appearanceGrid.isApplyGlobal"
                    text="Apply global settings"
                />
                <!-- This will apply these settings to every grid -->
                
                <Checkbox
                    @onChange="val => editVariables.setAppearance_Grid_showIconLabel(val)"
                    :checkValue="editVariables.appearanceGrid.isDisableIconLabels"
                    :enabled="editVariables.appearanceGrid.isApplyGlobal"
                    text="Display Icon Labels"
                />

                <br>

                Global icon size: {{ editVariables.appearanceGrid.globalIconSize }}

                <RangeSlider
                    :enabled="editVariables.appearanceGrid.isApplyGlobal"
                    :no_Items="m_GlobalIconSize.length"                    
                    :caption_Data="m_GlobalIconSize"
                    v-model="editVariables.values.userAppearanceSettings.grids.globalIconSize"
                />

                <br>

                Grid item size: {{ editVariables.appearanceGrid.globalGridItemSize }}px

                <RangeSlider
                    :enabled="editVariables.appearanceGrid.isApplyGlobal"
                    :no_Items="m_GlobalGridItemSize.length"                    
                    :caption_Data="m_GlobalGridItemSize"
                    v-model="editVariables.values.userAppearanceSettings.grids.globalGridItemSize"
                />

                <SingleButton
                    @click="editVariables.resetAppearance_Grid()">
                    Reset grid settings
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
                    @onChange="val => editVariables.setAppearance_List_applyGlobal(val)"
                    :checkValue="editVariables.appearanceList.isApplyGlobal"
                    text="Apply global settings"
                />

                <Checkbox
                    @onChange="val => editVariables.setAppearance_List_showIcons(val)"
                    :checkValue="!editVariables.appearanceList.isDisableIconLabels"
                    :enabled="editVariables.appearanceList.isApplyGlobal"
                    text="Display Icons"
                />

                <Checkbox
                    @onChange="val => editVariables.setAppearance_List_displayDivider(val)"
                    :checkValue="!editVariables.appearanceFont.globalDisplayListDivider"
                    :enabled="editVariables.appearanceList.isApplyGlobal"
                    text="Display list divider"
                />

                <br>

                List item height: {{ editVariables.appearanceList.globalitemHeight }}

                <RangeSlider
                    :enabled="editVariables.appearanceList.isApplyGlobal"
                    :no_Items="m_GlobalListHeight.length"                    
                    :caption_Data="m_GlobalListHeight"
                    v-model="editVariables.values.userAppearanceSettings.list.globalitemHeight"
                />

                <br>

                Margin between content: {{ editVariables.values.userAppearanceSettings.list.globalPadding }}
                <RangeSlider
                    :enabled="editVariables.appearanceList.isApplyGlobal"
                    :no_Items="m_GlobalListPadding.length"                    
                    :caption_Data="m_GlobalListPadding"
                    v-model="editVariables.values.userAppearanceSettings.list.globalPadding"
                />

                <SingleButton
                    @click="editVariables.resetAppearance_List()">
                    Reset list Settings
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

                <!-- 
                    TODO
                    Maybe make this more generalizable later 
                    For now, we leave it until we need to make it work    
                -->
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

                {{ editVariables.values.userAppearanceSettings.font.size }}

                <RangeSlider
                    :enabled="editVariables.appearanceFont.isApplyGlobal"
                    :no_Items="m_GlobalFontSize.length"                    
                    :caption_Data="m_GlobalFontSize"
                    v-model="editVariables.values.userAppearanceSettings.font.size"
                />

                <Checkbox
                    @onChange="val => editVariables.setAppearance_Font_textBackground(val)"
                    :checkValue="editVariables.appearanceFont.enableTextBackground"
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
                    @onChange="val => editVariables.setAppearance_Font_overrideAuto(val)"
                    :checkValue="editVariables.appearanceFont.isOverrideAutoColour"
                    text="Override auto high contrast font"
                />
                *Font colour is calculated based on contrast of the secondary colour.
                On theme change, this will not update and may make the text unreadable. 

                <ColourPicker
                    @setColour="(hex) => editVariables.setAppearance_Font_colour(hex)"
                    :enabled="editVariables.appearanceFont.isOverrideAutoColour"
                    :loaded_Data="editVariables.appearanceFont.colour"
                />

                <br>

                <h3>
                    Sample text
                </h3>

                Lorem ipsum dolor sit amet, consectetur adipiscing elit.

                <SingleButton
                    @click="editVariables.resetAppearance_Font()">
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
                    @onChange="val => editVariables.setAppearance_Icon_applyGlobal(val)"
                    :checkValue="editVariables.appearanceIcon.isApplyGlobal"
                    text="Apply global settings"
                />
                <br>


                <h3>
                    Icon colour
                </h3>

                <Checkbox
                    @onChange="val => editVariables.setAppearance_Icon_useTertiary(val)"
                    :checkValue="editVariables.appearanceIcon.isUseTertiary"
                    text="Use Tertiary colour"
                />

                in px

                <ColourPicker
                    @setColour="(hex) => editVariables.setAppearance_Icon_colour(hex)"
                    :enabled="!editVariables.appearanceIcon.isUseTertiary"
                    :loaded_Data="editVariables.appearanceFont.colour"
                />
                <br>

                <SingleButton
                    @click="editVariables.resetAppearance_Icon()">
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
                    @onChange="val => editVariables.setAppearance_Header_applyGlobal(val)"
                    :checkValue="editVariables.appearanceHeader.isApplyGlobal"
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

                {{  editVariables.values.userAppearanceSettings.containerHeader.font.size }}

                <RangeSlider
                    :enabled="editVariables.appearanceHeader.isApplyGlobal"
                    :no_Items="m_GlobalContHeader.length"                    
                    :caption_Data="m_GlobalContHeader"
                    v-model="editVariables.values.userAppearanceSettings.containerHeader.font.size"
                />

                <h3>
                    Font colour
                </h3>

                <Checkbox
                    @onChange="val => editVariables.setAppearance_Header_overrideAuto(val)"
                    :enabled="editVariables.appearanceHeader.isApplyGlobal"
                    :checkValue="editVariables.appearanceHeader.font.isOverrideAutoColour"
                    text="Use Tertiary colour"
                />

                <ColourPicker
                    @setColour="(hex) => editVariables.setAppearance_Header_colour(hex)"
                    :enabled="!editVariables.appearanceHeader.font.isOverrideAutoColour && editVariables.appearanceHeader.isApplyGlobal"
                    :loaded_Data="editVariables.appearanceHeader.font.colour"
                />

                <br>
                Applied changes:

                <h2>
                    I am a header!
                </h2>

                <SingleButton
                    @click="editVariables.resetAppearance_Header()">
                    Reset Header
                </SingleButton>



                <h2>
                    Container
                </h2>
                <Checkbox
                    @onChange="val => editVariables.setAppearance_Cont_applyGlobal(val)"
                    :checkValue="editVariables.appearanceCont.isApplyGlobal"
                    text="Apply global settings"
                />

                <Checkbox
                    @onChange="val => editVariables.setAppearance_Cont_showBorder(val)"
                    :checkValue="editVariables.appearanceCont.isDisplayContainerBorder"
                    :enabled="editVariables.appearanceCont.isApplyGlobal"
                    text="Display Container borders"
                />

                <h3>
                    Border
                </h3>

                Thickness

                {{  editVariables.values.userAppearanceSettings.containerAll.borderThickness }}

                <RangeSlider
                    :enabled="editVariables.appearanceCont.isApplyGlobal && editVariables.appearanceCont.isDisplayContainerBorder"
                    :no_Items="m_GlobalContBorderThickness.length"                    
                    :caption_Data="m_GlobalContBorderThickness"
                    v-model="editVariables.values.userAppearanceSettings.containerAll.borderThickness"
                />
                <br>

                Radius

                {{  editVariables.values.userAppearanceSettings.containerAll.borderRadius }}

                <RangeSlider
                    :enabled="editVariables.appearanceCont.isApplyGlobal && editVariables.appearanceCont.isDisplayContainerBorder"
                    :no_Items="m_GlobalContBorderRadius.length"                    
                    :caption_Data="m_GlobalContBorderRadius"
                    v-model="editVariables.values.userAppearanceSettings.containerAll.borderRadius"
                />
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

import { editVariables } from '../../Data/SettingVariables';

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
            editVariables,
            themeStorage,

            typeSelected: 0, // primary, secondary or teriary
            m_SelectedThemeName: "",

            m_SelectedTheme: {},

            // Tabs
            m_ThemeTabButttons: [
                { text: 'Themes', icon_Image: "Dotted_Square" },
                { text: 'Grids, Lists', icon_Image: "Dotted_Square"},
                { text: 'Text', icon_Image: "Dotted_Square"},
                { text: 'Icons', icon_Image: "Dotted_Square"},
                { text: 'Container', icon_Image: "Dotted_Square"},
            ],

            // Range Sliders
            m_GlobalIconSize: [ "40px", "50px", "75px", "100px", "120px"], // Maybe this could be relative to the size of the grid item
            m_GlobalGridItemSize: [ 75, 100, 125, 150], // Must be a number
            
            m_GlobalListHeight: [ "auto", "50px", "65px", "75px"],
            m_GlobalListPadding: ["0.25em", "0.5em", "0.75em", "1em", "1.5em", "2em"],

            m_GlobalFontSize: ["10px" , "12px" , "14px" , "16px"],
            
            m_GlobalContHeader: ["20px", "24px", "32px", "38px"],

            m_GlobalContBorderThickness: ["1px", "2px", "3px", "4px"],
            m_GlobalContBorderRadius: ["0px", "4px", "8px", "12px"],
            
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
    
    height: 2.5em;
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