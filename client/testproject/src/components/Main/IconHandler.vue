<template>
    <div class="center iconContainer noselect">

        <div class="center fit-content">
            <SVGIcon
            :name="icon_data.iconImage"
            @dblclick="(this.$GlobalStates.value.edit.enabled) ? null : openLink()"
            />
        </div>

        <div class="center fit-content text-padding">
            <p>
                {{ iconText }}
            </p>
        </div>
    </div>
</template>

<script>
import SVGIcon from '../Input Components/SVGIcon.vue';

// This will be drag and drop.
export default {
    components: {
        SVGIcon
    },
    props:{
        icon_data: {
            type: Object,
            default: null,
            required: true,
        },
    },
    data(){
        return{
            iconText: ""
        }
    },
    created(){
        this.iconText = this.icon_data.iconString; 
    },
    methods: {
        openLink(){
            window.open(this.icon_data.link, '_blank');
        }
    },
    watch: {
        'icon_data':{
            handler(val){ this.iconText = val.iconString },
            deep: true            
        }
    }
}
</script>

<style scoped>
@import '../../assets/main.css';

.iconContainer{
    width: 100%;
}

.text-padding{
    padding-top: 0.3em;
}

.tmpIcon{
    width: 90px;
    height: 90px;
    background-color: cadetblue;
}

.fit-content{
    max-width: fit-content;
}

.flex{
    display: flex;
}

.center{
    margin: auto;
}

</style>