
# 專案使用說明

## Directory Structure

    ```bash
    shuttler-backend
    ├── .env.example           # 設定專案環境變數設定檔
    ├── .eslintrc.json         # Eslint 設定檔
    ├── .gitignore             # 告訴 git 不要加入版本控制設定檔
    ├── .prettierrc.json       # Prettier 設定檔
    ├── bin
    │   └── www.js             # server script
    ├── container-utility      # 容器內會用到的檔案
    ├── docker-compose.yml     # docker-compose 檔案
    ├── Dockerfile             # Dockerfile
    ├── LICENSE                # 開放源始碼授權條款
    ├── Makefile               # 定義專案的工作流程
    ├── package-lock.json      # 確保專案成員安裝的相依套件版本完全一致
    ├── package.json           # 專案的基本資訊、相依套件、腳本命令
    ├── public                 # 靜態檔案
    ├── README.md              # 專案說明手冊
    └── src                    # 應用程式
        ├── app.js             # Express 進入點
        ├── config             # 環境變數相關設定檔
        ├── controllers        # 控制器
        ├── db                 # 資料庫連線
        ├── entities           # TypeORM db entity
        ├── middlewares        # 中介軟體
        ├── routes             # 路由
        │   └── v1             # v1 版本路由
        └── utils              # 通用工具函式
    ```

## 1. 下載 Git Repository

<details>

<summary>下載專案方式</summary>

1. 使用 `Git Clone by HTTPS`

    ```bash
    git clone https://github.com/shuttler-tw/shuttler-backend.git
    ```

2. 使用 `git clone by SSH`

    ```bash
    git clone git@github.com:shuttler-tw/shuttler-backend.git
    ```

3. 使用 `Download repository zip`

    - 用 `curl` 來下載 zip 檔

    ```bash
    curl -sSL https://github.com/shuttler-tw/shuttler-backend/archive/refs/heads/main.zip -o shuttler-backend.zip
    ```

    - 用 `unzip` 解壓縮 zip 檔

    ```bash
    unzip shuttler-backend.zip
    ```


</details>

## 2. 啟動容器

<details>

<summary>使用容器說明</summary>

1. 進入到 `shuttler-backend` 專案目錄

    ```bash
    cd shuttler-backend
    ```

2. 先把 `.env.example` 重新命名為 `.env`

    ```bash
    cp .env.example .env
    ```

3. 確認當前 CPU 架構

    請按照 `uname -m` 輸出結果，來修改 `.env` 中的 `PLATFORM` 的預設值

    ```bash
    uname -m
    ```

4. 請依據輸出結果，修改 `.env`

    `.env` 請按照自已所需要的做修改即可

    | 變數名稱 | 預設值 | 說明 |
    | --- | --- | --- |
    | PROJECT_NAME | demo | 專案名稱 |
    | DOCKERHUB_ACCOUNT | demo | Docker Hub 上的使用者名稱 |
    | PLATFORM | arm64 | 當前電腦的 CPU 架構 | 
    | NVM_VERSION | 0.40.2 | NVM 版本 |
    | NODE_VERSION | 22.14.0 | NODE 版本 |
    | PNPM_HOME | /pnpm | pnpm 套件的全局目錄 |
    | PNPM_VERSION | 10.8.1 | PNPM 版本 |
    | YARN_VERSION | 1.22.22 | YARN 版本 |
    | GOLANG_VERSION | 1.24.2 | GOLANG 版本 |
    | GUM_VERSION | 0.16.0 | GUM 版本 |
    | LOCAL_PORT | 3002 | 使用本機的 3002 埠號 |
    | CONTAINER_PORT | 3002 | 使用容器內的 3002 埠號 |
    | LOG_LEVEL | debug | 應用程式開發日誌分級 |
    | DB_VERSION | 17.4-alpine3.21 | PostgreSQL container tag |
    | DB_HOST | postgres | PostgreSQL 位置 | 
    | DB_PORT | 5432 | PostgreSQL listen port |
    | DB_USERNAME | testUser | DB 使用者名稱 |
    | DB_PASSWORD | P@ss0rd | DB 密碼|
    | DB_DATABASE | testDB | DB 資料庫名稱 |
    | DB_SYNCHRONIZE | true | TypeORM 同步 PostgreSQL |
    | DB_ENABLE_SSL | false | PostgreSQL 啟用 SSL 加密連線 |

5. make 指令使用說明

    在終端機中，輸入指令 `make` 會看到下圖的說明及使用方法

    ![image](https://hackmd.io/_uploads/ByvqULokxg.png)
    
    $\textcolor{Crimson}{P.S. 以下指令，請務必在本機執行}$

    - 查看目前執行中的容器

      ```bash
      make show
      ```

    - 按 Dockerfile 內容，進行編譯容器映像檔

      ```bash
      make compose-build
      ```

    - 啟動容器

      ```bash
      make compose-up
      ```

    - 停止容器，並`保留`本地開發資料

      ```bash
      make compose-stop
      ```

    - 停止容器，並`刪除`本地開發資料

      ```bash
      make compose-down
      ```

    - 容器狀態為 `exited` 時，重新啟動容器

      ```bash
      make reattach
      ```

    - 容器狀態為 `running` 時，重新進入到容器

      ```bash
      make attach
      ```

    - 容器狀態為 `running` 時，停止運行容器

      ```bash
      make halt 
      ```

    - 清除容器狀態為 `exited` 以及容器映像檔為 `none`  

      ```bash
      make clean
      ```

</details>

## 3. pnpm 套件使用說明


<details>

<summary>pnpm 常用指令</summary>

1. 安裝套件

    ```bash
    pnpm install nodemon
    ```

2. 確認目前 pnpm store 路徑

    ```bash
    pnpm store path
    ```

3. 確認 pnpm global store 路徑

    ```bash
    pnpm config get store-dir
    ```

4. 修改 pnpm global store 路徑

    ```bash
    pnpm config set store-dir "${PNPM_HOME}"
    ```

</details>


## DB migration

<details>

<summary>migration 相關指令</summary>

- 異動 db entity，建立 migration 檔案
```
    pnpm migration:generate ./src/migrations/[FileName] --pretty    
```

- 執行 migration
```
    pnpm migration:run
```
- 查看尚未執行的 migrations
```
    pnpm migration:show
```
- 退回 migration
```
    pnpm migration:revert
```
</details>