<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd()">新增</el-button>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="序号" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组名" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="设置">
        <template slot-scope="scope">
          <router-link :to="{ name: 'childAttr', params: { id: scope.row.id }}">
            <el-button size="mini" icon="el-icon-edit">平台属性列表</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px;"
      background
      layout="prev, pager, next"
      :current-page="pageNo"
      :total="total"
      @current-change="changePage"
    />
    <el-dialog :visible.sync="dialogVisible" :title="title">
      <el-form :model="attrGroup" label-width="80px" label-position="left">
        <el-form-item label="组名">
          <el-input v-model="attrGroup.name" placeholder="组名" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="attrGroup.sort" placeholder="排序" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="attrGroup.remark" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

import { attrGroupDelete, attrGroupUpdate, attrGroupAdd, attrGroupSelectAll } from '@/api/product'

export default {
  name: 'AttrGroup',
  data() {
    return {
      title: '',
      dataList: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      dialogVisible: false,
      attrGroup: {
        name: '',
        sort: '',
        remark: ''
      }
    }
  },
  watch: {
    pageNo(newPageNo) {
      this.getList(newPageNo)
    }
  },

  created() {
    this.getList()
  },
  methods: {
    open(scope) {
      this.$router.push({ name: 'childAttr' })
    },
    changePage(page) {
      this.pageNo = page
    },
    handleAdd(name) {
      this.title = '新增平台属性'
      this.dialogVisible = true
    },

    async getList(pageNo) {
      if (!pageNo) {
        pageNo = this.pageNo
      }
      const res = await attrGroupSelectAll(pageNo, this.pageSize, this.attrGroup)
      this.total = res.data.total
      this.dataList = res.data.records
    },

    confirm() {
      if (this.title === '修改平台属性') {
        attrGroupUpdate(this.attrGroup)
      } else {
        attrGroupAdd(this.attrGroup)
      }
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '成功'
      })
      this.refreshTable()
    },
    handleEdit(scope) {
      this.title = '修改平台属性'
      this.dialogVisible = true
      this.attrGroup.id = scope.row.id
      this.attrGroup.name = scope.row.name
      this.attrGroup.sort = scope.row.sort
    },
    refreshTable() {
      this.getList(this.pageNo)
    },
    handleDelete(scope) {
      this.$confirm('确定删除?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          attrGroupDelete([scope.row.id])
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '已删除'
          })
        })
        .catch(err => { console.error(err) }).finally(a => { this.refreshTable() })
    }

    // reference: src/view/layout/components/Sidebar/SidebarItem.vue

  }
}
</script>

    <style lang="scss" scoped>
    .app-container {
      .region-table {
        margin-top: 30px;
      }
      .region-tree {
        margin-bottom: 30px;
      }
    }
    </style>
