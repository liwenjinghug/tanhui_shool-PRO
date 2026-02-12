<template>
  <div class="user-page">
    <div class="toolbar">
      <el-input v-model="keyword" placeholder="搜索学号/姓名" style="width: 320px;" clearable @keyup.enter="onSearch" />
      <el-button type="primary" @click="onSearch">搜索</el-button>
      <el-button @click="onReset">重置</el-button>
    </div>

    <el-table :data="list" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />



      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="realName" label="真实姓名" width="140" />
      <el-table-column prop="studentId" label="学号" width="140" />

      <el-table-column label="宿舍" width="180">
        <template #default="{ row }">
          <span>{{ row.dormBuilding || '' }} {{ row.dormRoom || '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="points" label="积分" width="100" />

      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '正常' : '冻结' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="onEdit(row)">编辑</el-button>
          <el-button size="small" type="warning" @click="onConfirmReset(row)">重置基准</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination" style="margin-top: 16px; text-align: right;">
      <el-pagination
        background
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10,20,50,100]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog :visible.sync="editDialogVisible" width="520px" title="编辑用户">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="110px">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="editForm.realName" />
        </el-form-item>

        <el-form-item label="学号" prop="studentId">
          <el-input v-model="editForm.studentId" />
        </el-form-item>

        <el-form-item label="宿舍-楼栋" prop="dormBuilding">
          <el-input v-model="editForm.dormBuilding" />
        </el-form-item>

        <el-form-item label="宿舍-房号" prop="dormRoom">
          <el-input v-model="editForm.dormRoom" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listUser, updateUser, resetUserBaseline } from '../../../api/user'

// 组件状态
const keyword = ref('')
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const list = ref([])
const loading = ref(false)

// 编辑对话框
const editDialogVisible = ref(false)
const editFormRef = ref(null)
const editForm = reactive({
  id: null,
  realName: '',
  studentId: '',
  dormBuilding: '',
  dormRoom: '',
  status: 1
})

const rules = {
  studentId: [{ required: true, message: '请填写学号', trigger: 'blur' }],
  realName: [{ required: true, message: '请填写真实姓名', trigger: 'blur' }]
}

function parseListResponse(res) {
  // request.js already unwraps response.data, so res is the actual data object
  // which should have structure: { success, message, data: { total, records } }
  if (!res) return { records: [], total: 0 }

  // If res has .data with records (Result wrapper)
  if (res.data && res.data.records !== undefined) {
    return { records: res.data.records, total: res.data.total || 0 }
  }

  // If res directly has records (unwrapped)
  if (res.records !== undefined) {
    return { records: res.records, total: res.total || 0 }
  }

  // Fallback
  return { records: [], total: 0 }
}

async function fetchList(p = pageNum.value) {
  loading.value = true
  try {
    const res = await listUser({ pageNum: p, pageSize: pageSize.value, keyword: keyword.value })
    const parsed = parseListResponse(res)
    list.value = parsed.records || []
    total.value = parsed.total || 0
    pageNum.value = p
  } catch (e) {
    console.error(e)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

function onSearch() {
  fetchList(1)
}

function onReset() {
  keyword.value = ''
  fetchList(1)
}

function handleSizeChange(size) {
  pageSize.value = size
  fetchList(1)
}

function handleCurrentChange(page) {
  fetchList(page)
}

function onEdit(row) {
  // 填充表单
  editForm.id = row.id
  editForm.realName = row.realName || ''
  editForm.studentId = row.studentId || ''
  editForm.dormBuilding = row.dormBuilding || ''
  editForm.dormRoom = row.dormRoom || ''
  editForm.status = typeof row.status !== 'undefined' ? row.status : 1
  editDialogVisible.value = true
}

async function submitEdit() {
  try {
    await editFormRef.value.validate()
  } catch (err) {
    return
  }

  const payload = {
    id: editForm.id,
    realName: editForm.realName,
    studentId: editForm.studentId,
    dormBuilding: editForm.dormBuilding,
    dormRoom: editForm.dormRoom,
    status: editForm.status
  }

  try {
    await updateUser(payload)
    ElMessage.success('更新成功')
    editDialogVisible.value = false
    fetchList(pageNum.value)
  } catch (e) {
    console.error(e)
    ElMessage.error('更新失败')
  }
}

function onConfirmReset(row) {
  ElMessageBox.confirm('确认重置该用户的基准吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await resetUserBaseline(row.id)
        ElMessage.success('重置成功')
        fetchList(pageNum.value)
      } catch (e) {
        console.error(e)
        ElMessage.error('重置失败')
      }
    })
    .catch(() => {
      /* 取消 */
    })
}

onMounted(() => {
  fetchList(1)
})
</script>

<style scoped>
.user-page {
  padding: 16px;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;
}
</style>

