<template>

    <div>
        
        Files supported: .{{ fileType }}

        <input
            id="file-upload"
            type="file"
            @change="clickSelect"
            capture
            multiple
            :accept="`.`+fileType"
        >

        <!-- What is actually displayed -->
        <label for="file-upload"
            class="file-wrapper"
            :class="{
                'old-height'   : !largeBox,
                'modify-height':  largeBox,
            }"

            @click="preventRefresh"
            @dragover="preventRefresh($event); largeBox = true"
            @dragleave="largeBox = false"
            @drop="mouseFileHandler">

            <div class="contents">
                
                Drag file here or
    
                <SingleButton
                    m_IconString="Upload"
                    @click="buttonClickOpenFileExplorer">
                    Open Explorer
                </SingleButton>
            </div>
            
        </label>
    </div>
</template>

<script>
import { iconImageStorage } from '../../Data/iconImages';
import SingleButton from './SingleButton.vue';
import SVGHandler from './SVGHandler.vue';

export default {
    emits: [ 'changeData' ],
    components: {
        SVGHandler,
        SingleButton,
    },
    props: {

        
        // SVGs use svg+xml
        fileType: {
            type: String,
            default: "jpg" 
        }
    },
    data(){
        return {
            iconImageStorage,
            
            largeBox: false,
            dataArray: [],
        }
    },

    methods:{

        buttonClickOpenFileExplorer(){
            document.getElementById('file-upload').click()
        },

        preventRefresh(event){
            event.preventDefault();
        },

        // Mouse drag data
        mouseFileHandler(event){
            this.preventRefresh(event);

            this.changeData(event.dataTransfer);
        },

        // Click on the button to open file explorer
        clickSelect(event){
            this.changeData(event.target);
        },

// File reading
// -------------------------------------------------------------------------------------------------------------------

        // Data recieved is a blob object
        changeData(fileData){
            
            const files = fileData.files;

            if(files.length === 0) return;
            
            
            this.largeBox = false;

            // For each file inputted
            for(let i = 0; i < files.length; i++){
                if(files[i].type.split("/")[1] != this.fileType) continue; // Not the specified type

                // Create a blob for each file
                const blob = new Blob([files[i]], { type: files[i].type})

                var fr = new FileReader();
                
                fr.onload = () => {
                    this.$emit('changeData', this.fileParser(fr.result));
                };
                fr.readAsText(blob);

            }
        },

        // Determines which file it is and handles appropriately
        fileParser(result){
            switch(this.fileType.toLowerCase()){
                case 'json':
                    return this.inputJSON(result);
                case 'svg+xml':
                    return iconImageStorage.svgParser(result);
            }
        },

        // file types

        // json
        inputJSON(result){
            return JSON.parse(result);
        },
    }
}
</script>

<style scoped>

input[type="file"] {
    display: none;
}

.fit-content{
    width: fit-content;
}

.contents{
    display: flex;
    
    align-items: center;
    justify-content: space-between ;
}

.modify-height{
    padding-top: 2em;
    padding-bottom: 2em;
    
}

.old-height{
    padding: 0.5em;
}

.file-wrapper{
    width: 100%;

    padding-left: 1em;
    padding-right: 1em;

    box-sizing: border-box;
    display: inline-block;

    border: 2px dashed var(--Accent-background-colour);
    border-radius: 10px;

    transition: all 150ms ease-out;
}
</style>