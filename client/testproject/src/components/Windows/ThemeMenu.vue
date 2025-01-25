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
                    text="Display icon labels"
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
                    text="Display icons"
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

                <Checkbox
                    @onChange="val => editVariables.setAppearance_Font_applyGlobal(val)"
                    :checkValue="editVariables.appearanceFont.isApplyGlobal"
                    text="Apply global settings"
                />

                <Checkbox
                    @onChange="val => editVariables.setAppearance_Font_textBackground(val)"
                    :checkValue="editVariables.appearanceFont.enableTextBackground"
                    text="Display text Background"
                />
                <br>

                Content font size: {{ editVariables.values.userAppearanceSettings.font.size }}

                <RangeSlider
                    :enabled="editVariables.appearanceFont.isApplyGlobal"
                    :no_Items="m_GlobalFontSize.length"                    
                    :caption_Data="m_GlobalFontSize"
                    v-model="editVariables.values.userAppearanceSettings.font.size"
                />

                <p class="help-tip">
                    This will apply only to content on the main page
                </p>


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
                    text="Override auto high contrast text"
                />
                
                <ColourPicker
                    @setColour="(hex) => {editVariables.setAppearance_Font_colour(hex); appearanceFontChange();}"
                    :enabled="editVariables.appearanceFont.isOverrideAutoColour"
                    :loaded_Data="editVariables.appearanceFont.colour"
                />
                <p class="help-tip">
                    Colour is calculated based on contrast of the secondary colour.
                    <br>
                    On theme change, this will not update and may make the text unreadable. 
                </p>

                <br>

                <h3>
                    Sample text
                </h3>

                <div
                    :style="{
                        'font-size' : editVariables.values.userAppearanceSettings.font.size
                    }">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>

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
                    text="Use tertiary colour"
                />

                <ColourPicker
                    @setColour="(hex) => { editVariables.setAppearance_Icon_colour(hex);}"
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

                <br>

                Font size: {{  editVariables.appearanceHeader.font.size }}

                <RangeSlider
                    :enabled="editVariables.appearanceHeader.isApplyGlobal"
                    :no_Items="m_GlobalContHeader.length"                    
                    :caption_Data="m_GlobalContHeader"
                    v-model="editVariables.values.userAppearanceSettings.containerHeader.font.size"
                />

                <br>

                <h3>
                    Font colour
                </h3>

                <Checkbox
                    @onChange="val => editVariables.setAppearance_Header_overrideAuto(val)"
                    :enabled="editVariables.appearanceHeader.isApplyGlobal"
                    :checkValue="editVariables.appearanceHeader.font.isOverrideAutoColour"
                    text="Override auto high contrast"
                />
                <br>

                <ColourPicker
                    @setColour="(hex) => {editVariables.setAppearance_Header_colour(hex); editVariables.updateHeaderColour(editVariables.appearanceHeader.font.colour)}"
                    :enabled="editVariables.appearanceHeader.font.isOverrideAutoColour && editVariables.appearanceHeader.isApplyGlobal"
                    :loaded_Data="editVariables.appearanceHeader.font.colour"
                />

                <br>
                Applied changes:

                <div class="header-colour" 
                    :style="{
                    'font-size' : (editVariables.appearanceHeader.isApplyGlobal) ? editVariables.appearanceHeader.font.size : '24px', 
                }">
                    I am a header!
                </div>

                <br>
                <SingleButton
                    @click="editVariables.resetAppearance_Header()">
                    Reset Header
                </SingleButton>

                <br>

                <h2>
                    Container
                </h2>

                <ContainerSelection
                    @updateSelected="val => loadData(val)"
                    @reset="loadData(null)"
                />

                <Checkbox
                    @onChange="val => {editVariables.setAppearance_Cont_applyGlobal(val); toggleContainerSelection(val)}"
                    :checkValue="editVariables.appearanceCont.isApplyGlobal"
                    text="Apply global settings"
                />

                <Checkbox
                    @onChange="val => editVariables.setAppearance_Cont_showBorder(val)"
                    :checkValue="editVariables.appearanceCont.isDisplayContainerBorder"
                    :enabled="editVariables.appearanceCont.isApplyGlobal"
                    text="Display Container borders"
                />

                <br> 

                <h3>
                    Border
                </h3>

                Thickness

                {{  editVariables.values.userAppearanceSettings.containerAll.borderThickness }}

                <RangeSlider
                    :enabled="editVariables.appearanceCont.isApplyGlobal && editVariables.appearanceCont.isDisplayContainerBorder && m_SelectedContainer"
                    :no_Items="m_GlobalContBorderThickness.length"                    
                    :caption_Data="m_GlobalContBorderThickness"
                    v-model="editVariables.values.userAppearanceSettings.containerAll.borderThickness"
                />
                <br>

                Radius

                {{  editVariables.values.userAppearanceSettings.containerAll.borderRadius }}

                <RangeSlider
                    :enabled="editVariables.appearanceCont.isApplyGlobal && editVariables.appearanceCont.isDisplayContainerBorder && m_SelectedContainer"
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
import SingleButton from '../Input Components/SingleButton.vue';
import ColourPicker from '../Input Components/ColourPicker.vue';
import RangeSlider from '../Input Components/RangeSlider.vue';
import TabWrapper from '../Window Components/TabWrapper.vue';
import FileUpload from '../Input Components/FileUpload.vue';
import TextInput from '../Input Components/TextInput.vue';
import Checkbox from '../Input Components/Checkbox.vue';
import ContainerSelection from '../Window Components/ContainerSelection.vue';

