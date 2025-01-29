<template>
    <div>
        <WindowContainerDivider>
            <template #header>
                <h2>
                    Profile Selection
                </h2>
            </template>

            <template #content>
                
                <div class="profile-container">
                    
                    <TransitionGroup name="list">
                        
                        <div v-for="(value, key) in profileHandler.storedProfiles" :key="key"
                            class="profile-item"
                            :class="{
                                'selected-profile'             :  profileHandler.isSelectedProfile(key),
                                'unselected-profile clickable' : !profileHandler.isSelectedProfile(key),
                            }"
                            @click="profileHandler.changeSelectedProfile(key)">
                            
                            <div class="profile-name icon-center">
                                <h3>
                                    {{ key }}
                                </h3>
                            </div>

                            <!--
                                Preview display 
                                Get the aspect ratio of the current screen.
                                For now, static size.    

                                Disable for now
                            -->
                            <div class="preview-display">
                                <!-- <Container
                                    :nest_level="0"
                                    :profileDisplayName="key"
                                    :isDisplayWindow="true"
                                /> -->
                            </div>
                        
                        </div>

                        <div class="profile-item">
                            <div class="add-new icon-center">

                                <div class="add-content">
                                    <h3 class="add-text">
                                        Create new profile
                                    </h3>
        
                                    <SingleButton
                                        class="add-button"
                                        @click="addProfile"
                                        :m_IconString="'Add'">
                                    </SingleButton>
                                </div>

                            </div>
                        </div>
                        
                    </TransitionGroup>
                </div>

                <br>
                <p>
                    Profile selected: {{ profileHandler.selectedProfile }}
                </p>

                <p class="help-tip">
                    *Profiles, unlike appearance, stores everything such as layout, icon positions, etc including themes.
                </p>

                <br>
                
                <div class="main-button">

                    <SingleButton
                        @click="deleteProfile"
                        :m_IconString="'Delete'"
                        >
                        Delete
                    </SingleButton>
    
                    <SingleButton
                        @click="selectProfile"
                        :m_IconString="'Left_Select'">
                        Select
                    </SingleButton>

                </div>


                <!-- <SingleButton
                    @click="console.log('button')">
                    Modify profile
                </SingleButton> -->
            </template>
        </WindowContainerDivider>
    </div>
</template>

<script>
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import SingleButton from '../Input Components/SingleButton.vue';

import { profileHandler } from '../../Data/profileHandler';
import Container from '../Main/Container.vue';

export default {
    components:{
        WindowContainerDivider,
        SingleButton,
        Container,
    },
    data(){
        return{
            profileHandler,
            

            tempData: {

            },
        }
    },
    methods:{

        // Have a preview mode, displays everything but does not set it.
        // Have a timer to automatically reset.


        selectProfile(){
            profileHandler.saveDataToLocalStorage();
            profileHandler.loadProfileData();
        },
        
        addProfile(){

            let name = `Profile ${profileHandler.noProfiles}`;

            profileHandler.addProfile(name);
        },

        //
        deleteProfile(){            
            profileHandler.deleteProfile(profileHandler.selectedProfile);
            profileHandler.setSelectedProfile('defaultProfile') // temporary
        },

        // Modify profile

        // Set profile

    }
}
</script>

<style scoped>

/*
    Taken from ThemeManu.vue
*/

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 400ms ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}




.flex{
    display: flex;
}

.add-text{
    height: 2em;
}

.add-button{
    margin-left: auto;
    margin-right: auto;
    width: 50%;
}
.add-new{
    height: 250px;
    display: flex;
}

.add-content{
    display: flex;
    flex-direction: column;
}

/*

Add back later

*/
.preview-display{
    height: 320px;

    padding: 1em 0.5em;
}

.profile-item{
    height: fit-content;
    margin-bottom: 1em;
}

.clickable{
    cursor: pointer;
}

.profile-name{
    height: 2.5em;
}

.profile-container{
    width: 100%;
    min-height: 200px;
    max-height: 375px;
    overflow-y: auto;
}

.selected-profile{
    border: 2px white solid;
    border-radius: 10px;

    transition: all 200ms ease;
}

.unselected-profile{
    border: 2px rgba(0,0,0,0) solid;
    border-radius: 10px;

    transition: all 200ms ease;
}

.main-button{
    display: flex;
    align-items: center;
    justify-content: space-between;
}

</style>