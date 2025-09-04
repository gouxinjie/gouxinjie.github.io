# 把页面导出为 pdf

---

```js
<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="900">
    <div class="content" id="eps">
      <p class="top" style="margin-top: 0">网格化慢病管理平台</p>
      <h1 class="title">运动处方</h1>
      <p class="num">
        处方编号：<span id="prescriptionNumber">{{ prescriptionNumber }}</span>
      </p>
      <div class="split"></div>
      <div class="user-info-parent">
        <p class="title2">一、个人信息</p>
        <div class="user-info">
          <div class="row">
            <p>
              <span>姓名：</span><span> {{ patientInfo.name }}</span>
            </p>
            <p>
              <span>性别：</span><span> {{ getDictLabel(DICT_TYPE.SYSTEM_USER_SEX, patientInfo.sex) }}</span>
            </p>
            <p>
              <span>年龄：</span><span> {{ calculateAge(patientInfo.birthday) }}</span>
            </p>
          </div>

          <div class="row">
            <p>
              <span>医保卡号：</span><span> {{ patientInfo.insuranceCardNo }}</span>
            </p>
            <p>
              <span>病历卡号：</span><span> {{ patientInfo.medicalCardNo }}</span>
            </p>
          </div>
          <div class="row">
            <p>
              <span>诊断结果：</span><span> {{ visitResult }}</span>
            </p>
          </div>
          <div class="row">
            <p>
              <!-- 体测结果 -->
              <span>运动能力评估 ：</span><span>{{ getDictLabel(DICT_TYPE.PHYSICAL_ASSESSMENT_LEVEL, physicalResult) }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="user-info-parent">
        <p class="title2">二、处方内容</p>
        <div class="user-info">
          <div class="row">
            <p>
              <span>运动目标：</span><span> {{ prescriptionInfo.sportGoal }}</span>
            </p>
          </div>
          <div class="row">
            <p>
              <span>处方开始时间：</span><span> {{ prescriptionInfo.startDate }}</span>
            </p>
          </div>
          <div class="row">
            <p>
              <span>处方周期：</span><span> {{ prescriptionInfo.totalCycle }}周</span>
            </p>
          </div>
          <div class="row">
            <p style="font-weight: 600">每周运动内容：</p>
          </div>
          <div class="table">
            <el-table :data="prescriptionInfo.sportProjectDetail" border style="width: 100%" :header-cell-style="{ color: '#000' }" align="center">
              <el-table-column prop="projectId" label="运动项目" align="center">
                <template #default="scope">
                  <span>{{ sportProjectFun(scope.row.projectId) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="frequencyCount" label="运动频率" align="center">
                <template #default="scope">
                  <span>{{ scope.row.frequencyCount }}次/周</span>
                </template>
              </el-table-column>
              <el-table-column prop="singleQuantity" label="运动量" align="center">
                <template #default="scope">
                  <span v-if="scope.row.singleQuantity">{{ scope.row.singleQuantity }}个</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="singleDuration" label="运动时间" align="center">
                <template #default="scope">
                  <span>{{ Math.floor(scope.row.singleDuration / 60) }}分钟</span>
                </template>
              </el-table-column>
              <el-table-column prop="intensityCount" label="运动强度" align="center">
                <template #default="scope">
                  <span>{{ getDictLabel(DICT_TYPE.AI_EXERCISE_INTENSITY_LEVEL, scope.row.intensityCount) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="careful">
            <p>注意事项：</p>
            <p v-for="item in precautionsList" :key="item">{{ item }}</p>
          </div>
        </div>
      </div>

      <!-- 签名和二维码 -->
      <div class="sign-parent" id="sign-parent">
        <div class="split"></div>
        <div class="code-sign">
          <div class="code">
            <img style="width: 100px; height: 100px" :src="mpCodeImage" alt="" />
            扫码查看电子版运动处方
          </div>
          <div class="sign">
            <span class="doctor">医师(签章):</span>
            <img style="width: 200px; height: 100px; margin-top: auto" :src="signatureImage" alt="" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确认开具</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getIntDictOptions, DICT_TYPE, getDictLabel } from '@/utils/dict';
import { InfoApi, PrescriptionInfoSaveReqVO } from '@/api/prescription/info/index';
import { InfoApi as patientInfoApi, InfoVO as patientInfoVO } from '@/api/patient/patientInfo';
import { DoctorInfoApi } from '@/api/system/doctorinfo/index';
import { MpConfigApi } from '@/api/patient/mpconfig';
import { BasicInfoApi } from '@/api/exercise/basicInfo';
import { prescriptionStoreWithOut } from '@/store/modules/prescription'; // vuex
import { ElLoading } from 'element-plus';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { calculateAge, generateFileName } from '@/utils/common';
import { useTagsViewStore } from '@/store/modules/tagsView';
import { ElNotification } from 'element-plus';

const { delView } = useTagsViewStore();

const prescriptionStore = prescriptionStoreWithOut(); // vuex
const { currentRoute, push, go } = useRouter(); // 路由

const visitResult = ref(); // 就诊结果
const physicalResult = ref(); // 体格检查结果

const message = useMessage(); // 消息弹窗
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const exerciseDict = ref<{ label: string; value: number }[]>([]); // 运动项目

const patientInfoBasic = {
  id: null, // 编号
  name: '', // 姓名
  sex: null, // 性别
  birthday: '', // 出生年月日
  idCard: '', // 身份证
  mobile: '', // 手机号
  medicalCardNo: '', // 病历卡号
  insuranceCardNo: '', // 医保卡号
  height: null, // 身高
  weight: null, // 体重
  waistline: null, // 腰围
  lastRelatedDoctor: '', // 最近关联医生
  lastVisitId: null, // 最近就诊记录
  conditionDetails: '' // 病历信息
};
const signatureImage = ref(''); // 医生签名图片
const mpCodeImage = ref('');
// 患者本人的信息
const patientInfo = ref<patientInfoVO>(patientInfoBasic);

// 处方编号
const prescriptionNumber = ref('开具处方之后生成');
// 处方报告信息
const prescriptionInfo = ref<PrescriptionInfoSaveReqVO>({
  id: null,
  patientId: null,
  patientVisitId: null,
  physicalAssessmentRecordId: null,
  sportGoal: ' ',
  startDate: '',
  totalCycle: 2,
  cycleUnit: 2, //周期单位 字典值
  // 运动内容
  sportProjectDetail: [
    {
      projectId: null,
      frequencyCount: null,
      intensityCount: null,
      singleQuantity: null,
      singleDuration: null
    }
  ],
  // 注意事项
  precautions: ''
});

/** 获取运动项目  */
function sportProjectFun(id: number) {
  let result = '';
  if (id) {
    exerciseDict.value.forEach((dictData) => {
      if (dictData.value == id) {
        result = dictData.label;
      }
    });
  }
  return result;
}
/** 打开弹窗 prescriptionData:是处方数据  */
const open = async (prescriptionData: any) => {
  dialogVisible.value = true;
  dialogTitle.value = '预览运动处方';

  resetForm(); // 清除表单

  prescriptionInfo.value = prescriptionData; // 渲染处方报告信息

  // 就诊信息和体测结果
  if (prescriptionStore.visitResult || prescriptionStore.physicalResult) {
    visitResult.value = prescriptionStore.visitResult;
    physicalResult.value = prescriptionStore.physicalResult;
  }
  // 并行请求
  try {
    const [patientInfoResult, exerciseDictResult, doctorInfoResult, mpCodeObjResult] = await Promise.all([
      patientInfoApi.getInfo(Number(prescriptionData.patientId)),
      BasicInfoApi.getExerciseList(),
      DoctorInfoApi.getProfile(),
      MpConfigApi.getMpConfigByKey('mpCode')
    ]);
    // 更新状态
    patientInfo.value = patientInfoResult;
    exerciseDict.value = exerciseDictResult;
    signatureImage.value = doctorInfoResult.signatureImage;
    mpCodeImage.value = mpCodeObjResult.configValue;
  } catch (error) {
    console.error('Error during parallel requests:', error);
    // 处理错误
    message.error('获取数据失败');
  }
};

defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/**
 * 注意事项列表
 */
const precautionsList = computed(() => {
  return prescriptionInfo.value.precautions.split('\n');
});

/**
 * 导出PDF 以毫米为单位的A4纸
 */
async function printPDF() {
  processingTruncation(); // 处理截断

  const tableElement: HTMLElement | null = document.getElementById('eps'); // 获取表格元素

  const canvas = await html2canvas(tableElement!, {
    allowTaint: false,
    useCORS: true,
    // @ts-ignore
    background: '#ffffff',
    scale: 2, // 提高渲染分辨率
    // @ts-ignore
    dpi: 300, // 提高 DPI 原来是300
    onclone: (doc) => {
      // 在克隆文档中隐藏不需要的元素（如果有的话）
      const epsElement = doc.getElementById('eps') as HTMLDivElement | null;
      const prescriptionNumberEl = doc.getElementById('prescriptionNumber') as HTMLElement;
      if (epsElement) {
        epsElement.style.border = 'none';
        prescriptionNumberEl.innerText = prescriptionNumber.value;
      }
    }
  });

  // PDF文件名 patientInfo.name
  const pdfFileName = `${generateFileName(patientInfo.value.name)}.pdf`;

  // 创建一个新的PDF文档
  const pdf = new jsPDF('p', 'mm', 'a4'); // A4纸张，纵向
  const ctx = canvas.getContext('2d')!;
  const a4Width = 190; // A4纸张宽度减去两侧各10mm的边距
  // const a4Height = 277; // A4纸张高度减去上下各10mm的边距
  const a4Height = 297; // 不用减
  const imgHeight = Math.floor((a4Height * canvas.width) / a4Width); // 按A4显示比例计算图像的高度
  let renderedHeight = 0; // 渲染高度

  // 分页处理图像
  while (renderedHeight < canvas.height) {
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = Math.min(imgHeight, canvas.height - renderedHeight); // 当前页的图像高度

    // 剪裁指定区域并画到新的canvas对象中
    const pageCtx = pageCanvas.getContext('2d')!;
    pageCtx.putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0);

    // 添加图像到PDF页面
    pdf.addImage(pageCanvas.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4Width, Math.min(a4Height, (a4Width * pageCanvas.height) / pageCanvas.width));

    // 更新已渲染的高度
    renderedHeight += pageCanvas.height;

    // 如果后面还有内容，则添加新页面
    if (renderedHeight < canvas.height) {
      pdf.addPage();
    }
  }

  console.log(222, 'printPDF');

  // 输出 PDF 文件为 Blob 对象
  // @ts-ignore
  const blob = pdf.output('blob', { filename: pdfFileName });
  await uploadSignatureFun(blob);

  console.log(333);

  // 保存PDF文件
  pdf.save(pdfFileName);

  // 生成完成之后去除留白节点
  const emptyDivParent = document.getElementsByClassName('careful')[0];
  const emptyDiv = document.getElementsByClassName('emptyDiv')[0];
  if (emptyDivParent && emptyDiv) {
    // 确保 emptyDiv 是 emptyDivParent 的子元素
    if (emptyDivParent.contains(emptyDiv)) {
      emptyDivParent.removeChild(emptyDiv);
    }
  }
}

/**
 * 上传pdf
 */
async function uploadSignatureFun(blob: Blob) {
  const pdfFile = new FormData();
  pdfFile.append('file', blob);
  // @ts-ignore
  pdfFile.append('id', prescriptionNumber.value); // 处方编号
  await InfoApi.uploadSignature(pdfFile);
}

/**
 * 处理截断  添加空白div把节点挤到下一页
 */
function processingTruncation(): void {
  // 获取所有需要分割的节点
  const nodeList = document.querySelectorAll('.careful p') as NodeListOf<HTMLParagraphElement>;
  const A4_WIDTH = 592.28;
  const A4_HEIGHT = 841.89;
  const target = document.getElementById('eps') as HTMLElement;
  const pageHeight = (target.scrollWidth / A4_WIDTH) * A4_HEIGHT;

  // 遍历节点，判断是否需要分割并添加留白节点
  for (let i = 0; i < nodeList.length; i++) {
    const multiple = Math.ceil((nodeList[i].offsetTop + nodeList[i].scrollHeight) / pageHeight);
    if (isSplit(nodeList, i, multiple * pageHeight)) {
      const divParent = nodeList[i].parentNode as HTMLElement; // 获取节点的父节点
      // 添加空白div
      const emptyDivNode = document.createElement('div');
      emptyDivNode.className = 'emptyDiv';
      emptyDivNode.style.background = '#fff';
      const _H = multiple * pageHeight - (nodeList[i].offsetTop + nodeList[i].scrollHeight);
      emptyDivNode.style.height = _H + 30 + 'px';
      emptyDivNode.style.width = '100%';
      const next = nodeList[i].nextSibling as Node | null; // 获取节点的下一个兄弟节点
      if (next) {
        divParent.insertBefore(emptyDivNode, next); // 将留白节点插入到下一个兄弟节点之前
      } else {
        divParent.appendChild(emptyDivNode); // 将留白节点添加到最后
      }
    }
  }
}

/**
 * 判断是否需要添加空白div
 * @param nodes 要检查的节点列表
 * @param index 当前节点的索引
 * @param pageHeight 页面的高度
 * @returns 是否需要添加空白div
 */
const isSplit = (nodes: NodeListOf<HTMLParagraphElement>, index: number, pageHeight: number): boolean => {
  // 计算当前这块dom是否跨越了a4大小，以此分割
  if (nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight) {
    return true;
  }
  return false;
};

/** 开具处方并生成pdf */
async function submitForm() {
  let loading: any = null;
  try {
    console.log(111);

    // 1,先开具处方
    const data = await InfoApi.saveOrUpdatePrescription(prescriptionInfo.value);

    if (data) {
      prescriptionNumber.value = data;
    }

    loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    try {
      // 2,生成PDF
      await printPDF();
      console.log(4444);
    } catch (error) {
      console.warn('生成PDF失败', error);
    }

    // 延迟三秒 生成处方报告比较慢
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3,关闭加载状态、对话框
    loading.close();
    dialogVisible.value = false;

    // 4,返回详情页面
    delView(unref(currentRoute));
    ElNotification.success({
      title: '处方开具完成',
      message: `已下载运动处方到本地`,
      offset: 100
    });

    go(-2);

    // 5,添加返回到患者详情 - 运动处方切换栏 的缓存标识 需要在切换时主动清除缓存
    localStorage.setItem('_activeName', 'prescriptionInfo');
  } catch (error) {
    message.error('提交处方失败，请稍后再试');
  } finally {
    loading.close(); // 确保加载状态始终关闭
  }
}
/** 重置数据  */
function resetForm() {
  // @ts-ignore
  prescriptionInfo.value = {};
  patientInfo.value = Object.assign({}, patientInfoBasic);
  formLoading.value = false;
  prescriptionNumber.value = '开具处方之后生成';
}
</script>

<style scoped lang="scss">
@mixin eps_flex($direction: row, $justify: null, $align: null, $flex-wrap: null) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
  flex-wrap: $flex-wrap;
}

// 设置表头边框颜色
:deep(th.el-table__cell.is-leaf) {
  border-color: #000;
}
// 设置表格边框颜色
:deep(td.el-table__cell, ) {
  border-color: #000;
}
// 设置表格四周边框颜色
:deep(.el-table--border) {
  border: 1px solid #000;
}
// 设置字体颜色
:deep(.el-table) {
  color: #000;
}

.table {
  width: 100%;
}

.imgs {
  display: flex;
  justify-content: center;
  gap: 100px;
  align-items: center;
}

// 内容容器
.content {
  position: relative;
  box-sizing: border-box;
  width: 792px;
  height: 1123px; // a4纸的高度
  border: 1px dashed #000;
  margin: 0 auto;
  padding: 0px 20px;
  color: #000;

  p {
    margin: 3px 0;
  }

  .title {
    margin: 20px auto;
    font-weight: 300;
    text-align: center;
    letter-spacing: 2px;
    font-size: 30px;
  }
  .top,
  .num {
    font-size: 17px;
    letter-spacing: 2px;
    font-weight: 300;
    text-align: center;
  }

  .split {
    width: 100%;
    height: 1px;
    background: #888;
    margin: 15px 0;
  }
}

.user-info-parent {
  .title2 {
    font-size: 18px;
    font-weight: 300;
    margin: 10px 0;
  }
  .row {
    @include eps_flex(row, null, center);
    gap: 20px;
    p {
      min-width: 33%;
      font-size: 16px;
    }
  }
  .careful {
    margin-top: 10px;
    margin-bottom: 30px;
    font-size: 15px;
    p {
      margin: 5px 0;
    }
  }
}

.sign-parent {
  box-sizing: border-box;
  padding: 0 20px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}
.code-sign {
  // margin-top: 40px;
  @include eps_flex(row, null);
  justify-content: space-between;
  .code {
    width: 150px;
    font-size: 13px;
    @include eps_flex(column, null, center);
    // gap: 10px;
  }
  .sign {
    @include eps_flex(row, null);
    .doctor {
      font-size: 20px;
      font-weight: 500;
      color: #444;
    }
  }
}
</style>

```
