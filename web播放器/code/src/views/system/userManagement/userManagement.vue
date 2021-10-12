<template>
  <main-content :title="_('Users')">
    <div class="user-management">
      <h3>{{ _("User List") }}</h3>
      <div class="user-management-table">
        <v-table :data="table">
          <v-table-col prop="username" :label="_('User Name')"></v-table-col>
          <v-table-col prop="type" :label="_('User Type')"></v-table-col>
          <v-table-col :label="_('Operation')">
            <template v-slot="slotProps">
              <div class="table-edit" @click="edit(slotProps)">
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
                class="table-delete"
                v-if="slotProps.group === 'user' && isAdmin"
                @click="handleDelete(slotProps.username)"
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
            </template>
          </v-table-col>
        </v-table>
      </div>
      <div v-if="isAdmin" class="user-management-add" @click="addUser">
        <v-button type="primary">{{ _("c#RaY#Add") }}</v-button>
      </div>
    </div>
    <!-- 编辑管理员 -->
    <edit-admin
      v-model="showEditAdmin"
      :form-data="editAdminForm"
      :after-confirm="getAllUser"
    />
    <!-- 编辑普通用户 -->
    <edit-user
      v-model="showEditUser"
      :form-data="editUserForm"
      :after-confirm="getAllUser"
    />
    <!-- 添加普通用户 -->
    <add-user
      v-model="showAddUser"
      :form-data="addUserForm"
      :after-confirm="getAllUser"
    />
    <!-- 删除普通用户 -->
    <v-dialog
      v-model="showDeleteUser"
      :title="_('C#ueb#Delete')"
      :width="400"
      @confirm="confirmDelete"
    >
      <div class="deleteUser">
        <span>{{
          _("Do you want to delete the user %s?", deleteUsername)
        }}</span>
      </div>
    </v-dialog>
    <!-- 普通用户登陆时编辑自己 -->
    <edit-own
      v-model="showEditOwn"
      :form-data="editOwnForm"
      :after-confirm="getAllUser"
    />
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import EditAdmin from "./editAdmin";
import EditUser from "./editUser";
import EditOwn from "./editOwn";
import AddUser from "./addUser";
export default {
  data() {
    this.getUserInfoAllUrl = "/RPC2:userManager.getUserInfoAll";
    this.deleteUserUrl = "/RPC2:userManager.deleteUser";
    this.ADMIN = "admin"; //代表为管理员
    return {
      table: [],
      showDeleteUser: false,
      showEditAdmin: false,
      editAdminForm: {},
      showEditUser: false,
      editUserForm: {},
      showAddUser: false,
      addUserForm: {},
      showEditOwn: false,
      editOwnForm: {},
      deleteUsername: ""
    };
  },
  mounted() {
    this.getAllUser();
  },
  computed: {
    //是否是admin登录
    isAdmin() {
      return this.$store.state.username === this.ADMIN;
    }
  },
  methods: {
    async getAllUser() {
      const res = await this.$axiosPost(this.getUserInfoAllUrl),
        result = res.getResult(),
        data = res.getParams();

      result && this.createTableData(data);
    },
    createTableData(data) {
      const tableArr = [],
        { ADMIN } = this;

      data.forEach(item => {
        const obj = {};
        obj.username = item.username;
        obj.type =
          item.username === ADMIN ? _("Administrator") : _("Common user");
        obj.group = item.username === ADMIN ? "admin" : "user";
        obj.authorityList = item.authorityList;
        obj.telephone = item.phoneNumber;
        tableArr.push(obj);
      });
      this.table = tableArr;
    },
    edit(slotProps) {
      const { ADMIN } = this;

      if (this.isAdmin) {
        //代表是管理员登录
        if (slotProps.group === ADMIN) {
          //代表修改的是管理员
          // this.editAdminForm.telephone = slotProps.telephone;
          this.editAdminForm = {
            username: "admin",
            changePwd: false,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            // isSync: true,
            telephone: slotProps.telephone
          };
          this.showEditAdmin = true;
        } else {
          const { username, authorityList } = slotProps;

          // editUser.username = editUser.editUserForm.newName =
          //   slotProps.username;
          // editUser.editUserForm.authorityList = slotProps.authorityList;
          this.editUserForm = {
            newName: username,
            changePwd: false,
            adminPassword: "",
            newPassword: "",
            confirmPassword: "",
            authorityList
          };
          this.showEditUser = true;
        }
      } else {
        // this.editOwnForm.username = slotProps.username;
        this.showEditOwn = true;
        this.editOwnForm = {
          username: slotProps.username,
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        };
      }
    },
    addUser() {
      this.showAddUser = true;
      this.addUserForm = {
        username: "",
        password: "",
        confirmPassword: "",
        authorityList: {}
      };
    },
    handleDelete(username) {
      this.deleteUsername = username;
      this.showDeleteUser = true;
    },
    async confirmDelete() {
      const username = this.deleteUsername,
        res = await this.$axiosPost(this.deleteUserUrl, {
          username
        }),
        result = res.getResult();
      if (result) {
        this.$message.success(_("Deleted successfully"));
        this.getAllUser();
      } else {
        this.$message.error(_("Failed to delete"));
      }
      this.showDeleteUser = false;
    }
  },
  components: {
    MainContent,
    EditAdmin,
    EditUser,
    EditOwn,
    AddUser
  }
};
</script>

<style lang="scss">
.user-management {
  position: relative;
  h3 {
    padding: 16px 0;
    font-size: 16px;
    font-weight: bold;
    color: #262626;
    line-height: 16px;
  }
  .user-management-table {
    .table-edit {
      display: inline-block;
    }
    .table-delete {
      display: inline-block;
      margin-left: 12px;
    }
    i {
      color: $light-color;
      cursor: pointer;
      font-size: 16px;
      padding: 2px;
    }
    //todo v-scroll max-width赋值错误
    .v-scroll {
      max-width: 100% !important;
    }
  }
  .user-management-add {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.edit-admin,
.edit-user,
.add-user,
.edit-own {
  //todo: 表单组件和弹窗组件都会加24的底边距，需要去掉一个
  .v-form {
    .v-form-item:last-child {
      margin-bottom: 0;
    }
  }
}
.deleteUser {
  span {
    font-size: 14px;
    color: #595959;
    line-height: 22px;
  }
}
</style>
