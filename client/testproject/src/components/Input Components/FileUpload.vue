<template>

    <input 
        type="file"
        @change="changeData"
        capture
        multiple
        :accept="`.`+fileType"
    >
</template>

<script>
import { iconImageStorage } from '../../Data/iconImages';

export default {
    emits: [ 'changeData' ],
    props: {
        fileType: {
            type: String,
            default: "jpg" 
        }
    },
    data(){
        return {
            iconImageStorage,
            
            dataArray: [],
        }
    },

    methods:{
        // Data recieved is a blob object
        changeData(event){

            const files = event.target.files;
            if(files.length === 0) return;

            // For each file inputted
            for(let i = 0; i < files.length; i++){
                if(files[i].type.split("/")[1] != this.fileType) continue; // Not the specified type

                // // Create a blob for each file
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

</style>