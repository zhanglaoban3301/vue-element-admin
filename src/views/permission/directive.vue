<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">新增用户</el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="序号" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleRoleEdit(scope)">分配角色</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="user.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item v-show="dialogType!=='edit'" label="密码">
          <el-input v-model="user.password" placeholder="密码" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="user.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="user.phone" placeholder="电话" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="roleVisible" title="分配角色">
      <div>
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
          <el-checkbox v-for="role in roles" :key="role.id" :label="role">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="text-align:right;margin-top: 10px;">
        <el-button type="danger" @click="roleVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmSaveRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { deepClone } from '@/utils'
import { getUsers, updateUserRoles, addUser, updateUser, removeUsers } from '@/api/user'
import { getRoles } from '@/api/role'
const defaultUser = {
  id: '',
  userName: '',
  name: '',
  phone: '',
  roleIds: []
}

export default {
  data() {
    return {
      user: Object.assign({}, defaultUser),
      userList: [],
      dialogVisible: false,
      dialogType: 'new',
      isIndeterminate: true,
      checkAll: false,
      checkedRoles: [],
      roles: [],
      roleVisible: false,
      rolesOptions: []
    }
  },

  created() {
    this.getUsers()
    this.getRoles()
  },
  methods: {
    async updateUserRoles(data) {
      await updateUserRoles(data)
    },
    confirmSaveRole() {
      this.user.roleIds = this.rolesOptions.map(v => v.id)
      updateUserRoles(this.user)
      this.roleVisible = false
    },
    handleCheckAllChange(val) {
      this.checkedRoles = val ? this.roles : []
      this.rolesOptions = val ? this.roles : []
      this.isIndeterminate = false
    },
    handleCheckedRolesChange(value) {
      console.log('value', value)
      const checkedCount = value.length
      this.checkAll = checkedCount === this.roles.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length
      this.rolesOptions = value
    },
    async getUsers() {
      const res = await getUsers()
      this.userList = res.data
    },
    async getRoles() {
      const res = await getRoles()
      this.roles = res.data
    },
    handleAddUser() {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
    },
    handleRoleEdit(scope) {
      this.user = deepClone(scope.row)
      this.roleVisible = true
      const roleIds = scope.row.roleIds
      const roleItem = this.roles.filter(item => roleIds.includes(item.id))
      this.checkedRoles = roleItem
      this.rolesOptions = roleItem
    },

    handleDelete({ $index, row }) {
      this.$confirm('确定删除?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await removeUsers([row.id])
          this.userList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '已删除'
          })
        })
        .catch(err => { console.error(err) })
    },

    async confirmUser() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateUser(this.user)
        for (let index = 0; index < this.userList.length; index++) {
          if (this.userList[index].id === this.user.id) {
            this.userList.splice(index, 1, Object.assign({}, this.user))
            break
          }
        }
      } else {
        const { data } = await addUser(this.user)
        this.user.id = data
        this.userList.push(this.user)
      }

      const { userName, name, phone } = this.user
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>用户名: ${userName}</div>
            <div>姓名: ${name}</div>
            <div>电话: ${phone}</div>
          `,
        type: 'success'
      })
    }
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue

  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
