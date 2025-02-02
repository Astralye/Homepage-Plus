import { reactive } from 'vue'

export class EditVariables{
    constructor(){ this.values = {
        enabled: false,
        containerSelected: null,  // ID of the container selected

        dragStepSize: 0.25,
        resetSelect: false,

        // Drag icon origin data to display
        iconDragData: null,

        isIconSelector: null,

        activeContainerSelection: false,
        recalculateLayout: false,

        activeLayoutWindow:    false,
        activeContainerWindow: false,
        activeAppearanceWindow: false,

        isRenderFinalNode: false, // Renders the final node due to tree structure
        containerSelectionMode: false,
        parentIDGridUpdate: "",

        // For a single frame, it turns on to be detected by watchers
        resetFlag: false,

        // Variables that can be modified within the settings.
        userSettings:{
            enabledSiteContextMenu: true,
    
            modalToggle:{
                delete: true,
                cancel: true,
            },
        },

        userAppearanceSettings: {}
        // To avoid repetition, it is set via the resetters
    };

    this.resetAppearance();
}
    
    // Grids setter
    setAppearance_Grid_applyGlobal(val)    { this.values.userAppearanceSettings.grids.isApplyGlobal = val; }
    setAppearance_Grid_showIconLabel(val)  { this.values.userAppearanceSettings.grids.isDisableIconLabels = val; }
    setAppearance_Grid_globalIconSize(val) { this.values.userAppearanceSettings.grids.globalIconSize = val; }
    setAppearance_Grid_gridSize(val)       { this.values.userAppearanceSettings.grids.globalGridItemSize = val; }

    // List setter
    setAppearance_List_applyGlobal(val)    { this.values.userAppearanceSettings.list.isApplyGlobal = val; }
    setAppearance_List_showIcons(val)      { this.values.userAppearanceSettings.list.isDisableIcons = val; }
    setAppearance_List_displayDivider(val) { this.values.userAppearanceSettings.list.globalDisplayListDivider = val;}
    
    // Set by vmodel
    // setAppearance_List_globalPadding(val)    { this.values.userAppearanceSettings.list.globalitemHeight = val; }
    // setAppearance_List_globalItemHeight(val) { this.values.userAppearanceSettings.list.globalPadding = val; }

    // font setter
    setAppearance_Font_applyGlobal(val)    { this.values.userAppearanceSettings.font.isApplyGlobal = val; }
    setAppearance_Font_type(val)           { this.values.userAppearanceSettings.font.type = val; }
    // setAppearance_Font_size(val)           { this.values.userAppearanceSettings.font.size = val; }
    setAppearance_Font_textBackground(val) { this.values.userAppearanceSettings.font.enableTextBackground = val; }
    setAppearance_Font_overrideAuto(val)   { this.values.userAppearanceSettings.font.isOverrideAutoColour = val; }
    setAppearance_Font_colour(val)         { this.values.userAppearanceSettings.font.colour = val; }

    // icon setter
    setAppearance_Icon_applyGlobal(val) { this.values.userAppearanceSettings.icons.isApplyGlobal = val; }
    setAppearance_Icon_useTertiary(val) { this.values.userAppearanceSettings.icons.isUseTertiary = val; }
    setAppearance_Icon_colour(val)      { this.values.userAppearanceSettings.icons.colour = val; }

    // container header Setter
    setAppearance_Header_applyGlobal(val)  { this.values.userAppearanceSettings.containerHeader.isApplyGlobal = val; }
    setAppearance_Header_type(val)         { this.values.userAppearanceSettings.containerHeader.font.type = val; }
    // setAppearance_Header_size(val)         { this.values.userAppearanceSettings.containerHeader.font.size = val; }
    setAppearance_Header_overrideAuto(val) { this.values.userAppearanceSettings.containerHeader.font.isOverrideAutoColour = val; }
    setAppearance_Header_colour(val)       { this.values.userAppearanceSettings.containerHeader.font.colour = val; }

    // container all Setter
    setAppearance_Cont_applyGlobal(val)     { this.values.userAppearanceSettings.containerAll.isApplyGlobal = val; }
    setAppearance_Cont_showBorder(val)      { this.values.userAppearanceSettings.containerAll.isDisplayContainerBorder = val; }
    setAppearance_Cont_borderThickness(val) { this.values.userAppearanceSettings.containerAll.borderThickness = val; }
    setAppearance_Cont_borderRadius(val)    { this.values.userAppearanceSettings.containerAll.borderRadius = val; }

