<template>
   <v-dialog
    v-model="showDialog"
    :title="dialogTitle"
    :close-on-click-modal="closeOnClickModal"
    :modal="true"
    @confirm="handleConfirm"
    @open="handleOpen"
    @after-close="handleAfterClose"
    @cancel="handleCancel"
  >
      <!-- <v-select :options="selectOption"></v-select> -->
  </v-dialog>
</template>

<script>

export default {
    data() {
      return {
        showDialog: true,
        showBigDialog: false,
        closeOnClickModal: true,
        dialogTitle: "对话框的标题",

        showDialog1: false,
        closeOnClickModal1: false,
        selectOption: [
        {
          value: "1",
          label: "选项一"
        },
        {
          value: "2",
          label: "选项二",
          disabled: true
        },
        {
          value: "3",
          label: "选项三"
        },
        {
          value: "4",
          label: "选项四"
        }
      ]
      };
    },
    methods: {
      handleButtonClick() {
        this.showDialog = !this.showDialog;
      },
      handleButtonClick1() {
        this.showDialog1 = !this.showDialog1;
      },
      handleConfirm() {
        console.log(`Emit CONFIRM event, timestamp: ${new Date().getTime()}`);
        this.handleButtonClick();
      },
      handleOpen() {
        console.log(`Emit OPEN event, timestamp: ${new Date().getTime()}`);
      },
      handleAfterClose() {
        console.log(
          `Emit AFTER-CLOSE event, timestamp: ${new Date().getTime()}`
        );
      },
      handleCancel() {
        console.log(`Emit CANCEL event, timestamp: ${new Date().getTime()}`);
      },
      handleDialogInputClick() {
        this.showInputDialog = !this.showInputDialog;
      },
      handleBigClick() {
        this.showBigDialog = !this.showBigDialog;
      }
    }
  }

</script>

<style>

</style>