import { editVariables } from '../../Data/SettingVariables';
import { themeStorage } from '../../Data/themeStorage';
import { layout, LayoutDataClass } from '../../Data/layoutData';

export default {
    components:{
        WindowContainerDivider,
        ContainerSelection,
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
            LayoutDataClass,
            editVariables,
            themeStorage,
            layout,

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

            m_GlobalFontSize: ["10px" , "12px" , "14px" , "16px", "18px", "20px"],
            
            m_GlobalContHeader: ["18px", "20px", "24px", "28px", "32px"],

            m_GlobalContBorderThickness: ["1px", "2px", "3px", "4px" ,"5px" , "6px"],
            m_GlobalContBorderRadius: ["0px", "4px", "12px", "20px", "25px"],
            
            // Container selection

			m_SelectedContainer: null,
        }
    },
    beforeMount(){
        editVariables.enableAppearanceWindow();
        editVariables.selectionContainerToggler();
    },
    beforeUnmount(){
        // Set theme
        themeStorage.resetTheme();
        editVariables.disableAppearanceWindow();
        editVariables.selectionContainerToggler();
    },
    methods:{

        // For borders
        updateContainer(val){

            if(!this.m_SelectedContainer) return;

            this.m_SelectedContainer.border.isDisplay = val.isDisplayContainerBorder;
            this.m_SelectedContainer.border.radius    = val.borderRadius;
            this.m_SelectedContainer.border.thickness = val.borderThickness;
        },

        toggleContainerSelection(val){
            (val) ? editVariables.enableAppearanceWindow() : editVariables.disableAppearanceWindow();
            editVariables.selectionContainerToggler();
        },

        // Container selection for 
		loadData(id){

            this.m_SelectedContainer = null;
            
            // Reset the values first and then re-apply
            editVariables.resetAppearance_Cont();

            // Resetted value
			if(!id) return
            this.m_SelectedContainer = LayoutDataClass.getLevelData(layout.allData, LayoutDataClass.getLevel(id), id);

            console.log(this.m_SelectedContainer, id)

            editVariables.setAppearance_Cont_showBorder(this.m_SelectedContainer.border.isDisplay);
            editVariables.setAppearance_Cont_borderThickness(this.m_SelectedContainer.border.thickness);
            editVariables.setAppearance_Cont_borderRadius(this.m_SelectedContainer.border.radius);
		},

        // On text colour change
        appearanceFontChange(){
            
            // Always change the text colour
            editVariables.changeTextCol(editVariables.appearanceFont.colour);

            // If there is no header override, change that text too.
            if(!editVariables.appearanceHeader.font.isOverrideAutoColour){
                editVariables.updateHeaderColour(editVariables.appearanceFont.colour);
            }
        },


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
        },
    },
    watch:{

        // On change of the override values
        'editVariables.appearanceFont.isOverrideAutoColour'(val){

            // when the text font override is turned on
            if(val) { this.appearanceFontChange(); return }

            // Reset
            themeStorage.resetColour();

            // reapply header colour if header override.
            if(editVariables.appearanceHeader.font.isOverrideAutoColour){
                editVariables.updateHeaderColour(editVariables.appearanceHeader.font.colour); 
            }
        },
        'editVariables.appearanceHeader.font.isOverrideAutoColour'(val){

            // If header override is turned on
            if(val){ editVariables.updateHeaderColour(editVariables.appearanceHeader.font.colour); return }
                
            // Reset
            themeStorage.resetColour(); 

            // If font override is on, apply colou
            if(editVariables.appearanceFont.isOverrideAutoColour){
                editVariables.updateHeaderColour(editVariables.appearanceFont.colour);
            }
        },
        'editVariables.appearanceCont': {
            handler(val){
                this.updateContainer(val);
            },
            deep: true,
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

.header-colour{
    color: var(--Header-colour);
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