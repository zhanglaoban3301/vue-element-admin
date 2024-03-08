<template>
  <div class="app-container">
    <div class="skuHeader" style="height: 60px;">
      <el-row style="height: 60px;">
        <el-col :span="4" style="line-height: 60px;">
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-col>
        <el-col :span="8">
          <div style="display: flex;">
            <h3>商品分类:</h3>
            <el-select v-model="cateType" placeholder="请选择">
            <el-option
                v-for="item in cateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex;">
            <h3>商品类型:</h3>
            <el-select v-model="skuType" placeholder="请选择">
              <el-option
                v-for="item in skuTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4" style="line-height: 60px;">
          <el-button type="primary" @click="get()">查询</el-button>
          <el-button type="primary" @click="reload()">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="SUK编号" width="220">
        <template slot-scope="scope">
          {{ scope.row.skuCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="sku名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.skuName }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="展示图片">
      <template slot-scope="scope">
        <img :src="scope.row.imgUrl" alt="图片" width="100" height="100">
      </template>
    </el-table-column>
      <el-table-column align="header-center" label="库存状态">
        <template slot-scope="scope">
          <span>库存:{{ scope.row.stock }}</span><br/>
          <span>预警库存:{{ scope.row.lowStock }}</span><br/>
          <span>锁定库存:{{ scope.row.lockStock }}</span><br/>
          <span>限购个数:{{ scope.row.perLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="价格/市场价">
        <template slot-scope="scope">
          <span>价格:{{ scope.row.price }}</span><br/>
          <span>市场价:{{ scope.row.marketPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="销量">
        <template slot-scope="scope">
          {{ scope.row.sale }}
        </template>
      </el-table-column>
     
      <el-table-column align="header-center" label="标签">
        <template slot-scope="scope">
          是否上架:
          <el-switch v-model="scope.row.publishStatus == '1'" disabled></el-switch><br/>
          审核状态:
          <el-switch v-model="scope.row.checkStatus == '1'" disabled></el-switch><br/>
          新人专享:
          <el-switch v-model="scope.row.isNewPerson == '1'" disabled></el-switch><br/>
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
      <h2>基本信息</h2>
      <el-form :model="sku" label-width="80px" label-position="left">
        <el-form-item label="sku名称">
          <el-input v-model="sku.skuName" placeholder="sku名称" />
        </el-form-item>
        <el-form-item label="sku编号">
          <el-input v-model="sku.skuCode" placeholder="sku编号" />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="sku.categoryId" placeholder="请选择">
            <el-option
                v-for="item in cateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商品售价">
          <el-input v-model="sku.price" type="number" placeholder="商品售价" />
        </el-form-item>
        <el-form-item label="市场价">
          <el-input v-model="sku.marketPrice" type="number" placeholder="市场价" />
        </el-form-item>
        <el-form-item label="是否新人专享">
          <el-radio-group v-model="sku.isNewPerson">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="sku.sort" type="number" placeholder="排序" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="sku.stock" type="number" placeholder="库存" />
        </el-form-item>
        <el-form-item label="锁定库存">
          <el-input v-model="sku.lockStock" type="number" placeholder="锁定库存" />
        </el-form-item>
        <el-form-item label="预警库存">
          <el-input v-model="sku.lowStock" type="number" placeholder="预警库存" />
        </el-form-item>
      </el-form>

      <h2>平台属性</h2>
      <el-form :model="skuAttrValue" label-width="80px" label-position="left">
        <el-form-item label="属性分组">
          <el-select v-model="skuAttrValue.attrId" @change="confirmAttrGroup" placeholder="请选择">
            <el-option
                v-for="item in attrGroupOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="属性名">
          <el-select v-model="skuAttrValue.attrName" @change="confirmAttr" placeholder="请选择">
            <el-option
                v-for="item in attrOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="属性">
          <el-input v-model="skuAttrValue.attrValue" v-show="showInput"  type="number" placeholder="请输入属性" />
          <el-select v-model="skuAttrValue.attrValue" v-show="showOption"  placeholder="请选择">
            <el-option
                v-for="item in attrValueOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
      </el-form>

      <h2>商品图片</h2>
      <el-form :model="skuImage" label-width="80px" label-position="left">
        <el-upload
          class="upload-demo"
          drag
          :headers="headerToken"
          :on-success="onUploadSuccess"
          :action="BASE_API+'/admin/product/fileUpload'"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form>
        <h2>宣传海报</h2>
       <el-form :model="skuPoster" label-width="80px" label-position="left">
        <el-upload
          class="upload-demo"
          drag
          :headers="headerToken"
          :on-success="onUploadPosterSuccess"
          :action="BASE_API+'/admin/product/fileUpload'"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

import { skuDelete, skuUpdate, skuAdd, skuSelectAll ,cateSelectAll,attrGroupSelectAll,attrSelectAll,getAttrByAttrGroupId} from '@/api/product'
import { defaultSku,defaultSkuAttrValue,defaultSkuImage,defaultSkuPoster} from './skuJs/sku';
import { deepClone } from '@/utils'
import { getToken } from '@/utils/auth';
export default {
  name: 'sku',
  data() {
    return {
      headerToken:{"token":getToken()},
      value:true,
      title: '',
      dataList: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      cateType:'',
      skuType:'',
      showInput:false,
      showOption:false,
      cateOptions:[],
      skuTypeOptions:[
        { value: '0', label: '普通商品'},
        { value: '1', label: '秒杀商品'}
      ],
      attrGroupOptions:[],
      attrOptions:[],
      attrValueOptions:[],
      dialogVisible: false,
      sku: deepClone(defaultSku),
      skuAttrValue:deepClone(defaultSkuAttrValue),
      skuImage:deepClone(defaultSkuImage),
      skuPoster:deepClone(defaultSkuPoster),
      attrList:[],
      attrSelect:false,
      // 接口API地址
       BASE_API: 'http://localhost:8203',
    }
  },
  watch: {
    pageNo(newPageNo) {
      this.getList(newPageNo)
    }
  },

  created() {
    this.getCataOption();
    this.getList();
    this.getAttrGroupOption();
  },
  methods: {
    onUploadSuccess(res, file) {
      console.log("file",file)
      console.log("res",res)
      // 填充上传文件列表
      this.sku.imgUrl = res.data
    },
    onUploadPosterSuccess(res, file) {
      // 填充上传文件列表
     
    },

    confirmAttrGroup(value){
      console.log("value",value)
      this.getAttrOption(value)
    },
    confirmAttr(value){
      this.attrValueOptions = []
      //attrValueOptions
      const attrInfo = this.attrList.find(v=> v.id == value)
      if(attrInfo.inputType=='0'){
        this.showInput = true;
        this.showOption = false
      }else{
        this.showInput = false;
        this.showOption = true;
        for(let item of attrInfo.selectList.split(",")){
            let map = {}
            map['label'] = item;
            map['value'] = item;
            this.attrValueOptions.push(map)
        }
     
      }
    },
    get(){
      this.sku.categoryId = this.cateType;
      this.sku.skuType = this.skuType;
      this.getList();
    },
    reload(){
      this.cateType = ''
      this.skuType = ''
    },
    async getCataOption(){
      const res = await cateSelectAll(1,1000,null);
      for(const cate of res.data.records){
        let map = [];
        map['value'] = cate.id;
        map['label'] = cate.name
        this.cateOptions.push(map)
      }
    },
    async getAttrGroupOption(){
      const res = await attrGroupSelectAll(1,1000,null);
      console.log("res",res)
      for(const cate of res.data.records){
        let map = [];
        map['value'] = cate.id;
        map['label'] = cate.name
        this.attrGroupOptions.push(map)
      }
      //console.log("attrGroupOptions",attrGroupOptions)
    },
    async getAttrOption(value){
      const res = await getAttrByAttrGroupId(value);
      console.log(res)
      this.attrList = res.data
      for(const cate of res.data){
        let map = [];
        map['value'] = cate.id;
        map['label'] = cate.name
        this.attrOptions.push(map)
      }
    },
    changePage(page) {
      this.pageNo = page
    },
    handleAdd(name) {
      this.title = '新增sku'
      this.dialogVisible = true
   
    },

    async getList(pageNo) {
      if (!pageNo) {
        pageNo = this.pageNo
      }
      const res = await skuSelectAll(pageNo, this.pageSize, this.sku)
      this.total = res.data.total
      this.dataList = res.data.records
    },

    confirm() {
      if (this.title === '修改sku') {
        skuUpdate(this.sku)
      } else {
        skuAdd(this.sku)
      }
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '成功'
      })
      this.sku = deepClone(defaultSku);
      this.refreshTable()
    },
    handleEdit(scope) {
      this.title = '修改sku'
      this.dialogVisible = true
      this.sku= scope.row
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
          skuDelete([scope.row.id])
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
      .skuHeader{
       .el-select {
        line-height: 60px;
        margin-left: 5px;
       }
      }
      .region-table {
        margin-top: 30px;
      }
      .region-tree {
        margin-bottom: 30px;
      }
    }
    </style>
