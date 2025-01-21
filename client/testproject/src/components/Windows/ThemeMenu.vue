<template>

    <!-- General -->
    <WindowContainerDivider>
        <template #header>
            <h2> 
                Theme Storage
            </h2>
        </template>

        <template #content>
            <!-- This should display the primary, secondary and tertiary colours -->
            <div class="colour-header flex">
                <div>
                    <h4> 
                        Primary
                    </h4>
                </div>
                <div>
                    <h4>
                        Secondary
                    </h4>
                </div>
                <div>
                    <h4>
                        Accent
                    </h4>
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
                        @click="themeStorage.changeSelected(item.name)"> 

                        <div class="icon-center">
                            {{  item.name }}
                        </div>
                        
                        <div class="colour-display flex">
                            <div class="colour-item left-colour"
                            :style="{
                                'background-color': item.primary
                            }"/>
        
                            <div class="colour-item"
                            :style="{
                                'background-color': item.secondary
                            }"/>
        
                            <div class="colour-item right-colour"
                            :style="{
                                'background-color': item.tertiary
                            }"/>
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
            
            <div class="theme-buttons">
                <SingleButton
                    @click="themeStorage.deleteTheme()"
                    m_IconString="Delete"
                    :enabled="!isBaseTheme"
                    >
                Delete
                </SingleButton>

                <SingleButton
                    @click="themeStorage.save()"
                    m_IconString="Save"
                >
                Save
                </SingleButton>
            </div>
        </template>
    </WindowContainerDivider>
</template>

<script>
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import FileUpload from '../Input Components/FileUpload.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import { themeStorage } from '../../Data/themeStorage';

export default {
    components:{
        WindowContainerDivider,
        SingleButton,
        FileUpload,
    },
    data(){
        return{
            themeStorage,

            testArray:[
                {
                    name: "Default",
                    primary:   "#723d46",
                    secondary: "#472d30",
                    tertiary:  "#C9CBA3",
                },
                {
                    name: "Light",
                    primary:   "#EFF3EA",
                    secondary: "#EFF3EA",
                    tertiary:  "#123fab",
                },
                {
                    name: "Dark",
                    primary:   "#000000",
                    secondary: "#14213d",
                    tertiary:  "#fca311",
                },
                {
                    name: "abc",
                    primary: "#F0C1E1",
                    secondary: "#CB9DF0",
                    tertiary: "#FFF9BF",
                },
            ],

            m_SelectedTheme: "Default",
        }
    },
    beforeUnmount(){
        // Set theme
        themeStorage.resetTheme();
    },
    methods:{

    },
    computed:{
        isBaseTheme(){
            if(!this.m_SelectedTheme) return true; // no data
            return ((this.m_SelectedTheme === "Default" || 
                    this.m_SelectedTheme === "Light" || 
                    this.m_SelectedTheme === "Dark"))
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