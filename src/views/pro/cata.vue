<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd()">新增</el-button>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="序号" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
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
      <el-form :model="category" label-width="80px" label-position="left">
        <el-form-item label="分类名称">
          <el-input v-model="category.name" placeholder="仓库名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="category.sort" placeholder="排序" />
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

import { cateDelete, cateUpdate, cateAdd, cateSelectAll } from '@/api/product'

export default {
  data() {
    return {
      title: '',
      dataList: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      dialogVisible: false,
      category: {
        name: '',
        sort: ''
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
    changePage(page) {
      this.pageNo = page
    },
    handleAdd(name) {
      this.title = '新增商品分类'
      this.dialogVisible = true
    },

    async getList(pageNo) {
      if (!pageNo) {
        pageNo = this.pageNo
      }
      const res = await cateSelectAll(pageNo, this.pageSize, this.category)
      this.total = res.data.total
      this.dataList = res.data.records
    },

    confirm() {
      if (this.title === '修改商品分类') {
        cateUpdate(this.category)
      } else {
        cateAdd(this.category)
      }
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '成功'
      })
      this.refreshTable()
    },
    handleEdit(scope) {
      this.title = '修改商品分类'
      this.dialogVisible = true
      this.category.id = scope.row.id
      this.category.name = scope.row.name
      this.category.sort = scope.row.sort
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
          cateDelete([scope.row.id])
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
