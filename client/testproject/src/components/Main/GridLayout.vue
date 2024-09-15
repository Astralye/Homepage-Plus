<template>
    <div class="fill grid base-margin border-box">
        <template v-for="(item, index) in m_Rows * m_Columns" :key="index">
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
            m_Column_Data: "",
            m_Rows_Data: "",

            m_Rows: 0,
            m_Columns: 0, 
        }
    },
    methods: {
        getContainerData(){ return containerData.getObjectFromID(this.componentID); },

        // Dimension is stored as 'C,R'
        setRowColData(dimString){
            dimString = dimString.split(',');
            this.m_Rows    = Number(dimString[0]);
            this.m_Columns = Number(dimString[1]);

            this.m_Column_Data = "1fr ".repeat(dimString[0]);
            this.m_Rows_Data   = "1fr ".repeat(dimString[1]);
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
    width:  100%;
    height: 100%;
    background-color: goldenrod;
}

.fill{
    width:  100%;
    height: 100%;
}

.grid{
    display: grid;
    grid-template-columns: v-bind("m_Column_Data");
    grid-template-rows:    v-bind("m_Rows_Data");

    grid-row-gap: 5px;
    grid-column-gap: 5px;

    /* 
    
    grid-row-gap + grid-column-gap has to be calculated manually.

    Static widths for the box causes the program to go all buggy.
    Instead, change the sizes of the row + column gaps via calculation to ensure the values are static.
    
    */
}

.base-margin{
    padding: 0.5em;
}

</style>