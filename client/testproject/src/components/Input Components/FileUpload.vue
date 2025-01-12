<template>

    <input 
        type="file"
        @change="test"
        capture
        multiple
        accept=".json"
    >
</template>

<script>
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
                dataArray: [],
            }
        },

        // Data recieved is a blob object
        methods:{
            test(event){

                const files = event.target.files;
                if(files.length === 0) return;

                
                for(let i = 0; i < files.length; i++){
                    if(files[i].type.split("/")[1] != this.fileType) continue; // Not the specified type

                    // Create a blob for each file
                    const blob = new Blob([files[i]], { type: files[i].type})

                    var fr = new FileReader();

                    fr.onload = () => {
                        
                        var obj = JSON.parse(fr.result);
                        
                        this.$emit('changeData', obj);
                    };
                    fr.readAsText(blob);
                }
            }
        }
    }
</script>

<style scoped>

</style>