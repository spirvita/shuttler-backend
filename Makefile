# Update: 2025-04-27

SHELL := /bin/bash

.DEFAULT_GOAL := help

RED                    := $(shell tput -Txterm setaf 1)
GREEN                  := $(shell tput -Txterm setaf 2)
YELLOW                 := $(shell tput -Txterm setaf 3)
BLUE                   := $(shell tput -Txterm setaf 4)
MAGENTA                := $(shell tput -Txterm setaf 5)
CYAN                   := $(shell tput -Txterm setaf 6)
WHITE                  := $(shell tput -Txterm setaf 7)
RESET                  := $(shell tput -Txterm sgr0)

MKFILE_PATH            := $(abspath $(lastword $(MAKEFILE_LIST)))
ROOT_DIR               := $(shell dirname $(MKFILE_PATH))
WORK_DIR               := $(CURDIR)

ZSHRC                  := ${HOME}/.zshrc

LOWER_ARCH             := $(shell uname -m)

# 設定平台
PLATFORMS := linux/amd64 linux/arm64
MAP_PLATFORMS := amd64 arm64

# Set variable for user customization, if variable have be setting, will be replaced.
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

CONTAINER_NAME         := $(PROJECT_NAME)-backend

# Set defaults DOCKER_VERSION, if variable have be setting, will be replaced.
# https://download.docker.com/linux/static/stable/x86_64/
ifndef DOCKER_VERSION
	override DOCKER_VERSION=28.0.4
endif

# Set defaults DOCKER_COMPOSE_VERSION, if variable have be setting, will be replaced.
# https://github.com/docker/compose/releases/
ifndef DOCKER_COMPOSE_VERSION
	override DOCKER_COMPOSE_VERSION=2.34.0
endif

# Set defaults BUILDX_VERSION, if variable have be setting, will be replaced.
# https://github.com/docker/buildx/releases
ifndef BUILDX_VERSION
	override BUILDX_VERSION=0.22.0
endif

# Set defaults NVM_VERSION, if variable have be setting, will be replaced.
# https://github.com/nvm-sh/nvm/releases
ifndef NVM_VERSION
	override NVM_VERSION=0.40.2
endif

# Set defaults NODE_VERSION, if variable have be setting, will be replaced.
# https://nodejs.org/en/download
ifndef NODE_VERSION
	override NODE_VERSION=22.14.0
endif

# Set defaults PNPM_VERSION, if variable have be setting, will be replaced.
# https://nodejs.org/en/download
ifndef PNPM_VERSION
	override PNPM_VERSION=10.7.1
endif

# Set defaults YARN_VERSION, if variable have be setting, will be replaced.
# https://github.com/yarnpkg/yarn
ifndef YARN_VERSION
	override YARN_VERSION=1.22.22
endif

# Set defaults GOLANG_VERSION, if variable have be setting, will be replaced.
ifndef GOLANG_VERSION
	override GOLANG_VERSION=1.24.2
endif

# Set defaults NEOVIM_VERSION, if variable have be setting, will be replaced.
ifndef GUM_VERSION
	override GUM_VERSION=0.16.0
endif

# Set DockerHub Account Name
ifndef DOCKERHUB_ACCOUNT
	override DOCKERHUB_ACCOUNT=$(DOCKERHUB_ACCOUNT)
endif

