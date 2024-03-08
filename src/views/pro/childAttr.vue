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
          {{ scope.row.inputType == 0?'手工录入':'从列表中选择' }}
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
        <el-form-item label="属性名">
          <el-input v-model="attr.name" placeholder="属性名" />
        </el-form-item>
      
        <el-form-item label="属性录入方式">
          <el-radio-group v-model="attr.inputType">
          <el-radio  :label="0">手工录入</el-radio>
          <el-radio  :label="1">从列表中选择</el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item  v-show="attr.inputType=='1'" label="可选值列表">
          <el-input v-model="attr.selectList" placeholder="可选值列表" />
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

  data() {
    return {
      title: '',
      dataList: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      dialogVisible: false,
      attr: {
        id:null,
        name: null,
        inputType:null,
        attrGroupId:null,
        selectList:null,
      }
    }
  },
  watch: {
    pageNo(newPageNo) {
      this.getList(newPageNo)
    }
  },

  created() {
    const attrGroupId  = this.$route.params.id;
    this.attr.attrGroupId = attrGroupId
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
      console.log("row",scope.row)
      this.attr = scope.row
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
          this.refreshTable()
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
