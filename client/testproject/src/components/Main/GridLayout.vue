<template>
    <div class="fill grid base-margin border-box">
        <template v-for="(item, index) in 5" :key="index">

            <!-- Bug!
                When the drag slider tries to become smaller than the size of N containers, it breaks.  
            -->
            <div class="tmpbox"> {{index}} </div>
        </template>
    </div>
</template>

<script>
import { containerData } from '../../Data/containerData';

export default {
    props:{
        componentID: {
            type: String,
            default: "",
            required: true
        }
    },
    created(){
        this.m_containerData = this.getContainerData();
        this.setDimension();
    },
    data(){
        return{
            m_containerData: null,
            m_columns: "",
            m_rows: "",
        }
    },
    methods: {
        getContainerData(){ return containerData.getObjectFromID(this.componentID); },

        // Dimension is stored as 'C,R'
        setRowColData(dimString){
            dimString = dimString.split(',');

            console.log(dimString);

            this.m_columns = "1fr ".repeat(dimString[0]);
            this.m_rows    = "1fr ".repeat(dimString[1]);
        },

        setDimension(){
            let dim = containerData.getGridDimension(this.componentID);
            this.setRowColData(dim);
        },
    },
    watch: {
        'm_containerData.gridData.gridDimensions'(){ this.setDimension(); }
    }
}
</script>

<style scoped>
.border-box{
    box-sizing: border-box;
}

.tmpbox{
    width: 100px;
    background-color: goldenrod;
}

.fill{
    width: 100%;
    height: 100%;
}

.grid{
    display: grid;
    grid-template-columns: v-bind("m_columns");
    grid-template-rows:    v-bind("m_rows");

    grid-row-gap: 2px;
    grid-column-gap: 2px;
}

.base-margin{
    padding: 0.5em;
}

</style>