define running_platform
	printf "${YELLOW}########################################################################################################################${RESET}\n"; \
	printf "${YELLOW}%-2sBuilding Platform${RESET} ${CYAN}$${PLATFORM}${RESET}\n"; \
	printf "${YELLOW}%-2sMap Platform${RESET} ${CYAN}$${MAP_PLATFORM}${RESET}\n"; \
	printf "${YELLOW}%-2sStart running ${RESET} ${CYAN}$(DOCKERHUB_ACCOUNT)/${CONTAINER_NAME}-$${MAP_PLATFORM}${RESET} ${YELLOW}Container Images${RESET}\n"; \
	printf "${YELLOW}%-4sNVM_VERSION=${RESET}${MAGENTA}${NVM_VERSION}${RESET}\n"; \
	printf "${YELLOW}%-4sNODE_VERSION=${RESET}${MAGENTA}${NODE_VERSION}${RESET}\n"; \
	printf "${YELLOW}%-4sPNPM_VERSION=${RESET}${MAGENTA}${PNPM_VERSION}${RESET}\n"; \
	printf "${YELLOW}%-4sYARN_VERSION=${RESET}${MAGENTA}${YARN_VERSION}${RESET}\n"; \
	printf "${YELLOW}%-4sGOLANG_VERSION=${RESET}${MAGENTA}${GOLANG_VERSION}${RESET}\n"; \
	printf "${YELLOW}%-4sGUM_VERSION=${RESET}${MAGENTA}${GUM_VERSION}${RESET}\n"; \
	printf "${YELLOW}%-4sPNPM_HOME=${RESET}${MAGENTA}${PNPM_HOME}${RESET}\n"; \
	printf "${YELLOW}%-4sCONTAINER_PORT=${RESET}${MAGENTA}${CONTAINER_PORT}${RESET}\n"; \
	printf "${YELLOW}########################################################################################################################${RESET}\n"; \
	docker run --name ${CONTAINER_NAME}-$${MAP_PLATFORM} \
		--volume "$${HOME}/.ssh:/root/.ssh" \
		--volume "$${HOME}/.tmux.conf:/root/.tmux.conf" \
		--volume "${shell pwd}:/work" \
		--publish "${LOCAL_PORT}:${CONTAINER_PORT}" \
		--privileged -it $(DOCKERHUB_ACCOUNT)/${CONTAINER_NAME}-$${MAP_PLATFORM} bash
endef

##@ Docker

.PHONY: show
show: ## Show current running container
	@docker container ls -a

.PHONY: build
build: ## Build container images from Dockerfile
	@platforms_list="$(PLATFORMS)"; \
	map_list="$(MAP_PLATFORMS)"; \
	platforms_array=($$platforms_list); \
	map_array=($$map_list); \
	for i in $$(seq 0 $$(( $$(echo $$platforms_list | wc -w) - 1 ))); do \
		platform=$${platforms_array[$$i]}; \
		map_platform=$${map_array[$$i]}; \
		printf "${YELLOW}########################################################################################################################${RESET}\n"; \
		printf "${YELLOW}%-2sBuilding Platform${RESET} ${CYAN}$${platform}${RESET}\n"; \
		printf "${YELLOW}%-2sMap Platform${RESET} ${CYAN}$${map_platform}${RESET}\n"; \
		printf "${YELLOW}%-2sStart building ${RESET} ${CYAN}$(DOCKERHUB_ACCOUNT)/${CONTAINER_NAME}-$${map_platform}${RESET} ${YELLOW}Container Images${RESET}\n"; \
		printf "${YELLOW}%-4sNVM_VERSION=${RESET}${MAGENTA}${NVM_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sNODE_VERSION=${RESET}${MAGENTA}${NODE_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sPNPM_VERSION=${RESET}${MAGENTA}${PNPM_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sYARN_VERSION=${RESET}${MAGENTA}${YARN_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sGOLANG_VERSION=${RESET}${MAGENTA}${GOLANG_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sGUM_VERSION=${RESET}${MAGENTA}${GUM_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sPNPM_HOME=${RESET}${MAGENTA}${PNPM_HOME}${RESET}\n"; \
		printf "${YELLOW}%-4sCONTAINER_PORT=${RESET}${MAGENTA}${CONTAINER_PORT}${RESET}\n"; \
		printf "${YELLOW}########################################################################################################################${RESET}\n"; \
		docker buildx build --platform=$${platform} \
			--build-arg TARGETPLATFORM=$${platform} \
			--build-arg buildtime_NVM_VERSION=$(NVM_VERSION) \
			--build-arg buildtime_NODE_VERSION=$(NODE_VERSION) \
			--build-arg buildtime_PNPM_VERSION=$(PNPM_VERSION) \
			--build-arg buildtime_YARN_VERSION=$(YARN_VERSION) \
			--build-arg buildtime_GOLANG_VERSION=$(GOLANG_VERSION) \
			--build-arg buildtime_GUM_VERSION=$(GUM_VERSION) \
			--build-arg buildtime_PNPM_HOME=$(PNPM_HOME) \
			--build-arg buildtime_CONTAINER_PORT=$(CONTAINER_PORT) \
			-t $(DOCKERHUB_ACCOUNT)/${CONTAINER_NAME}-$${map_platform} -f Dockerfile .; \
	done