    resetAppearance(){
        this.resetAppearance_Grid()
        this.resetAppearance_List()
        this.resetAppearance_Font()
    
        this.resetAppearance_Icon()
        this.resetAppearance_Header()
        this.resetAppearance_Cont()
    }

    // For new profiles
    get defaultUserSettings(){
        return {
            enabledSiteContextMenu: true,
        
            modalToggle:{
                delete: true,
                cancel: true,
            }
        }
    }

    get defaultAppearanceData(){
        return {
            grids: {
                isApplyGlobal: true,
                isDisableIconLabels: true,
                globalIconSize: "75px",
                globalGridItemSize: 125,
            },
            list:{
                isApplyGlobal: true,
                isDisableIcons: true,
                globalDisplayListDivider: true,
                globalitemHeight: "auto",
                globalPadding: "1em",
            },
            font:{
                isApplyGlobal: true,
                isDisableIcons: true,
                globalDisplayListDivider: true,
                globalitemHeight: "auto",
                globalPadding: "1em",
            },
            icons:{
                isApplyGlobal: true,
                isUseTertiary: true,
                colour: "#000000",    
            },
            containerHeader:{
                isApplyGlobal: true,
                font:{
                    type: "arial",
                    size: "24px",                    
                    isOverrideAutoColour: false,
        
                    colour: "#000000",
                }
            },
            containerAll:{
                isApplyGlobal: true,
                isDisplayContainerBorder: false,
        
                borderThickness: "2px",
                borderRadius: "4px",
            }
        }
    }

    // Resetters
    resetAppearance_Grid(){
        this.values.userAppearanceSettings.grids = {
            isApplyGlobal: true,
            isDisableIconLabels: true,
            globalIconSize: "75px",
            globalGridItemSize: 125,
        };
    }
    resetAppearance_List(){
        this.values.userAppearanceSettings.list = {
            isApplyGlobal: true,
            isDisableIcons: true,
            globalDisplayListDivider: true,
            globalitemHeight: "auto",
            globalPadding: "1em",
        };
    }
    resetAppearance_Font(){
        this.values.userAppearanceSettings.font ={
            isApplyGlobal: true,
            type: "arial",
            size: "16px",
            enableTextBackground: false,
            isOverrideAutoColour: false,

            colour: "white",
        };
    }

    resetAppearance_Icon(){
        this.values.userAppearanceSettings.icons = {
            isApplyGlobal: true,
            isUseTertiary: true,
            colour: "#000000",
        };    
    }
    resetAppearance_Header(){
        this.values.userAppearanceSettings.containerHeader = {
            isApplyGlobal: true,
            font:{
                type: "arial",
                size: "24px",                    
                isOverrideAutoColour: false,
    
                colour: "#000000",
            }
        };
    }
    resetAppearance_Cont(){
        this.values.userAppearanceSettings.containerAll = {
            isApplyGlobal: true,
            isDisplayContainerBorder: false,
    
            borderThickness: "2px",
            borderRadius: "4px",
        };
    }



    // Getter will only be the object, will have to navigate the object to retrieve it.
    get appearanceGrid(){ return this.values.userAppearanceSettings.grids; }
    get appearanceList(){ return this.values.userAppearanceSettings.list; }
    get appearanceFont(){ return this.values.userAppearanceSettings.font; }
    get appearanceIcon(){ return this.values.userAppearanceSettings.icons; }
    get appearanceHeader(){ return this.values.userAppearanceSettings.containerHeader; }
    get appearanceCont(){ return this.values.userAppearanceSettings.containerAll; }

    /*

    Todo:

        User appearance settings

        Save, delete, load

        Export, Import

    */



    enableEdit() { this.values.enabled = true; }
    disableEdit(){ this.values.enabled = false; }

    enableResetSelect() { this.values.resetSelect = true; }
    disableResetSelect(){ this.values.resetSelect = false; }

    enableLayoutWindow() { this.values.activeLayoutWindow = true; }
    disableLayoutWindow(){ this.values.activeLayoutWindow = false; }

    enableContainerWindow() { this.values.activeContainerWindow = true; }
    disableContainerWindow(){ this.values.activeContainerWindow = false; }

