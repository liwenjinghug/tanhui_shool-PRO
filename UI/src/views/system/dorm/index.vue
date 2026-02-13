<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="楼栋名称 / 房间号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select v-model="listQuery.campus" placeholder="选择校区" clearable style="width: 130px; margin-left:10px" class="filter-item">
        <el-option label="东校区" value="东校区" />
        <el-option label="北校区" value="北校区" />
        <el-option label="主校区" value="主校区" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="Search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="Plus" @click="handleCreate">
        新增
      </el-button>
      <el-button
        class="filter-item"
        type="danger"
        icon="Delete"
        :disabled="multipleSelection.length === 0"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>

      <!-- 导入按钮 -->
      <el-upload
        class="filter-item upload-demo"
        action="/api/system/dorm/import"
        :show-file-list="false"
        :on-success="handleImportSuccess"
        :on-error="handleImportError"
        style="display: inline-block; margin-left: 10px;"
      >
        <el-button type="warning" icon="Upload">导入</el-button>
      </el-upload>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" />
      <el-table-column label="校区" prop="campus" align="center" />
      <el-table-column label="楼栋名称" prop="buildingName" align="center" />
      <el-table-column label="房间号" prop="roomNumber" align="center" />
      <el-table-column label="宿舍类型" prop="type" align="center" />
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" width="180">
        <template #default="{ row }">
          <span>{{ formatDateTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-show="total > 0"
        v-model:current-page="listQuery.pageNum"
        v-model:page-size="listQuery.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 对话框 -->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="校区" prop="campus">
          <el-select v-model="temp.campus" class="filter-item" placeholder="请选择">
            <el-option label="东校区" value="东校区" />
            <el-option label="北校区" value="北校区" />
            <el-option label="主校区" value="主校区" />
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋名称" prop="buildingName">
          <el-input v-model="temp.buildingName" placeholder="例如：5栋" />
        </el-form-item>
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="temp.roomNumber" placeholder="例如：302" />
        </el-form-item>
        <el-form-item label="宿舍类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="temp.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../../request'

// Reactive State
const list = ref([])
const total = ref(0)
const listLoading = ref(true)
const listQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  keyword: undefined,
  campus: undefined
})
const multipleSelection = ref([])

const dialogFormVisible = ref(false)
const dialogStatus = ref('')
const textMap = {
  update: '编辑宿舍',
  create: '新增宿舍'
}

const temp = reactive({
  id: undefined,
  campus: '东校区',
  buildingName: '',
  roomNumber: '',
  type: '4人间',
  status: 1
})

const typeOptions = ['2人间', '4人间', '6人间', '8人间']

const rules = {
  campus: [{ required: true, message: '请选择校区', trigger: 'change' }],
  buildingName: [{ required: true, message: '请输入楼栋名称', trigger: 'blur' }],
  roomNumber: [{ required: true, message: '请输入房间号', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }]
}

const dataForm = ref(null)

// Methods
function getList() {
  listLoading.value = true
  request.get('/api/system/dorm/list', { params: listQuery })
    .then(data => {
      list.value = data.rows
      total.value = data.total
      listLoading.value = false
    })
    .catch(error => {
      console.error(error)
      listLoading.value = false
    })
}

function handleFilter() {
  listQuery.pageNum = 1
  getList()
}

function handleSizeChange(val) {
  listQuery.pageSize = val
  getList()
}

function handleCurrentChange(val) {
  listQuery.pageNum = val
  getList()
}

function handleSelectionChange(val) {
  multipleSelection.value = val
}

function resetTemp() {
  temp.id = undefined
  temp.campus = '东校区'
  temp.buildingName = ''
  temp.roomNumber = ''
  temp.type = '4人间'
  temp.status = 1
}

function handleCreate() {
  resetTemp()
  dialogStatus.value = 'create'
  dialogFormVisible.value = true
  nextTick(() => {
    dataForm.value?.clearValidate()
  })
}

function createData() {
  dataForm.value.validate((valid) => {
    if (valid) {
      request.post('/api/system/dorm', temp)
        .then(() => {
          list.value.unshift(temp)
          dialogFormVisible.value = false
          ElMessage.success('创建成功')
          getList() // Refresh to get ID
        })
    }
  })
}

function handleUpdate(row) {
  Object.assign(temp, row) // copy row to temp
  dialogStatus.value = 'update'
  dialogFormVisible.value = true
  nextTick(() => {
    dataForm.value?.clearValidate()
  })
}

function updateData() {
  dataForm.value.validate((valid) => {
    if (valid) {
      const tempData = Object.assign({}, temp)
      request.put('/api/system/dorm', tempData)
        .then(() => {
          dialogFormVisible.value = false
          ElMessage.success('更新成功')
          getList()
        })
    }
  })
}

function handleDelete(row) {
  ElMessageBox.confirm('确认删除该记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    request.delete(`/api/system/dorm/${row.id}`)
      .then(() => {
        ElMessage.success('删除成功')
        getList()
      })
  })
}

function handleBatchDelete() {
  if (multipleSelection.value.length === 0) return
  const ids = multipleSelection.value.map(item => item.id).join(',')
  ElMessageBox.confirm(`确认删除这 ${multipleSelection.value.length} 条记录吗?`, '提示', { type: 'warning' })
    .then(() => {
      request.delete(`/api/system/dorm/${ids}`)
        .then(() => {
          ElMessage.success('批量删除成功')
          getList()
        })
    })
}

function handleImportSuccess(response) {
  if (response.success) {
    ElMessage.success(response.message || '导入成功')
    getList()
  } else {
    ElMessage.error(response.message || '导入失败')
  }
}

function handleImportError(err) {
  ElMessage.error('上传失败')
  console.error(err)
}

function formatDateTime(str) {
  if (!str) return ''
  return str.replace('T', ' ').substring(0, 19)
}

// Lifecycle
onMounted(() => {
  getList()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
.filter-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.filter-item {
  margin-right: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