.PHONY: run
run: ## Start running container, when you exit container, container will be stopped.
	@echo "Please choose a platform:"; \
	platforms_list="$(PLATFORMS)"; \
	map_list="$(MAP_PLATFORMS)"; \
	platforms_array=($$platforms_list); \
	map_array=($$map_list); \
	select choice in $$platforms_list; do \
		case $$choice in \
			linux/amd64) \
				PLATFORM="linux/amd64"; \
				MAP_PLATFORM="amd64"; \
				$(call running_platform,$$PLATFORM,$$MAP_PLATFORM); \
				break; \
				;; \
			linux/arm64) \
				PLATFORM="linux/arm64"; \
				MAP_PLATFORM="arm64"; \
				$(call running_platform,$$PLATFORM,$$MAP_PLATFORM); \
				break; \
				;; \
			*) \
				echo "Invalid choice. Please choose a valid platform."; \
				continue; \
				;; \
		esac; \
	done

.PHONY: attach
attach: ## attach the running container
ifeq ($(LOWER_ARCH), x86_64)
	@CONTAINER_STATUS=$(shell docker ps -a --filter "name=$(CONTAINER_NAME)-amd64" --format "{{.State}}"); \
	if [ "$${CONTAINER_STATUS}" = "running" ]; then \
		printf "[INFO]%-4sContainer ${CYAN}$(CONTAINER_NAME)-amd64${RESET} is ${GREEN}running${RESET}.\n"; \
	fi;
	@docker exec -it $(CONTAINER_NAME)-amd64 bash
else ifeq ($(LOWER_ARCH), arm64)
	@CONTAINER_STATUS=$(shell docker ps -a --filter "name=$(CONTAINER_NAME)-arm64" --format "{{.State}}"); \
	if [ "$${CONTAINER_STATUS}" = "running" ]; then \
		printf "[INFO]%-4sContainer ${CYAN}$(CONTAINER_NAME)-arm64${RESET} is ${GREEN}running${RESET}.\n"; \
	fi;
	@docker exec -it $(CONTAINER_NAME)-arm64 bash
else
	@printf "${RED}[ERROR]${RESET}:%-2sUnknown architecture: ${MAGENTA}$(LOWER_ARCH)${RESET}\n";
endif

.PHONY: reattach
reattach: ## Reattach the existing container
ifeq ($(LOWER_ARCH), x86_64)
	@CONTAINER_STATUS=$(shell docker ps -a --filter "name=$(CONTAINER_NAME)-amd64" --format "{{.State}}"); \
	if [ "$${CONTAINER_STATUS}" = "exited" ]; then \
		printf "${MAGENTA}[WARNING]${RESET}%-1sContainer ${CYAN}$(CONTAINER_NAME)-amd64${RESET} is ${MAGENTA}exited${RESET}. ${YELLOW}Restarting...${RESET}\n"; \
	fi;
	@docker start $(CONTAINER_NAME)-amd64 >> /dev/null; \
		printf "[INFO]%-4sContainer ${CYAN}$(CONTAINER_NAME)-amd64${RESET} is ${GREEN}running${RESET}.\n";
	@docker exec -it $(CONTAINER_NAME)-amd64 bash
else ifeq ($(LOWER_ARCH), arm64)
	@CONTAINER_STATUS=$(shell docker ps -a --filter "name=$(CONTAINER_NAME)-arm64" --format "{{.State}}"); \
	if [ "$${CONTAINER_STATUS}" = "exited" ]; then \
		printf "${MAGENTA}[WARNING]${RESET}%-1sContainer ${CYAN}$(CONTAINER_NAME)-arm64${RESET} is ${MAGENTA}exited${RESET}. ${YELLOW}Restarting...${RESET}\n"; \
	fi;
	@docker start $(CONTAINER_NAME)-arm64 >> /dev/null; \
		printf "[INFO]%-4sContainer ${CYAN}$(CONTAINER_NAME)-arm64${RESET} is ${GREEN}running${RESET}.\n";
	@docker exec -it $(CONTAINER_NAME)-arm64 bash
else
	@printf "${RED}[ERROR]${RESET}:%-2sUnknown architecture: ${MAGENTA}$(LOWER_ARCH)${RESET}\n";
endif

