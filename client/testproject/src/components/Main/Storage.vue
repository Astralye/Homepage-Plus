<template>
    <Transition name="fade">
        <div class="action-container" v-if="this.$GlobalStates.value.edit.enabled">
            <!-- Save button -->
            <button @click="saveLayout">
                <svg xmlns="http://www.w3.org/2000/svg" :height="iconSize" viewBox="0 -960 960 960" fill="#CCCCCC">
                    <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
                </svg>
            </button>

            <!-- Delete button -->
            <button @click="deleteLayout">
                <svg xmlns="http://www.w3.org/2000/svg" :height="iconSize" viewBox="0 -960 960 960" fill="#CCCCCC">
                    <path d="M283-130q-30.94 0-52.97-22.03Q208-174.06 208-205v-512h-39v-75h193v-38h237v38h193v75h-39v512q0 30.94-22.03 52.97Q708.94-130 678-130H283Zm395-587H283v512h395v-512ZM365-283.5h75v-355h-75v355Zm156 0h75v-355h-75v355ZM283-717v512-512Z"/>
                </svg>
            </button>

            <!-- Cancel Button -->
            <button @click="cancelEdit">
                <svg xmlns="http://www.w3.org/2000/svg" :height="iconSize" viewBox="0 -960 960 960" fill="#CCCCCC">
                    <path d="m259-206-52-53 220-221-220-221 52-53 221 221 221-221 52 53-220 221 220 221-52 53-221-221-221 221Z"/>
                </svg>
            </button>
        </div>
    </Transition>
</template>

<script>
    export default {
        components:{

        },
        data(){
            return {
                iconSize: "5em",
            }
        },
        methods: {
            saveLayout(){
                let containerObj = this.$ContainerData.value;
            
                let container_serialized = JSON.stringify(containerObj);
                localStorage.setItem("containerData", container_serialized);
                
                this.showPopup("Saved");
            },

            // These functions should be call other functions from different areas and process them 
            deleteLayout(){

                // ALERT 
                // ARE YOU SURE YOU WANT TO DELETE

                let baseObject = {
                level: 0,
                divisionType: "Vertical",
                id: "0A",
                NoChildren: 0,
                siblings: 0,
                evenSplit: "true",
                unevenFRData: "",
                containerData: []
                }

                // Reset Container Object
                this.$ContainerData.value = baseObject;
                
                // Reset selected
                this.$GlobalStates.value.edit.resetSelect = true;
                this.showPopup("deleted");
            },
            // Load from localstorage
            cancelEdit(){

                // ALERT 
                // ARE YOU SURE YOU WANT TO CANCEL

                const containerData = JSON.parse(localStorage.getItem("containerData"));

                if(containerData === null) {
                    console.log("No data!"); 
                    return;
                }

                this.$GlobalStates.clickLoad = true; 
                this.$ContainerData.value = containerData;

                // Reset selected
                this.$GlobalStates.value.edit.resetSelect = true;
                this.showPopup("cancelled");
            },

            // Above the containers, show a message showing what the user has clicked.
            // E.g ___ Successfully.
            showPopup(message){
                console.log(message);
            }
        }
    }
</script>

<style scoped>

.action-container{
    display: flex;
    position: absolute;
    background-color: black;

    right: 0;
    bottom: 0;
    margin: 1em;
    
    transition: all 0.2s;
}

</style>