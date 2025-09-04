# 前端PDF渲染和下载功能

## 1.PDF渲染

`template`

```html
<template>
  <!-- 处方内容 -->
  <dialog :title="dialogTitle" v-model="dialogVisible" width="880px">
    <div ref="pdfRef" class="pdf-view"></div>
    <template #footer>
      <el-button @click="downLoad" type="primary" :disabled="formLoading">下 载</el-button>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </dialog>
</template>
```

`js`

```js
import { nextTick } from "vue";
import PdfjsWorker from "pdfjs-dist/build/pdf.worker.js?worker";
/** 渲染pdf */
async function initPdf() {
  // 异步加载pdf.js
  const PDFJS = await import("pdfjs-dist/build/pdf.js");
  if (typeof window !== "undefined" && "Worker" in window) {
    PDFJS.GlobalWorkerOptions.workerPort = new PdfjsWorker();
  }
  // 加载文档
  let loadingTask = PDFJS.getDocument({ url: pdfSrc.value });
  loadingTask.__PDFDocumentLoadingTask = true;
  const pdf = await loadingTask.promise; // 使用await等待加载完毕
  // 循环渲染每一页
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    let pixelRatio = 3;
    let viewport = page.getViewport({ scale: 1 });
    let divPage = window.document.createElement("div"); // canvas的外层div
    // 使用canvas渲染
    let canvas = divPage.appendChild(window.document.createElement("canvas"));
    divPage.className = "page";
    pdfRef.value.appendChild(divPage);
    canvas.width = viewport.width * pixelRatio; // 计算宽度
    canvas.height = viewport.height * pixelRatio;
    let renderContext = {
      canvasContext: canvas.getContext("2d"),
      viewport: viewport,
      transform: [pixelRatio, 0, 0, pixelRatio, 0, 0]
    };
    await page.render(renderContext).promise; // 一页一页的渲染
    divPage.className = "page complete";
  }
}
```

## 2.通过链接下载PDF

```js
const downLoad = async () => {
  dialogVisible.value = false;

  // 创建一个隐藏的可下载链接
  const link = document.createElement("a");
  link.style.display = "none";

  try {
    // 发起请求获取 PDF 文件
    const response = await fetch(pdfSrc.value);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // 将响应体转换为 Blob
    const blob = await response.blob();

    // 创建一个临时 URL 用于下载
    link.href = URL.createObjectURL(blob);
    link.download = `${patientName.value}.pdf`;

    // 添加到 DOM 并模拟点击
    document.body.appendChild(link);
    link.click();

    // 清理临时 URL
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error fetching or downloading the PDF:", error);
  }
};
```