.PHONY: halt
halt: ## Stop the running container
ifeq ($(LOWER_ARCH), x86_64)
	@CONTAINER_STATUS=$(shell docker ps -a --filter "name=$(CONTAINER_NAME)-amd64" --format "{{.State}}"); \
	if [ "$${CONTAINER_STATUS}" = "running" ]; then \
		printf "[INFO]%-4sContainer ${CYAN}$(CONTAINER_NAME)-amd64${RESET} is ${GREEN}running${RESET}.\n"; \
	fi;
	@docker stop $(CONTAINER_NAME)-amd64 >> /dev/null; \
		printf "[INFO]%-4sContainer ${CYAN}$(CONTAINER_NAME)-amd64${RESET} is ${GREEN}exited${RESET}.\n";
else ifeq ($(LOWER_ARCH), arm64)
	@CONTAINER_STATUS=$(shell docker ps -a --filter "name=$(CONTAINER_NAME)-arm64" --format "{{.State}}"); \
	if [ "$${CONTAINER_STATUS}" = "running" ]; then \
		printf "[INFO]%-4sStop Container ${CYAN}$(CONTAINER_NAME)-arm64${RESET}.\n"; \
	fi;
	@docker stop $(CONTAINER_NAME)-arm64 >> /dev/null; \
		printf "[INFO]%-4sContainer ${CYAN}$(CONTAINER_NAME)-arm64${RESET} is ${GREEN}exited${RESET}.\n";
else
	@printf "${RED}[ERROR]${RESET}:%-2sUnknown architecture: ${MAGENTA}$(LOWER_ARCH)${RESET}\n";
endif

##@ Docker Compose

.PHONY: compose-build
compose-build: ## Start running container with docker-compose
	@printf "${YELLOW}########################################################################################################################${RESET}\n"; \
		printf "${YELLOW}%-2sBuilding Platform${RESET} ${CYAN}linux/$${PLATFORM}${RESET}\n"; \
		printf "${YELLOW}%-2sStart building ${RESET} ${CYAN}$(DOCKERHUB_ACCOUNT)/${CONTAINER_NAME}-$${PLATFORM}${RESET} ${YELLOW}Container Images${RESET}\n"; \
		printf "${YELLOW}%-4sNVM_VERSION=${RESET}${MAGENTA}${NVM_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sNODE_VERSION=${RESET}${MAGENTA}${NODE_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sPNPM_VERSION=${RESET}${MAGENTA}${PNPM_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sYARN_VERSION=${RESET}${MAGENTA}${YARN_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sGOLANG_VERSION=${RESET}${MAGENTA}${GOLANG_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sGUM_VERSION=${RESET}${MAGENTA}${GUM_VERSION}${RESET}\n"; \
		printf "${YELLOW}%-4sPNPM_HOME=${RESET}${MAGENTA}${PNPM_HOME}${RESET}\n"; \
		printf "${YELLOW}%-4sCONTAINER_PORT=${RESET}${MAGENTA}${CONTAINER_PORT}${RESET}\n"; \
		printf "${YELLOW}########################################################################################################################${RESET}\n"; \
		docker compose --env-file .env build

.PHONY: compose-up
compose-up: ## Start container with docker-compose
	@docker compose --env-file .env up -d

.PHONY: compose-stop
compose-stop: ## Stop container with docker-compose
	@docker compose --env-file .env stop

.PHONY: compose-down
compose-down: ## Stop container and remove all of container, volume, network with docker-compose
	@docker compose --env-file .env down -v

##@ Global Commands

.PHONY: clean
clean: ## Garbage disposal
	@CONTAINER_IMAGES_PURGE=$$(docker images -q -f dangling=true); \
	if [ ! -z "$${CONTAINER_IMAGES_PURGE}" ]; then \
		docker rmi -f $${CONTAINER_IMAGES_PURGE}; \
	else \
		echo "No dangling images to remove."; \
	fi
	@CONTAINER_CLEAN=$$(docker ps -a -q -f status=exited -f status=created); \
	if [ ! -z "$${CONTAINER_CLEAN}" ]; then \
		docker rm -f $${CONTAINER_CLEAN}; \
	fi

.PHONY: help
help:
	@awk 'BEGIN {FS = ":.*##"; printf "\n${YELLOW}Usage:${RESET}\n  make ${CYAN}<target>${RESET}\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  ${CYAN}%-15s${RESET} %s\n", $$1, $$2 } /^##@/ { printf "\n${YELLOW}%s${RESET}\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
