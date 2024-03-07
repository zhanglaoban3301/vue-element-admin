<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRegion">开通区域</el-button>

    <el-table :data="regionList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="序号" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="区域名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.regionName }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="仓库名称">
        <template slot-scope="scope">
          {{ scope.row.wareName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status == '0'?'未开通':'已开通' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope)">{{ scope.row.status == '0'?'开通':'取消开通' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px;"
      background
      layout="prev, pager, next"
      :current-change="changePage"
      :current-page="pageNo"
      :total="total"
    />
    <el-dialog :visible.sync="dialogVisible" title="开通区域">
      <el-form :model="region" label-width="80px" label-position="left">
        <el-form-item label="选择区域">
          <el-tree
            ref="tree"
            :data="treeData"
            :props="props"
            :load="loadNode"
            :check-strictly="strictly"
            node-key="id"
            lazy
            show-checkbox
          />
        </el-form-item>
        <el-form-item label="仓库名称">
          <el-input v-model="region.wareName" placeholder="仓库名称" />
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

import { getRegionByParentId, getRegion, getRegionCount } from '@/api/region'

export default {
  data() {
    return {
      treeData: [],
      loadData: [],
      regionList: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      dialogVisible: false,
      strictly: true,
      props: {
        label: 'name',
        children: [],
        id: 'id',
        name: 'name'
      },
      region: {
        wareName: ''
      }
    }
  },

  created() {
    this.getCount()
    this.getRegionList()
    this.getFirstTree()
  },
  methods: {

    handleAddRegion() {
      this.dialogVisible = true
    },
    changePage(page) {
      console.log(page)
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData)
      }
      if (node.level >= 1) {
        const res = await getRegionByParentId(node.data.id)
        return resolve(res.data)
      }
    },
    async getCount() {
      const res = await getRegionCount()
      this.total = res.data
    },
    async getRegionList() {
      const res = await getRegion(this.pageNo, this.pageSize)
      this.regionList = res.data
    },

    async getTree(node) {
      const res = await getRegionByParentId(node)
      return res.data
    },
    async getFirstTree() {
      const res = await getRegionByParentId(86)
      this.treeData = res.data
    },

    confirm() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      console.log('checkedKeys', checkedKeys)
      if (checkedKeys.length > 1 || checkedKeys.length === 0) {
        alert('选择一个')
      }
      console.log(this.region.wareName)
      console.log(checkedKeys[0])
      this.dialogVisible = false
    },
    handleEdit(scope) {

    },
    handleDelete() {

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
