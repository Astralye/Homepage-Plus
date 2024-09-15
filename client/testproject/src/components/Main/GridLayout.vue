<template>
    <div class="fill grid base-margin border-box"
        ref="container"
        >
        <template v-for="(item, index) in m_Rows * m_Columns" :key="index">
            <div class="grid-item">
                <div class="flex-center">
                    {{ index }} 
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { containerData } from '../../Data/containerData';

export default {
    props:{
        component_ID: {
            type: String,
            default: "",
            required: true
        },
        update_Grid_Flag: {
            type: Boolean,
            default: false,
        }
    },
    created(){
        this.m_containerData = this.getContainerData();
        this.setDimension();
        this.m_iconSize = containerData.getIconSize(this.component_ID);
    },
    beforeUpdate(){
        console.log(this.update_Grid_Flag)
    },
    data(){
        return{
            m_containerData: null,
            
            m_Column_Data: "",
            m_Column_Gap: "",

            m_Rows_Data: "",
            m_Row_Gap: "",

            m_Rows: 0,
            m_Columns: 0, 

            m_iconSize: 0,
        }
    },
    methods: {
        getContainerData(){ return containerData.getObjectFromID(this.component_ID); },

        // Dimension is stored as 'C,R'
        setRowColData(dimString){
            dimString = dimString.split(',');
            this.m_Rows    = Number(dimString[0]);
            this.m_Columns = Number(dimString[1]);

            this.m_Column_Data = "1fr ".repeat(dimString[0]);
            this.m_Rows_Data   = "1fr ".repeat(dimString[1]);
        },

        setDimension(){
            let dim = containerData.getGridDimension(this.component_ID);
            this.setRowColData(dim);
            this.calculateGridGap();
        },

        /*
            This calcualtes grid gap

            There are bugs when there is only 1 row/ column as there is no grid gap.
            Will need to take into consideration.
        */

        calculateGridGap(){
            this.$nextTick( () => {
                let data = this.$refs["container"].getBoundingClientRect();

                let columnGap = (data.width  - (this.m_iconSize * this.m_Rows))    / ( this.m_Rows - 1 );
                let rowGap    = (data.height - (this.m_iconSize * this.m_Columns)) / ( this.m_Columns - 1 );

                this.m_Column_Gap = `${columnGap}px`;
                this.m_Row_Gap    = `${rowGap}px`;
            })
        },
    },
    watch: {
        'm_containerData.gridData.gridDimensions'(){ this.setDimension(); },
        '$GlobalStates.value.edit.windowSize':{
            handler(val,oldval){ this.calculateGridGap(); },
            deep: true
        },
        'update_Grid_Flag'(){
            this.calculateGridGap();
        }
    }
}
</script>

<style scoped>
.border-box{
    box-sizing: border-box;
}

.flex-center{
    display: flex;
    justify-content: center;
    align-content: center;
}

.grid-item{
    border: solid white 1px;
}

.fill{
    width:  100%;
    height: 100%;
}

.grid{
    display: grid;
    grid-template-columns: v-bind("m_Column_Data");
    grid-template-rows:    v-bind("m_Rows_Data");

    grid-row-gap:    v-bind("m_Row_Gap");
    grid-column-gap: v-bind("m_Column_Gap");

    /* 
    
    grid-row-gap + grid-column-gap has to be calculated manually.

    Static widths for the box causes the program to go all buggy.
    Instead, change the sizes of the row + column gaps via calculation to ensure the values are static.
    
    */
}


</style>