<template>
  <main-content class="camera" :title="_('Camera')">
    <v-tabs v-model="cameraType" @tab-click="tabChange">
      <!-- 已添加摄像机 -->
      <v-tab-pane :label="_('Added Camera')" value="added">
        <div class="added-camera">
          <h3 class="camera-title">{{ _("Added Camera") }}</h3>
          <div class="camera-btns">
            <v-button type="primary" @click="handleAdd">{{
              _("Add")
            }}</v-button>
            <v-button
              type="primary"
              :disabled="deleteSelect.length > 0 ? false : true"
              @click="handleDelete"
              >{{ _("Delete") }}</v-button
            >
          </div>
          <div class="camera-table">
            <v-table
              ref="addedTableRef"
              :data="addedTable"
              @after-update="updateAddedTable"
            >
              <v-table-col
                type="selection"
                prop="select"
                width="48px"
              ></v-table-col>
              <v-table-col
                prop="channel"
                :label="_('Channel')"
                :format="tableFormat"
                width="60px"
              >
              </v-table-col>
              <v-table-col
                prop="title"
                :label="_('Channel Name')"
                width="138px"
              >
                <template v-slot="slotProps">
                  <div
                    class="tabel-ellipsis"
                    v-tooltip="{
                      effect: 'light',
                      position: 'bottom-left',
                      showOnlyEllipsis: true,
                      enterable: false,
                      betweenSpace: 4,
                      content: slotProps.title
                    }"
                  >
                    {{ slotProps.title }}
                  </div>
                </template>
              </v-table-col>
              <v-table-col
                prop="ip"
                :label="_('IP Address')"
                width="145px"
              ></v-table-col>
              <v-table-col prop="model" :label="_('Model')" width="140px">
                <template v-slot="slotProps">
                  <div
                    class="tabel-ellipsis"
                    v-tooltip="{
                      effect: 'light',
                      position: 'bottom-left',
                      showOnlyEllipsis: true,
                      enterable: false,
                      betweenSpace: 4,
                      content: slotProps.model
                    }"
                  >
                    {{ slotProps.model }}
                  </div>
                </template>
              </v-table-col>
              <v-table-col
                prop="status"
                :label="_('Connection Status')"
                width="224px"
              >
                <template v-slot="slotProps">
                  <div
                    class="tabel-ellipsis"
                    v-tooltip="{
                      effect: 'light',
                      position: 'bottom-left',
                      showOnlyEllipsis: true,
                      enterable: false,
                      betweenSpace: 4,
                      content: slotProps.statusContent
                    }"
                  >
                    <span
                      v-if="slotProps.status !== 1"
                      :class="slotProps.statusClass"
                    ></span>
                    <span>{{ slotProps.statusContent }}</span>
                  </div>
                </template>
              </v-table-col>
              <v-table-col prop="sn" :label="_('S/N')" width="168px">
                <template v-slot="slotProps">
                  <div
                    class="tabel-ellipsis"
                    v-tooltip="{
                      effect: 'light',
                      position: 'bottom-left',
                      showOnlyEllipsis: true,
                      enterable: false,
                      betweenSpace: 4,
                      content: slotProps.sn
                    }"
                  >
                    {{ slotProps.sn }}
                  </div>
                </template>
              </v-table-col>
              <v-table-col prop="version" :label="_('Version')" width="158px">
                <template v-slot="slotProps">
                  <div
                    class="tabel-ellipsis"
                    v-tooltip="{
                      effect: 'light',
                      position: 'bottom-left',
                      showOnlyEllipsis: true,
                      enterable: false,
                      betweenSpace: 4,
                      content: slotProps.version
                    }"
                  >
                    {{ slotProps.version }}
                  </div>
                </template></v-table-col
              >
              <v-table-col
                prop="protocol"
                :label="_('Protocol')"
                width="88px"
                :format="tableFormat"
              ></v-table-col>
              <v-table-col
                prop="port"
                :label="_('Port')"
                width="75px"
              ></v-table-col>
              <v-table-col
                prop="operation"
                :label="_('Operation')"
                width="186px"
              >
                <template v-slot="slotProps">
                  <section class="operation">
                    <div class="operation-icon" @click="handleEdit(slotProps)">
                      <i
                        class="icon-edit icon-button-status"
                        v-tooltip="{
                          enterable: false,
                          betweenSpace: 8,
                          content: _('Edit')
                        }"
                      ></i>
                    </div>
                    <div
                      class="operation-icon"
                      @click="handleDelete(slotProps)"
                    >
                      <i
                        class="icon-table-delete icon-button-status"
                        v-tooltip="{
                          enterable: false,
                          betweenSpace: 8,
                          content: _('Delete')
                        }"
                      ></i>
                    </div>
                    <div
                      class="operation-icon"
                      @click="handleUpgrade(slotProps)"
                    >
                      <i
                        class="icon-upgrade icon-button-status"
                        :class="{ disabled: slotProps.protocol === 2 }"
                        v-tooltip="{
                          enterable: false,
                          betweenSpace: 8,
                          content: _('Upgrade'),
                          trigger: slotProps.protocol === 2 ? 'manual' : 'hover'
                        }"
                      ></i>
                    </div>
                  </section>
                </template>
              </v-table-col>
            </v-table>
          </div>
        </div>
      </v-tab-pane>
      <!-- 在线摄像机 -->
      <v-tab-pane :label="_('Online Camera')" value="online">
        <div class="online-camera">
          <v-form
            v-if="hasAutoAddLAN"
            class="auto-add-camera"
            :model="autoAddFormData"
          >
            <v-form-item
              class="auto-add-item"
              :label="_('Auto Add LAN Cameras')"
            >
              <v-switch
                v-model="autoAddFormData.enable"
                @change="changeAutoAddEnable"
              ></v-switch>
            </v-form-item>
          </v-form>

          <div class="online-camera-title">
            <h3 class="camera-title">{{ _("Online Camera") }}</h3>
            <i
              class="icon-refresh camera-refresh icon-button-status"
              v-tooltip="{
                enterable: false,
                betweenSpace: 4,
                content: _('Refresh')
              }"
              @click="updataTable"
            ></i>
          </div>

          <div class="camera-btns">
            <v-button
              type="primary"
              @click="batchInsert"
              :disabled="addSelect.length > 0 ? false : true"
              >{{ _("u#ETD#Add") }}</v-button
            >
          </div>

          <div class="camera-table">
            <v-table
              ref="onlineTableRef"
              :show-page-border="true"
              :data="onlineTable"
              is-pagination
              is-change-size
              is-input-page
              :is-loading="tableLoading"
              @after-update="updateOnlineTable"
              :beforeSelectAll="beforeSelectAll"
              :is-select-all-disabled="onlineTableAllDisabled"
            >
              <v-table-col
                type="selection"
                prop="select"
                width="48px"
                :get-disabled="onlineTabledisabled"
              ></v-table-col>
              <v-table-col
                type="index"
                width="60px"
                prop="_id"
                :label="_('No.')"
              ></v-table-col>
              <v-table-col prop="ip" :label="_('IP Address')" width="142px">
              </v-table-col>
              <v-table-col prop="model" :label="_('Model')" width="142px">
                <template v-slot="slotProps">
                  <div
                    class="tabel-ellipsis"
                    v-tooltip="{
                      effect: 'light',
                      position: 'bottom-left',
                      showOnlyEllipsis: true,
                      enterable: false,
                      betweenSpace: 4,
                      content: slotProps.model
                    }"
                  >
                    {{ slotProps.model }}
                  </div>
                </template>
              </v-table-col>
              <v-table-col
                prop="status"
                :label="_('Status')"
                width="142px"
                :format="tableFormat"
              ></v-table-col>
              <v-table-col prop="sn" :label="_('S/N')" width="142px">
                <template v-slot="slotProps">
                  <div
                    class="tabel-ellipsis"
                    v-tooltip="{
                      effect: 'light',
                      position: 'bottom-left',
                      showOnlyEllipsis: true,
                      enterable: false,
                      betweenSpace: 4,
                      content: slotProps.sn
                    }"
                  >
                    {{ slotProps.sn }}
                  </div>
                </template>
              </v-table-col>
              <v-table-col
                prop="protocol"
                :label="_('Protocol')"
                width="105px"
                :format="tableFormat"
              ></v-table-col>
              <v-table-col
                prop="port"
                :label="_('Port')"
                width="105px"
                :format="tableFormat"
              ></v-table-col>
              <v-table-col
                prop="operation"
                :label="_('Operation')"
                width="186px"
              >
                <template v-slot="slotProps">
                  <section class="operation">
                    <div
                      v-if="hasAutoAddLAN"
                      class="operation-icon"
                      @click="handleOnlineEdit(slotProps)"
                    >
                      <i
                        class="icon-smooth-setting icon-button-status"
                        v-tooltip="{
                          enterable: false,
                          betweenSpace: 8,
                          content: _('Edit')
                        }"
                      ></i>
                    </div>
                    <div class="operation-icon" @click="handleAdd(slotProps)">
                      <i
                        class="icon-add icon-button-status"
                        v-tooltip="{
                          enterable: false,
                          betweenSpace: 8,
                          content: _('Add')
                        }"
                      ></i>
                    </div>
                  </section>
                </template>
              </v-table-col>
            </v-table>
          </div>
        </div>
      </v-tab-pane>
    </v-tabs>
    <!-- 编辑摄像机 -->
    <edit-camera
      v-model="showEditCamera"
      :form-data="editCameraForm"
      :after-confirm="updataTable"
    ></edit-camera>
    <!-- 编辑/设置在线摄像机 -->
    <edit-online-camera
      v-model="showEditOnlineDialog"
      :form-data="editOnlineFormData"
      :after-confirm="updataTable"
    ></edit-online-camera>
    <!-- 删除摄像机 -->
    <v-dialog
      v-model="showDeleteCamera"
      :title="_('Delete the camera')"
      :width="400"
      @confirm="confirmDelete"
    >
      <div class="deleteCamera">
        <span>{{
          deleteType
            ? _("Do you want to delete the selected cameras?")
            : _("Do you want to delete the camera?")
        }}</span>
      </div>
    </v-dialog>
    <!-- 添加摄像机 -->
    <!-- <add-camera ref="addCamera" @add-success="updataAllTable"></add-camera> -->
    <add-camera
      v-model="showAddCamera"
      :form-data="addCameraForm"
      :after-confirm="updataAllTable"
    ></add-camera>
    <!-- 升级摄像机 -->
    <upgrade-camera
      v-model="showUpgradeCamera"
      :after-confirm="uploadSuccess"
    />
    <process
      v-model="showProcess"
      :duration="0"
      ref="progress"
      :value="percent"
      :text="_('Upgrading %s camera, please wait…')"
      :redirect="false"
    >
      <div v-if="isSuccess" class="upgrade-status">
        <i class="icon-full-success"></i
        >{{ _("Upgrading succeeded. Please wait for the camera to reboot…") }}
      </div>
      <div v-else-if="isError" class="upgrade-status">
        <i class="icon-full-error"></i
        >{{ _("Upgrade failed (upgrade file error)") }}
      </div>
    </process>
  </main-content>
