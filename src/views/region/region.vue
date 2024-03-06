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
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope)">取消开通</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" title="开通区域">
      <el-form :model="region" label-width="80px" label-position="left">
        <el-form-item label="选择区域">
          <el-tree
            :data="treeData"
            :props="props"
            :load="loadNode"
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

import { getRegionByParentId, getRegion } from '@/api/region'

export default {
  data() {
    return {
      treeData: [],
      regionList: [],
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      region: {

      }
    }
  },

  created() {
    this.getRegionList()
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData)
      }
      if (node.level > 1) {
        console.log('node', node)
        const res = this.reloadRegion(node.id)
        return resolve(res)
      }
    },
    async getRegionList() {
      await getRegion()
    },
    loadRegion(node) {
      this.treeData = getRegion(node)
    },
    reloadRegion(node) {
      return getRegion(node)
    },
    async getRegion(node) {
      const res = await getRegionByParentId(node)
      return res.data
    },
    handleAddUser() {

    },
    handleEdit(scope) {

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
