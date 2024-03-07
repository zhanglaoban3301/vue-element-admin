<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd()">新增</el-button>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="序号" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="属性名" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="属性录入方式">
        <template slot-scope="scope">
          {{ scope.row.inputType }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="可选值列表">
        <template slot-scope="scope">
          {{ scope.row.selectList }}
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
      <el-form :model="attr" label-width="80px" label-position="left">
        <el-form-item label="组名">
          <el-input v-model="attr.name" placeholder="组名" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="attr.sort" placeholder="排序" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="attr.remark" placeholder="备注" />
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

import { attrDelete, attrUpdate, attrAdd, attrSelectAll } from '@/api/product'

export default {
  name: 'Attr',
  data() {
    return {
      title: '',
      dataList: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      dialogVisible: false,
      attr: {
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
    console.log(this.$route.query)
    this.getList()
  },
  methods: {
    open(scope) {

    },
    changePage(page) {
      this.pageNo = page
    },
    handleAdd(name) {
      this.title = '新增属性'
      this.dialogVisible = true
    },

    async getList(pageNo) {
      if (!pageNo) {
        pageNo = this.pageNo
      }
      const res = await attrSelectAll(pageNo, this.pageSize, this.attr)
      this.total = res.data.total
      this.dataList = res.data.records
    },

    confirm() {
      if (this.title === '修改属性') {
        attrUpdate(this.attr)
      } else {
        attrAdd(this.attr)
      }
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '成功'
      })
      this.refreshTable()
    },
    handleEdit(scope) {
      this.title = '修改属性'
      this.dialogVisible = true
      this.attr.id = scope.row.id
      this.attr.name = scope.row.name
      this.attr.sort = scope.row.sort
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
          attrDelete([scope.row.id])
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