</template>

<script>
import { cookie } from "@/utils/common.js";
import MainContent from "@/views/layout/components/mainContent";
import EditCamera from "./editCamera.vue";
import EditOnlineCamera from "./editOnlineCamera.vue";
import AddCamera from "./addCamera.vue";
import UpgradeCamera from "./upgradeCamera.vue";
import Process from "@/components/process";
import { getEntryByKey, getEntryByValue } from "@/utils/dicts";
import { mapState } from "vuex";
export default {
  name: "camera",
  data() {
    this.getAddedCameraUrl = "/RPC2:configManager.getConfig:RemoteDevice";
    this.deleteCameraUrl = "/RPC2:RemoteDeviceManager.erase";
    this.getOnlineCameraUrl = "/RPC2:deviceDiscovery.start";
    this.batchInsertUrl = "/RPC2:RemoteDeviceManager.batchInsert";
    this.getProgressUrl = "/RPC2:getUpdateProgressIPC";
    this.getAutoAddEableUrl =
      "/RPC2:configManager.getConfig:RemoteDeviceAutoAddEnable";
    this.setAutoAddEableUrl =
      "/RPC2:configManager.setConfig:RemoteDeviceAutoAddEnable";
    this.hostname = window.location.hostname;
    return {
      cameraType: "",
      addedTable: [],
      tableLoading: false,
      onlineTable: [],
      showDeleteCamera: false,
      deleteSingle: [],
      deleteType: 0, //0：单个删除 1：批量删除
      afterAddedTable: [],
      afterOnlineTable: [],

      showEditCamera: false, // 显示编辑已添加摄像机弹窗
      editCameraForm: {}, // 编辑已添加摄像机数据
      showEditOnlineDialog: false, // 显示编辑在线摄像机弹窗
      editOnlineFormData: {}, // 编辑在线摄像机数据
      showAddCamera: false, // 显示添加摄像机弹窗
      addCameraForm: {}, // 添加摄像机数据
      showUpgradeCamera: false, // 显示升级摄像机弹窗

      autoAddFormData: {
        enable: false // 在线摄像机-自动添加摄像机使能
      },
      showProcess: false,
      percent: 0, // 升级进度/重启进度
      isSuccess: false,
      isError: false,
      timer: null,
      onlineTableAllDisabled: false
    };
  },
  watch: {
    isError(val) {
      if (val) {
        setTimeout(() => {
          this.showProcess = false;
          this.isError = false;
        }, 3000);
      }
    },
    isSuccess(val) {
      if (val) {
        setTimeout(() => {
          this.showProcess = false;
          this.isSuccess = false;
        }, 3000);
      }
    },
    showProcess(val) {
      if (!val) {
        this.percent = 0;
        this.isError = false;
      }
    }
  },
  mounted() {
    this.updataAllTable();
    this.getUpgradeProgress();
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.getAddedCamera();
      }, 2000);
    }
  },
  components: {
    MainContent,
    EditCamera,
    EditOnlineCamera,
    AddCamera,
    UpgradeCamera,
    Process
  },
  computed: {
    ...mapState({
      hasAutoAddLAN({ MACRO_CONFIG }) {
        return MACRO_CONFIG.HasAutoAddLAN;
      }
    }),
    //已添加摄像机选中
    deleteSelect() {
      const selectArr = [],
        { addedTableRef } = this.$refs;

      if (addedTableRef) {
        addedTableRef.checkboxAllVal = true;
      }
      this.afterAddedTable.forEach(item => {
        if (item.$checked) {
          selectArr.push(item.channel);
        } else {
          addedTableRef.checkboxAllVal = false;
        }
      });
      return selectArr;
    },
    //在线摄像机选中
    addSelect() {
      const selectArr = [];
      this.afterOnlineTable.forEach(item => {
        if (item.$checked) {
          const obj = {},
            { ip, protocol, model } = item;

          obj.ip = ip;
          obj.protocol = protocol;
          obj.model = model;
          selectArr.push(obj);
        }
      });
      return selectArr;
    },
    //总共可添加摄像机数量
    maxSupportedChannelNum() {
      //return 100;
      return this.$store.state.MACRO_CONFIG.VideoInputChannels;
    },
    //剩余可添加的摄像机数量
    surplusCount() {
      return (
        this.maxSupportedChannelNum -
        this.afterAddedTable.length -
        this.addSelect.length
      );
    }
  },
  methods: {
    /**
     * 全选之前调用，实现全选+禁用功能
     * @return {Boolean}  true - 继续执行原有组件全选函数
     *                    false - 不再执行原有组件全选函数
     */
    beforeSelectAll() {
      const { surplusCount, afterOnlineTable } = this;
      if (surplusCount <= 0 || this.$refs.onlineTableRef.checkboxAllVal) {
        return true;
      } else {
        let i = 0,
          len = Math.min(surplusCount, afterOnlineTable.length);

        for (; i < len; i++) {
          if (afterOnlineTable[i].$checked) {
            len += 1;
          } else {
            this.$set(afterOnlineTable[i], "$checked", true);
          }
        }
        this.$refs.onlineTableRef.checkboxAllVal = true;
        return false;
      }
    },
    updateAddedTable(data) {
      this.afterAddedTable = data;
    },
    updateOnlineTable(data) {
      this.afterOnlineTable = data;
      this.$refs.onlineTableRef.checkboxAllVal = false;
    },
    /**
     * 选中摄像机大于或等于剩余可添加的摄像机数量后禁选剩下的摄像机
     */
    onlineTabledisabled(rowData) {
      if (this.maxSupportedChannelNum - this.afterAddedTable.length <= 0) {
        this.onlineTableAllDisabled = true;
        return true;
      } else {
        this.onlineTableAllDisabled = false;
      }

      if (
        this.surplusCount <= 0 &&
        !this.addSelect.some(item => item.ip === rowData.ip)
      ) {
        this.$refs.onlineTableRef.checkboxAllVal = true;
        return true;
      }
    },
    async getAddedCamera() {
      // this.tableLoading = true;
      const res = await this.$axiosPost(this.getAddedCameraUrl),
        result = res.getResult(),
        params = res.getParams();

      if (result) {
        // this.tableLoading = false;
        this.addedTable = params;
        const { deleteSelect, addedTable } = this;

        this.addedTable.forEach(item => {
          item.statusContent = getEntryByKey(
            item.status,
            "addedCameraStatus",
            "CONFIG"
          ).statusContent;
          item.statusClass = getEntryByKey(
            item.status,
            "addedCameraStatus",
            "CONFIG"
          ).statusClass;
        });

        let i = 0,
          len = addedTable.length;

        for (; i < len; i++) {
          if (deleteSelect.indexOf(addedTable[i].channel) !== -1) {
            this.$set(this.addedTable[i], "$checked", true);
          }
        }
      }
    },
    async getOnlineCamera() {
      this.tableLoading = true;
      const res = await this.$axiosPost(this.getOnlineCameraUrl),
        result = res.getResult(),
        params = res.getParams();

      if (result) {
        this.tableLoading = false;
        this.onlineTable = params;
      }
    },
    async getOnlineAutoAddEnable() {
      const res = await this.$axiosPost(this.getAutoAddEableUrl),
        result = res.getResult(),
        params = res.getParams() || { enable: false };

      if (result) {
        this.autoAddFormData = params;
      }
    },
    changeAutoAddEnable(enable) {
      this.$axiosPost(this.setAutoAddEableUrl, { enable });
    },
    handleOnlineEdit(slotProps) {
      const { id, auto, ip, mask, gateway, username, password } = slotProps;

      this.editOnlineFormData = {
        id,
        auto,
        ip,
        mask,
        gateway,
        username,
        password
      };

      this.showEditOnlineDialog = true;
    },
    handleEdit(slotProps) {
      const {
        channel,
        title,
        ip,
        protocol,
        port,
        username,
        password
      } = slotProps;

      this.editCameraForm = {
        channel,
        title,
        ip,
        protocol,
        port,
        username,
        password: this.Base64.decode(password)
      };
      this.showEditCamera = true;
    },
    handleDelete(slotProps) {
      if (slotProps) {
        this.deleteType = 0;
        this.deleteSingle = [];
        this.deleteSingle.push(slotProps.channel);
      } else {
        this.deleteType = 1;
      }
      this.showDeleteCamera = true;
    },
    handleAdd(slotProps) {
      if (this.surplusCount + this.addSelect.length <= 0) {
        this.$message.warn(
          _("The number of added cameras has reached the limit")
        );
        return;
      }

      if (slotProps) {
        const { ip, protocol, username, password } = slotProps;
        this.addCameraForm = {
          ip,
          protocol,
          port: getEntryByKey(protocol, "cameraPort", "CONFIG").portContent,
          username,
          password
        };
      } else {
        const ip = this.hostname.replace(/\d{1,3}$/, "");
        this.addCameraForm = {
          ip,
          protocol: 1,
          port: 8000,
          username: "admin",
          password: ""
        };
      }
      this.showAddCamera = true;
    },
    handleUpgrade(slotProps) {
      if (slotProps.protocol === 2) {
        return;
      }
      const { channel } = slotProps;

      cookie("channel", channel);
      this.showUpgradeCamera = true;
    },
    async batchInsert() {
      const loading = this.$dialog.loading(_("Adding…"));
      const { addSelect } = this,
        res = await this.$axiosPost(this.batchInsertUrl, { addSelect }),
        { successNum, failureNum } = res.getParams(),
        result = res.getResult();

      if (result) {
        loading.hide();
        this.$message.warn(
          _(`Succeed in adding %s camera(s). Failed to add %s camera(s)`, [
            successNum,
            failureNum
          ])
        );
        this.updataAllTable();
      } else {
        loading.hide();
        this.$message.error(_("Failed to add in batches"));
      }
      this.showDeleteCamera = false;
    },
    async confirmDelete() {
      const channel = this.deleteType ? this.deleteSelect : this.deleteSingle,
        res = await this.$axiosPost(this.deleteCameraUrl, { channel }),
        result = res.getResult();
      if (result) {
        this.$message.success(_("Deleted successfully"));
        this.deleteSelect.forEach((item, index) => {
          //删除后取消选中
          if (channel.indexOf(item) !== -1) {
            this.$set(this.afterAddedTable[index], "$checked", false);
          }
        });
        this.updataTable();
      } else {
        this.$message.error(_("Failed to delete"));
      }
      this.showDeleteCamera = false;
    },
    /**
     * 更新在线和已添加表格数据
     */
    updataAllTable() {
      if (this.hasAutoAddLAN) {
        // 根据后台返回NVR能力判断是否需要“自动添加lan摄像机”功能
        this.getOnlineAutoAddEnable();
      }
      this.getOnlineCamera();
      this.getAddedCamera();
    },
    /**
     * 更新当前表格数据
     */
    updataTable() {
      if (this.cameraType === "online") {
        this.getOnlineCamera();
      } else {
        this.getAddedCamera();
      }
    },
    tabChange() {
      if (this.cameraType === "added") {
        this.updataAllTable();
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.getAddedCamera();
          }, 2000);
        }
      } else {
        this.getAddedCamera();
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    },
    tableFormat(prop, rowData) {
      if (prop === "status") {
        // return rowData.status === 1 ? "已激活" : "未激活";
        return getEntryByKey(rowData.status, "onlineCameraStatus", "CONFIG")
          .statusContent;
      } else if (prop === "protocol") {
        return getEntryByValue(rowData.protocol, "cameraProtocol", "CONFIG")
          .label;
        // return rowData.protocol === 1 ? "Tenda" : "Onvif";
      } else if (prop === "port") {
        return getEntryByKey(rowData.protocol, "cameraPort", "CONFIG")
          .portContent;
        // return rowData.protocol === 1 ? "8000" : "80";
      } else if (prop === "channel") {
        return rowData.channel + 1;
      }
    },
    uploadSuccess() {
      this.getUpgradeProgress();
    },
    async getUpgradeProgress() {
      const res = await this.$axiosPost(this.getProgressUrl);
      let data = res.getParams(),
        result = res.getResult();

      if (result) {
        this.showProcess = true;
        if (data.progress === -1) {
          this.isError = true;
        } else {
          this.percent = data.progress / 100;
          if (data.progress >= 100) {
            this.isSuccess = true;
          } else {
            setTimeout(() => {
              this.getUpgradeProgress();
            }, 200);
          }
        }
      }
    }
  },
  destroyed() {
    cookie("channel", null);
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style lang="scss">
.camera {
  .camera-title {
    display: inline-block;
    margin-top: 28px;
    font-size: 14px;
    color: $title-color;
    line-height: 16px;
  }
  .camera-btns {
    float: right;
    margin-top: 12px;
    .v-button + .v-button {
      margin-left: 16px;
    }
  }
  .camera-table {
    margin-top: 16px;
    .table-dot-normal,
    .table-dot-abnormal {
      width: 6px;
      height: 6px;
      background: $success-color;
      display: inline-block;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 8px;
    }
    .table-dot-abnormal {
      background: $warn-color;
    }
  }
  .camera-refresh {
    padding: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-left: 12px;
    vertical-align: middle;
  }
  .auto-add-camera {
    margin-top: 14px;
    .auto-add-item {
      margin-bottom: 12px;
    }
  }
  .online-camera-title {
    display: inline-block;
  }
  .operation {
    i {
      color: $light-color;
      cursor: pointer;
      font-size: 16px;
      padding: 2px;
    }
    .operation-icon {
      display: inline-block;
      margin-left: 16px;
    }
    .operation-icon:nth-of-type(1) {
      margin-left: 0;
    }
  }
  .deleteCamera {
    span {
      font-size: 14px;
      color: $info-color;
      line-height: 22px;
    }
  }
  .edit-camera,
  .add-camera {
    .v-form {
      .v-form-item:last-child {
        margin-bottom: 0;
      }
    }
  }
  .addDialog {
    .v-dialog {
      height: 190px;
    }
    .v-dialog__title {
      border-bottom: none;
    }
    .v-dialog__main {
      height: 126px;
      padding: 0;
      text-align: center;
    }
    .v-loading__wrapper {
      height: 56px;
    }
    .v-loading__text {
      padding: 16px 0 6px 0;
    }
    .addDialog-content {
      width: 100%;
      height: 100%;
    }
    .v-loading {
      position: relative;
    }
  }
  .upgrade-status {
    font-size: 16px;
    line-height: 70px;
    text-align: center;
    i {
      font-size: 38px;
      vertical-align: middle;
      margin-right: 8px;
    }
    .icon-full-success {
      color: $success-color;
    }
    .icon-full-error {
      color: $error-color;
    }
  }
  .tabel-ellipsis {
    @include ellipsis;
  }
}
</style>
