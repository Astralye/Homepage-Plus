<template>
    <div class="tab-container block">

        <!-- For the buttons at the top -->
        <div class="flex button-margins">
            <template v-for="(item, index) in tab_Buttons" :key="index">
                <SingleButton
                    @click="enabler(index)"
                    :button_toggle="true"
                    :enabled="enabled"
                    :m_IconString="item.icon_Image">
                {{ item.text }}
                </SingleButton>
            </template>
        </div>

        <hr>

        <div>
            <template v-for="(item, index) in tab_Buttons" :key="index">
                <slot :name="'Tab-'+ index" v-if="isIndexEnabled(index)"> </slot>
            </template>
        </div>
    </div>
</template>

<!-- 

    For each template, requires an ID in the parent to be used

    <template #Tab-{{no.}}>
    ...

-->


<script>
import SingleButton from '../Input Components/SingleButton.vue';

export default {
    components:{
        SingleButton,
    },
    props:{
        default_Tab:{
            type: Number,
            default: -1, 
        },
        tab_Buttons: {
            type: Array,
            required: true,
        },
        enabled:{
            type: Boolean,
            default: true,
        }

        /*
            For each button for a tab, requires text and an icon image.
            {
                text='text',
                icon_Image='Remove_Select'
            }
        */
    },
    emits: [ 'update' ],
    data() {
      return {
        selectedIndex: 0,

        states: [],
      }
    },
    created(){
        this.generateValues();
        this.setDefault();
    },
    methods:{

        // On creation, automatically show the tab
        setDefault(){
            if(this.default_Tab < 0) return;
            this.states[this.default_Tab].render = true;
        },

        // Creates the states of the tabs on creation.
        generateValues(){
            for(let i = 0; i < this.tab_Buttons.length; i++){
                this.states.push(
                    {
                        render: false,
                    }
                );
            }
        },

        resetAll(){
            this.states.forEach(el => { el.render = false; });
        },

        enableIndex(index){
            this.states[index].render = true;
        },

        enabler(index){
            this.resetAll();
            this.enableIndex(index);
            this.$emit('update', this.tab_Buttons[index].text);
        },

        isIndexEnabled(index){
            return (this.states[index].render);
        }
    },
    watch:{
        // Change the tab
        'default_Tab'(val){
            if(val === -1){ this.resetAll(); return; }
            this.enabler(val);
        }
    }
}
</script>

<style scoped>

.button-margins{
    margin-bottom: 0.5em;
}

.flex{
    display: flex;
}

.block{
    display: block;
}

.tab-buttons{
    flex-direction: row;
}
</style>