    enableAppearanceWindow() { this.values.activeAppearanceWindow = true; }
    disableAppearanceWindow(){ this.values.activeAppearanceWindow = false; }

    enableRecalculation() { this.values.recalculateLayout = true; }
    disableRecalculation(){ this.values.recalculateLayout = false; }

    enableIsIconSelector() { this.values.isIconSelector = true; }
    disableIsIconSelector(){ this.values.isIconSelector = false; }

    enableRenderFinalNode() { this.values.isRenderFinalNode = true; }
    disableRenderFinalNode(){ this.values.isRenderFinalNode = false; }

    enableContainerSelection() { this.values.containerSelectionMode = true; }
    disableContainerSelection(){ this.values.containerSelectionMode = false; }

    enableResetFlag(){ this.values.resetFlag = true; }
    disableResetFlag(){ this.values.resetFlag = false; }

    selectionContainerToggler(){
        this.values.activeContainerSelection = (this.values.activeLayoutWindow || this.values.activeContainerWindow || this.values.activeAppearanceWindow);
    }

// Setters

    setEdit(val){ this.values.enabled = val } // Only boolean values
    setContainerSelected(cont){ this.values.containerSelected = cont; }
    setDragStepSize(val) { this.values.dragStepSize = val; }
    setIconDragData(val) { this.values.iconDragData = val; }
    setParentID(val)     { this.values.parentIDGridUpdate = val; }
    resetParentID()      { this.setParentID(null); }
    resetIconDragData()  { this.setIconDragData(null); }

    // User modifiers

    resetModal(){ this.setDeleteModal(true); this.setCancelModal(true); }
    setDeleteModal(val){ this.values.userSettings.modalToggle.delete = val; }
    setCancelModal(val){ this.values.userSettings.modalToggle.cancel = val; }
    setStateContextMenu(val){ this.values.userSettings.enabledSiteContextMenu = val; }

    loadUserSettings(val) { this.values.userSettings = val;}
    
    loadUserAppearance(data){
        this.values.userAppearanceSettings.grids = data.grids;
        this.values.userAppearanceSettings.list = data.list;
        this.values.userAppearanceSettings.font = data.font;
        this.values.userAppearanceSettings.icons = data.icons;
        this.values.userAppearanceSettings.containerHeader = data.containerHeader;
        this.values.userAppearanceSettings.containerAll = data.containerAll;

        
        if(data.font.isOverrideAutoColour){
            this.updateTextColour(data.font.colour);
            this.updateHeaderColour(data.font.colour);
        }
        if(data.containerHeader.font.isOverrideAutoColour){
            this.updateHeaderColour(data.containerHeader.font.colour);
        }
    }

    updateHeaderColour(colour){
        document.documentElement.style.setProperty("--Header-colour", colour);
    }

    updateTextColour(colour){
        document.documentElement.style.setProperty("--Theme-c-dark-2", colour);
    }

// Getters
    get isEnabled() { return this.values.enabled; }
    get containerSelected(){ return this.values.containerSelected; }
    get windowSize() { return this.values.windowSize; }
    get recalculateLayout() { return this.values.recalculateLayout; }
    get dragStepSize() { return this.values.dragStepSize; }
    get resetSelect()  { return this.values.resetSelect;  }
    get iconDragData() { return this.values.iconDragData; }
    get isIconSelector(){ return this.values.isIconSelector; }
    get isRenderFinalNode(){ return this.values.isRenderFinalNode; }
    get containerSelectionMode() { return this.values.containerSelectionMode; }
    get parentID() { return this.values.parentIDGridUpdate; }

    get resetFlag() { return this.values.resetFlag; }

    // User modifiers
    get userSettings()  { return this.values.userSettings; }
    get userAppearanceSettings(){ return this.values.userAppearanceSettings; }

    get isShowDeleteModal(){ return this.values.userSettings.modalToggle.delete; }
    get isShowCancelModal(){ return this.values.userSettings.modalToggle.cancel; }

    get isEnabledSiteContextMenu(){ return this.values.userSettings.enabledSiteContextMenu; }
    get isContainerSelectionValid(){ return this.values.activeContainerSelection; }

}

const EditVariablesInstance = new EditVariables;
export const editVariables = reactive(EditVariablesInstance);