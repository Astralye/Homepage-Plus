import { reactive } from 'vue'

export class EditVariables{
    constructor(){ this.values = {
        enabled: false,
        containerSelected: null,  // ID of the container selected

        dragStepSize: 0.25,
        resetSelect: false,
        iconDragData: null, // Object, storedContainer + storedID

        isIconSelector: null,

        activeContainerSelection: false,
        recalculateLayout: false,

        activeLayoutWindow:    false,
        activeContainerWindow: false,

        isRenderFinalNode: false, // Renders the final node due to tree structure
        containerSelectionMode: false,
        parentIDGridUpdate: "",

        // Variables that can be modified within the settings.

        modalToggle:{
            delete: true,
            cancel: true,
        },

        // For a single frame, it turns on to be detected by watchers
        resetFlag: false,
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
    setDeleteModal(val){ this.values.modalToggle.delete = val; }
    setCancelModal(val){ this.values.modalToggle.cancel = val; }

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

    get isShowDeleteModal(){ return this.values.modalToggle.delete; }
    get isShowCancelModal(){ return this.values.modalToggle.cancel; }

}

const EditVariablesInstance = new EditVariables;
export const editVariables = reactive(EditVariablesInstance);