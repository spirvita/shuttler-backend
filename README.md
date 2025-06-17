# 羽神同行｜羽球活動報名系統（Backend）

這是一套專為羽球同好打造的活動報名系統。讓使用者可以快速找到可參加的羽球活動，也讓活動發起者能節省繁瑣流程，快速建立報名頁面、管理參與者名單與金流狀態。

## 目錄
- [功能特色](#功能特色)
- [使用技術](#使用技術)
- [專案架構](#專案架構)
- [環境變數](#環境變數)
- [快速開始](#快速開始)
  - [前置需求](#前置需求)
  - [安裝步驟](#安裝步驟)
- [Make 指令清單](#make-指令清單)
  - [Docker 指令](#docker-指令)
  - [Docker Compose 指令](#docker-compose-指令)
  - [其它指令](#其它指令)
- [API 文件與部署資訊](#api-文件與部署資訊)

## 功能特色
- 使用者註冊登入
- 活動創建與管理
- 活動列表與報名
- 舉辦者後台管理報名資料
- 金流串接 (藍新金流)

## 使用技術
- **後端框架**：Node.js、Express.js
- **資料庫**：PostgreSQL、TypeORM
- **驗證機制**：JWT
- **文件生成**：Swagger (OpenAPI)
- **靜態檔案儲存**：AWS S3
- **開發工具**：ESLint、Prettier
- **部署環境**：Docker、Docker Compose

## 專案架構
```bash
shuttler-backend/
├── .github/            # GitHub 配置
├── bin/                # 啟動伺服器
├── container-utility/  # 容器工具
├── public/             # 靜態資源
├── src/
│   ├── config/         # 環境變數配置
│   ├── controllers/    # 控制器
│   ├── db/             # 資料庫配置
│   ├── entities/       # 資料庫實體
│   ├── middlewares/    # 中介層
│   ├── migrations/     # 資料庫遷移
│   ├── routes/         # 路由
│   ├── seeds/          # 種子數據
│   ├── utils/          # 通用功能工具
│   └── app.js          # 應用程式入口
├── .env.example        # 環境變數範例
├── .eslintrc.json      # ESLint 配置
├── .prettierrc.json    # Prettier 配置
├── docker-compose.yml  # Docker Compose 配置
├── Dockerfile          # Docker 配置
├── Makefile            # 定義專案的工作流程
└── package.json        # 專案基本資訊、相依套件、腳本命令
```

## 環境變數
環境變數設定，請參考 `.env.example` 檔案並複製為 `.env` 檔案，然後根據您的環境進行修改。
```env
# 專案設定
PROJECT_NAME=shuttler-backend
DOCKERHUB_ACCOUNT=your_dockerhub_account
PLATFORM=amd64 # or arm64, 依據當前 CPU 架構修改

# Dockerfile ARG variables
NVM_VERSION=0.40.3
NODE_VERSION=22.15.0
PNPM_HOME=/pnpm
PNPM_VERSION=10.9.0
YARN_VERSION=1.22.22
GOLANG_VERSION=1.24.2
GUM_VERSION=0.16.0

# 容器設定
LOCAL_PORT=3002
CONTAINER_PORT=3002
LOG_LEVEL=debug

# API URL
API_URL=http://localhost:3002

# 資料庫 設定
DB_VERSION=17.4-alpine3.21
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_db_password
DB_DATABASE=postgres
DB_SYNCHRONIZE=false
DB_ENABLE_SSL=false

# JWT 設定
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_DAY=7d

# Google Oauth2.0 設定
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/api/v1/auth/google/callback

# AWS S3 設定
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET=shuttler-uploads
```

## 快速開始
### 前置需求
- Node.js
- npm or pnpm
- Docker & Docker Compose
- PostgreSQL

### 安裝步驟
1. 複製專案
```bash
git clone <repository-url>
cd shuttler-backend
```

2. 安裝相依套件
```bash
pnpm install
```

3. 環境配置
```bash
# 編輯 .env 文件，設置環境變數
cp .env.example .env
```

4. 確認當前 CPU 架構
```bash
# 確認當前 CPU 架構，來修改 `.env` 中的 `PLATFORM` 的預設值
uname -m
```

5. 編譯容器映像檔
```bash
make compose-build
```

6. 啟動容器
```bash
make compose-up
```

7. 進入容器
```bash
make attach
```
8. 執行資料庫遷移
```bash
pnpm typeorm migration:run
```

## 開發者指令速查

以下是常用的 `pnpm` 與資料庫 migration 指令，方便開發時查閱。

<details>
<summary><strong>pnpm 常用指令</strong></summary>

1. 安裝套件

    ```bash
    pnpm install <package-name>
    ```

2. 查看目前 `pnpm` store 路徑

    ```bash
    pnpm store path
    ```

3. 查看全域 store 路徑設定

    ```bash
    pnpm config get store-dir
    ```

4. 設定全域 store 路徑（建議與環境變數 `PNPM_HOME` 一致）

    ```bash
    pnpm config set store-dir "${PNPM_HOME}"
    ```
</details>

<details>
<summary><strong>Migration 相關指令</strong></summary>

1. 當修改 `entity` 檔案後，建立新的 migration 檔案：

    ```bash
    pnpm migration:generate ./src/migrations/[FileName] --pretty
    ```

2. 執行 migration：

    ```bash
    pnpm migration:run
    ```

3. 查看尚未執行的 migrations：

    ```bash
    pnpm migration:show
    ```

4. 退回最新一筆 migration：

    ```bash
    pnpm migration:revert
    ```
</details>


## Make 指令清單

你可以透過 `make <target>` 執行以下常用指令：

### Docker 指令

| 指令名稱 | 說明 |
|----------|------|
| `make show` | 查看目前執行中的容器 |
| `make build` | 依據 Dockerfile 建立映像檔 |
| `make run` | 啟動容器（離開時自動停止） |
| `make attach` | 容器狀態為 `running` 時，重新進入到容器 |
| `make reattach` | 容器狀態為 `exited` 時，重新啟動容器 |
| `make halt` | 容器狀態為 `running` 時，停止運行容器 |

### Docker Compose 指令

| 指令名稱 | 說明 |
|----------|------|
| `make compose-build` | 按 Dockerfile 內容，編譯並建構容器映像檔 |
| `make compose-up` | 啟動容器 |
| `make compose-stop` | 停止容器（保留 volume 資料） |
| `make compose-down` | 停止容器並移除 volume 資料 |

### 其它指令

| 指令名稱 | 說明 |
|----------|------|
| `make clean` | 清除容器狀態為 `exited` 以及映像檔為 `none` |

## API 文件與部署資訊

Swagger 文件瀏覽路徑：

- **開發環境**：[http://localhost:3002/api-docs](http://localhost:3002/api-docs)
- **測試環境**：[https://dev-api.spirvita.tw/api-docs](https://dev-api.spirvita.tw/api-docs)

線上 API 測試網址：

- [https://dev-api.spirvita.tw/](https://dev-api.spirvita.tw/)
