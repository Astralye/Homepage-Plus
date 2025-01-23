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

        userAppearanceSettings:{
            grids:{
                isApplyGlobal: true,
                isDisableIconLabels: false,
                globalIconSize: "4em",
                globalGridItemSize: "8em",
            },
            list:{
                isApplyGlobal: true,
                isDisableIcons: false,
                globalPadding: "1em",
                globalitemHeight: "1em",
            },

            font:{
                type: "arial",
                size: "12px",
                enableTextBackground: false,
                isOverrideAutoColour: true,

                colour: "black",
            },

            icons:{
                isApplyGlobal: true,
                iconColour: "#000000",
                isUseTertiary: true,
            },

            containerHeader:{
                isApplyGlobal: true,
                font:{
                    type: "arial",
                    size: "12px",                    
                    isOverrideAutoColour: true,

                    colour: "white",
                },
            },

            containerAll:{
                isApplyGlobal: true,
                isDisplayContainerBorder: false,

                borderThickness: "2px",
                borderRadius: "5px",
            }
        }
    }}

    enableEdit() { this.values.enabled = true; }
    disableEdit(){ this.values.enabled = false; }

    enableResetSelect() { this.values.resetSelect = true; }
    disableResetSelect(){ this.values.resetSelect = false; }

    enableLayoutWindow() { this.values.activeLayoutWindow = true; }
    disableLayoutWindow(){ this.values.activeLayoutWindow = false; }

    enableContainerWindow() { this.values.activeContainerWindow = true; }
    disableContainerWindow(){ this.values.activeContainerWindow = false; }

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
        this.activeContainerSelection = (this.values.activeLayoutWindow || this.values.activeContainerWindow);
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

    loadUserSettings(val){ this.values.userSettings = val;}

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
    get userSettings(){ return this.values.userSettings; }

    get isShowDeleteModal(){ return this.values.userSettings.modalToggle.delete; }
    get isShowCancelModal(){ return this.values.userSettings.modalToggle.cancel; }

    get isEnabledSiteContextMenu(){ return this.values.userSettings.enabledSiteContextMenu; }

}

const EditVariablesInstance = new EditVariables;
export const editVariables = reactive(EditVariablesInstance);