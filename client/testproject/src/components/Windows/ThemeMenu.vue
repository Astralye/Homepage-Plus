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

                <div v-for="(item, index) in testArray" :key="index"
                    class="theme-display"
                    :class="{
                        'selected'  : isSelected(item.name),
                        'unselected': !isSelected(item.name),
                    }"
                    @click="changeSelected(item.name)"> 
                    
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
                            @click="addTheme()"
                        />
                    </div>
                </div>
            </div>
        </template>
    </WindowContainerDivider>


    <!-- Imports -->
    <WindowContainerDivider>
        <template #header>
            <h2> 
                Imports
            </h2>
        </template>

        <template #content>
            <FileUpload
                fileType="json"
                @changeData="data => loadImportedTheme(data)"
            />
        </template>
    </WindowContainerDivider>
</template>

<script>
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import FileUpload from '../Input Components/FileUpload.vue';
import SingleButton from '../Input Components/SingleButton.vue';

export default {
    components:{
        WindowContainerDivider,
        SingleButton,
        FileUpload,
    },
    data(){
        return{
            
            testArray:[
                {
                    name: "Default",
                    primary:   "#000000",
                    secondary: "#aaaaaa",
                    tertiary:  "#ffffff",
                },
                {
                    name: "Light",
                    primary:   "#445513",
                    secondary: "#ffffff",
                    tertiary:  "#123fab",
                },
                {
                    name: "Dark",
                    primary:   "#111111",
                    secondary: "#bbbbbb",
                    tertiary:  "#dddddd",
                },
            ],

            m_SelectedTheme: "DefaultL",
        }
    },
    methods:{
    
        changeSelected(name){
            this.m_SelectedTheme = name;
        },

        isSelected(name){
            return (this.m_SelectedTheme === name);
        },

    // Objects and colours
    // ---------------------------------------------------------------------------------------------

        themeConstructor(inputName, inputPrim, inputSec, inputTert){
            return {
                name:      inputName,
                primary:   inputPrim,
                secondary: inputSec,
                tertiary:  inputTert,
            }
        },

        addTheme(){

            let name = "abc";
            let prim = "#abcabc";
            let sec =  "#abc000";
            let tert = "#abc111";

            this.testArray.push(this.themeConstructor(name, prim, sec, tert));
        },

    // Imports
    // -----------------------------------------------------------------------------------------------

        validateImport(){
            // Json file.
            // Check for property names.
        },

        loadImportedTheme(){
            console.log("test");

            // this.validateImport();

            // Set the theme

            // this.testArray.push( ... )
        }
    }
}
</script>

<style scoped>

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