# MMCA 專案檔案結構說明 (Remind.md)

本檔案旨在提供 MMCA (多模型協作 Agent) 專案中所有檔案和目錄的中文解釋，幫助開發者快速理解專案結構，並在需要修改或新增功能時能迅速定位到相關檔案。

---

## 檔案樹總覽

```
.
├── Remind.md               # (本檔案) 專案結構中文說明
├── index.html              # 應用程式的 HTML 主入口
├── index.tsx               # React 應用的主渲染檔案
├── App.tsx                 # 應用程式的根組件 (Root Component)
├── types.ts                # 全域 TypeScript 類型定義
├── metadata.json           # 應用程式的元數據 (名稱、描述等)
├── components/             # 存放所有 React UI 組件的資料夾
│   ├── ChatInterface.tsx   # 聊天主介面，包含訊息列表和輸入框
│   ├── Message.tsx         # 單一訊息氣泡組件，負責解析 MMCA 標籤
│   ├── MessageInput.tsx    # 文字輸入框與發送按鈕組件
│   ├── MemorySidebar.tsx   # 左側的記憶體日誌側邊欄
│   └── icons/              # 存放 SVG 圖示組件
│       └── index.tsx       # 統一匯出所有圖示
├── public/                 # 存放靜態資源的資料夾
│   ├── manifest.json       # PWA (漸進式網路應用) 設定檔
│   └── service-worker.js   # PWA 離線功能的核心腳本
└── services/               # 存放與外部服務溝通的邏輯
    └── mmcaService.ts      # 模擬後端 API，獲取 Agent 回應和記憶
```

---

## 檔案詳細說明

### 根目錄檔案

-   **`Remind.md`**:
    -   **作用**: 您正在閱讀的檔案。提供專案結構的中文註解，是理解和維護此專案的起點。

-   **`index.html`**:
    -   **作用**: 整個單頁應用 (SPA) 的 HTML 框架。
    -   **主要內容**: 引入 Tailwind CSS、設定 `importmap` 來管理像 React 和 `@google/genai` 這樣的外部函式庫、掛載 React 應用的根節點 (`<div id="root"></div>`)，以及註冊 PWA 的 `service-worker`。

-   **`index.tsx`**:
    -   **作用**: React 應用的入口點。它將 `App` 組件掛載到 `index.html` 中的 `<div id="root">` 元素上。

-   **`App.tsx`**:
    -   **作用**: 應用程式的「大腦」，是所有組件的父組件。
    -   **主要職責**: 管理整個應用的核心狀態 (State)，例如訊息列表 (`messages`)、記憶體日誌 (`memories`)、載入狀態 (`isLoading`)、側邊欄開關 (`isSidebarOpen`) 等。同時也處理主要的業務邏輯，如發送訊息 (`handleSendMessage`) 和引用記憶 (`handleCiteMemory`)。

-   **`types.ts`**:
    -   **作用**: TypeScript 的類型定義檔案。
    -   **目的**: 集中管理整個專案中會用到的資料結構類型 (如 `Message`, `Memory`)，提供程式碼的類型安全和可讀性。

-   **`metadata.json`**:
    -   **作用**: 定義此應用程式的元數據，主要供開發平台使用。

### `components/` (組件資料夾)

-   **`ChatInterface.tsx`**:
    -   **作用**: 呈現聊天畫面的主容器。
    -   **職責**: 佈局訊息列表和底部的輸入框區域。它從 `App.tsx` 接收資料和函數，並將它們傳遞給子組件 (`MessageComponent`, `MessageInput`)。

-   **`Message.tsx`**:
    -   **作用**: 顯示單則訊息（用戶或 Agent 的訊息）。
    -   **核心功能**: 內建一個 `parseMMCAResponse` 函數，專門用來解析 Agent 回應中的 `[A]`, `[B]`, `[C]`, `[Agent]` 標籤，並將它們以不同的樣式卡片呈現出來，實現了專案藍圖中的「訊息泡泡解析」功能。

-   **`MessageInput.tsx`**:
    -   **作用**: 提供用戶輸入訊息的文字區域和發送按鈕。
    -   **功能**: 處理文字輸入、按下 Enter 發送、根據載入狀態禁用輸入等互動邏輯。

-   **`MemorySidebar.tsx`**:
    -   **作用**: 應用程式左側的側邊欄。
    -   **功能**: 顯示從 `mmcaService` 獲取的記憶體日誌列表。用戶可以瀏覽過去的對話摘要，並點擊「引用記憶」按鈕將特定記憶的引用文字插入到輸入框中。

-   **`components/icons/index.tsx`**:
    -   **作用**: 一個集中的檔案，用來定義和匯出應用中用到的所有 SVG 圖示 (如發送、檢查、大腦等)。方便管理和複用。

### `public/` (公開靜態資源資料夾)

-   **`manifest.json`**:
    -   **作用**: PWA 的設定檔。
    -   **定義內容**: 應用程式的名稱、圖示、啟動 URL、顯示模式（如獨立視窗）、主題顏色等。讓瀏覽器知道這是一個可以「安裝」到桌面或主畫面的網路應用。

-   **`service-worker.js`**:
    -   **作用**: PWA 的核心，一個在背景運行的腳本。
    -   **主要功能**: 攔截網路請求，並將核心檔案 (如 `index.html`) 緩存起來。這使得應用在離線或網路不佳的狀態下也能夠載入和運行。

### `services/` (服務層資料夾)

-   **`mmcaService.ts`**:
    -   **作用**: 模擬與後端 API 的通訊。
    -   **目前功能**: 提供 `getAgentResponse` 和 `getMockMemories` 兩個函數，用 `setTimeout` 模擬網路延遲，並回傳預先定義好的假資料 (Mock Data)。
    -   **未來修改**: 當您要串接真實的後端 API 時，主要就是修改這個檔案裡的函數，將它們從返回假資料改為發送 `fetch` 或 `axios` 請求到您的後端伺服器。
