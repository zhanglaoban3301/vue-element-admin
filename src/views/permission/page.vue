<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddMenu">新增菜单</el-button>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;margin-top: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column align="center" label="名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.meta.title }}
        </template>
      </el-table-column>
      <el-table-column
        prop="path"
        label="编码"
        sortable
        width="180"
      />
      <el-table-column
        prop="redirect"
        label="路径"
      />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" title="新增菜单">
      <el-form :model="menu" label-width="80px" label-position="left">
        <el-form-item label="菜单名称">
          <el-input v-model="menu.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="菜单编码">
          <el-input v-model="menu.path" placeholder="菜单编码" />
        </el-form-item>
        <el-form-item v-show="false" label="菜单编码">
          <el-input v-model="menu.code" placeholder="菜单编码" />
        </el-form-item>
        <el-form-item label="父菜单">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
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
import { getRoutes } from '@/api/role'
import { removeMenu, addMenu } from '@/api/menu'

import path from 'path'
export default {
  name: 'PagePermission',
  data() {
    return {
      tableData: [],
      routes: [],
      dialogVisible: false,
      menu: {
        pid: '',
        name: '',
        path: '',
        code: '',
        type: '1',
        status: '1'
      },
      defaultProps: {
        label: function(node) {
          return node.meta.title
        },
        id: function(node) {
          return node.id
        }
      },
      checkStrictly: true
    }
  },
  computed: {
    routesData() {
      return this.tableData
    }
  },
  created() {
    this.getRoutes()
  },
  methods: {
    async add(data) {
      await addMenu(data)
    },
    async remove(data) {
      await removeMenu(data)
    },
    async getRoutes() {
      const res = await getRoutes()
      this.tableData = res.data
      this.routes = this.generateRoutes(res.data)
    },

    confirm() {
      const pid = this.$refs.tree.getCheckedKeys()
      if (pid.length > 1) {
        alert('error')
      }
      this.menu.pid = pid[0]
      this.menu.code = this.menu.path
      this.add(this.menu)
      this.dialogVisible = false
    },
    handleAddMenu() {
      this.dialogVisible = true
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定删除?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.remove([row.id])
          // this.tableData.splice($index, 1)
          this.$message({
            type: 'success',
            message: '已删除'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (const route of routes) {
        // skip some route
        // if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild) {
          // route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta.title,
          id: route.id
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      console.log('res', res)
      return res
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>
