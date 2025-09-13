# DataSphere Guilds - Enterprise Development Makefile
# Scale AI-level automation and build commands

# =================== CONFIGURATION ===================
.PHONY: help install clean build test lint format docker k8s deploy monitor security docs
.DEFAULT_GOAL := help

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Project Configuration
PROJECT_NAME := datasphere-guilds
NODE_VERSION := 20
PNPM_VERSION := 8.15.0
DOCKER_REGISTRY := gcr.io/datasphere-guilds
KUBECTL_NAMESPACE := datasphere-guilds
HELM_RELEASE := datasphere-guilds

# Environment Variables
ENV ?= development
REGION ?= us-central1
CLUSTER_NAME ?= datasphere-guilds-$(ENV)

# =================== HELP ===================
help: ## Show this help message
	@echo "$(GREEN)DataSphere Guilds - Enterprise Development Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(BLUE)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# =================== DEVELOPMENT SETUP ===================
install: ## Install all dependencies and setup development environment
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@node --version | grep -q "v$(NODE_VERSION)" || (echo "$(RED)Node.js $(NODE_VERSION) required$(NC)" && exit 1)
	@pnpm --version | grep -q "$(PNPM_VERSION)" || npm install -g pnpm@$(PNPM_VERSION)
	pnpm install --frozen-lockfile
	@echo "$(GREEN)Setting up pre-commit hooks...$(NC)"
	pnpm run prepare
	@echo "$(GREEN)Generating types...$(NC)"
	pnpm run build:types
	@echo "$(GREEN)Development environment ready!$(NC)"

setup: ## Initial project setup for new developers
	@echo "$(GREEN)Setting up DataSphere Guilds development environment...$(NC)"
	@make install
	@make env:setup
	@make db:setup
	@make docker:build-dev
	@echo "$(GREEN)Setup complete! Run 'make dev' to start development$(NC)"

clean: ## Clean all build artifacts and dependencies
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	pnpm run clean
	rm -rf node_modules
	rm -rf dist
	rm -rf build
	rm -rf coverage
	rm -rf .turbo
	rm -rf .next
	find . -name "*.log" -type f -delete
	@echo "$(GREEN)Clean complete!$(NC)"

# =================== BUILD COMMANDS ===================
build: ## Build all packages and applications
	@echo "$(GREEN)Building all packages...$(NC)"
	pnpm run build
	@echo "$(GREEN)Build complete!$(NC)"

build:packages: ## Build only shared packages
	@echo "$(GREEN)Building packages...$(NC)"
	pnpm run build:packages
	@echo "$(GREEN)Packages built!$(NC)"

build:apps: ## Build only applications
	@echo "$(GREEN)Building applications...$(NC)"
	pnpm run build:apps
	@echo "$(GREEN)Applications built!$(NC)"

build:services: ## Build only microservices
	@echo "$(GREEN)Building microservices...$(NC)"
	pnpm run build:services
	@echo "$(GREEN)Microservices built!$(NC)"

build:mobile: ## Build mobile application
	@echo "$(GREEN)Building mobile app...$(NC)"
	cd apps/mobile && pnpm run build:android
	cd apps/mobile && pnpm run build:ios
	@echo "$(GREEN)Mobile app built!$(NC)"

build:web: ## Build web application
	@echo "$(GREEN)Building web app...$(NC)"
	cd apps/web && pnpm run build
	@echo "$(GREEN)Web app built!$(NC)"

# =================== DEVELOPMENT ===================
dev: ## Start development environment
	@echo "$(GREEN)Starting development environment...$(NC)"
	pnpm run dev

dev:mobile: ## Start mobile development
	@echo "$(GREEN)Starting mobile development...$(NC)"
	cd apps/mobile && pnpm run start

dev:web: ## Start web development
	@echo "$(GREEN)Starting web development...$(NC)"
	cd apps/web && pnpm run dev

dev:admin: ## Start admin dashboard development
	@echo "$(GREEN)Starting admin dashboard...$(NC)"
	cd apps/admin && pnpm run dev

dev:storybook: ## Start Storybook development
	@echo "$(GREEN)Starting Storybook...$(NC)"
	pnpm run storybook

# =================== TESTING ===================
test: ## Run all tests
	@echo "$(GREEN)Running all tests...$(NC)"
	pnpm run test

test:unit: ## Run unit tests
	@echo "$(GREEN)Running unit tests...$(NC)"
	pnpm run test:unit

test:integration: ## Run integration tests
	@echo "$(GREEN)Running integration tests...$(NC)"
	pnpm run test:integration

test:e2e: ## Run end-to-end tests
	@echo "$(GREEN)Running E2E tests...$(NC)"
	pnpm run test:e2e

test:watch: ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	pnpm run test:watch

test:coverage: ## Run tests with coverage
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	pnpm run test:coverage

test:performance: ## Run performance tests
	@echo "$(GREEN)Running performance tests...$(NC)"
	pnpm run test:performance

# =================== CODE QUALITY ===================
lint: ## Run linting
	@echo "$(GREEN)Running linting...$(NC)"
	pnpm run lint

lint:fix: ## Fix linting issues
	@echo "$(GREEN)Fixing linting issues...$(NC)"
	pnpm run lint:fix

format: ## Format code
	@echo "$(GREEN)Formatting code...$(NC)"
	pnpm run format

format:check: ## Check code formatting
	@echo "$(GREEN)Checking code formatting...$(NC)"
	pnpm run format:check

typecheck: ## Run TypeScript type checking
	@echo "$(GREEN)Running type checking...$(NC)"
	pnpm run typecheck

# =================== DOCKER OPERATIONS ===================
docker:build: ## Build all Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	docker-compose build
	@echo "$(GREEN)Docker images built!$(NC)"

docker:build-dev: ## Build development Docker images
	@echo "$(GREEN)Building development Docker images...$(NC)"
	docker-compose -f docker-compose.dev.yml build
	@echo "$(GREEN)Development Docker images built!$(NC)"

docker:up: ## Start Docker containers
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Docker containers started!$(NC)"

docker:down: ## Stop Docker containers
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)Docker containers stopped!$(NC)"

docker:logs: ## View Docker logs
	@echo "$(GREEN)Viewing Docker logs...$(NC)"
	docker-compose logs -f

docker:clean: ## Clean Docker images and containers
	@echo "$(YELLOW)Cleaning Docker resources...$(NC)"
	docker system prune -f
	docker volume prune -f
	@echo "$(GREEN)Docker cleanup complete!$(NC)"

# =================== KUBERNETES OPERATIONS ===================
k8s:deploy: ## Deploy to Kubernetes
	@echo "$(GREEN)Deploying to Kubernetes...$(NC)"
	kubectl apply -f infrastructure/kubernetes/ --namespace=$(KUBECTL_NAMESPACE)
	@echo "$(GREEN)Kubernetes deployment complete!$(NC)"

k8s:status: ## Check Kubernetes deployment status
	@echo "$(GREEN)Checking Kubernetes status...$(NC)"
	kubectl get pods --namespace=$(KUBECTL_NAMESPACE)
	kubectl get services --namespace=$(KUBECTL_NAMESPACE)

k8s:logs: ## View Kubernetes logs
	@echo "$(GREEN)Viewing Kubernetes logs...$(NC)"
	kubectl logs -f deployment/api-gateway --namespace=$(KUBECTL_NAMESPACE)

k8s:rollback: ## Rollback Kubernetes deployment
	@echo "$(YELLOW)Rolling back Kubernetes deployment...$(NC)"
	kubectl rollout undo deployment/api-gateway --namespace=$(KUBECTL_NAMESPACE)
	@echo "$(GREEN)Rollback complete!$(NC)"

k8s:scale: ## Scale Kubernetes deployment
	@echo "$(GREEN)Scaling Kubernetes deployment...$(NC)"
	kubectl scale deployment/api-gateway --replicas=3 --namespace=$(KUBECTL_NAMESPACE)
	@echo "$(GREEN)Scaling complete!$(NC)"

# =================== HELM OPERATIONS ===================
helm:install: ## Install Helm chart
	@echo "$(GREEN)Installing Helm chart...$(NC)"
	helm upgrade --install $(HELM_RELEASE) infrastructure/helm/ --namespace=$(KUBECTL_NAMESPACE)
	@echo "$(GREEN)Helm chart installed!$(NC)"

helm:upgrade: ## Upgrade Helm chart
	@echo "$(GREEN)Upgrading Helm chart...$(NC)"
	helm upgrade $(HELM_RELEASE) infrastructure/helm/ --namespace=$(KUBECTL_NAMESPACE)
	@echo "$(GREEN)Helm chart upgraded!$(NC)"

helm:uninstall: ## Uninstall Helm chart
	@echo "$(YELLOW)Uninstalling Helm chart...$(NC)"
	helm uninstall $(HELM_RELEASE) --namespace=$(KUBECTL_NAMESPACE)
	@echo "$(GREEN)Helm chart uninstalled!$(NC)"

# =================== DATABASE OPERATIONS ===================
db:setup: ## Setup databases
	@echo "$(GREEN)Setting up databases...$(NC)"
	docker-compose up -d postgres redis mongodb
	sleep 10
	pnpm run db:migrate
	pnpm run db:seed
	@echo "$(GREEN)Database setup complete!$(NC)"

db:migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	pnpm run db:migrate
	@echo "$(GREEN)Database migrations complete!$(NC)"

db:seed: ## Seed database with test data
	@echo "$(GREEN)Seeding database...$(NC)"
	pnpm run db:seed
	@echo "$(GREEN)Database seeding complete!$(NC)"

db:reset: ## Reset database
	@echo "$(YELLOW)Resetting database...$(NC)"
	pnpm run db:reset
	@echo "$(GREEN)Database reset complete!$(NC)"

db:backup: ## Backup database
	@echo "$(GREEN)Backing up database...$(NC)"
	./scripts/database/backup_restore.sh backup
	@echo "$(GREEN)Database backup complete!$(NC)"

db:restore: ## Restore database
	@echo "$(GREEN)Restoring database...$(NC)"
	./scripts/database/backup_restore.sh restore
	@echo "$(GREEN)Database restore complete!$(NC)"

# =================== ENVIRONMENT MANAGEMENT ===================
env:setup: ## Setup environment files
	@echo "$(GREEN)Setting up environment files...$(NC)"
	@if [ ! -f .env ]; then cp .env.example .env; fi
	@if [ ! -f .env.local ]; then cp .env.example .env.local; fi
	@echo "$(GREEN)Environment files setup complete!$(NC)"

env:validate: ## Validate environment configuration
	@echo "$(GREEN)Validating environment configuration...$(NC)"
	pnpm run env:validate
	@echo "$(GREEN)Environment validation complete!$(NC)"

# =================== SECURITY ===================
security:scan: ## Run security scans
	@echo "$(GREEN)Running security scans...$(NC)"
	pnpm audit
	pnpm run security:scan
	@echo "$(GREEN)Security scan complete!$(NC)"

security:fix: ## Fix security vulnerabilities
	@echo "$(GREEN)Fixing security vulnerabilities...$(NC)"
	pnpm audit --fix
	@echo "$(GREEN)Security fixes applied!$(NC)"

# =================== DEPLOYMENT ===================
deploy:dev: ## Deploy to development environment
	@echo "$(GREEN)Deploying to development...$(NC)"
	@make build
	@make docker:build
	@make k8s:deploy
	@echo "$(GREEN)Development deployment complete!$(NC)"

deploy:staging: ## Deploy to staging environment
	@echo "$(GREEN)Deploying to staging...$(NC)"
	ENV=staging make build
	ENV=staging make docker:build
	ENV=staging make k8s:deploy
	@echo "$(GREEN)Staging deployment complete!$(NC)"

deploy:production: ## Deploy to production environment
	@echo "$(GREEN)Deploying to production...$(NC)"
	ENV=production make build
	ENV=production make docker:build
	ENV=production make k8s:deploy
	@echo "$(GREEN)Production deployment complete!$(NC)"

# =================== MONITORING ===================
monitor:logs: ## View application logs
	@echo "$(GREEN)Viewing application logs...$(NC)"
	kubectl logs -f -l app=datasphere-guilds --namespace=$(KUBECTL_NAMESPACE)

monitor:metrics: ## View application metrics
	@echo "$(GREEN)Viewing application metrics...$(NC)"
	kubectl port-forward service/grafana 3000:3000 --namespace=$(KUBECTL_NAMESPACE)

monitor:alerts: ## Check monitoring alerts
	@echo "$(GREEN)Checking monitoring alerts...$(NC)"
	kubectl get alerts --namespace=$(KUBECTL_NAMESPACE)

# =================== DOCUMENTATION ===================
docs:generate: ## Generate documentation
	@echo "$(GREEN)Generating documentation...$(NC)"
	pnpm run docs:generate
	@echo "$(GREEN)Documentation generated!$(NC)"

docs:serve: ## Serve documentation locally
	@echo "$(GREEN)Serving documentation...$(NC)"
	pnpm run docs:serve

docs:deploy: ## Deploy documentation
	@echo "$(GREEN)Deploying documentation...$(NC)"
	pnpm run docs:deploy
	@echo "$(GREEN)Documentation deployed!$(NC)"

# =================== UTILITIES ===================
check: ## Run all checks (lint, test, typecheck)
	@echo "$(GREEN)Running all checks...$(NC)"
	@make lint
	@make typecheck
	@make test
	@echo "$(GREEN)All checks passed!$(NC)"

release: ## Create a new release
	@echo "$(GREEN)Creating new release...$(NC)"
	pnpm run release
	@echo "$(GREEN)Release created!$(NC)"

update: ## Update all dependencies
	@echo "$(GREEN)Updating dependencies...$(NC)"
	pnpm update
	@echo "$(GREEN)Dependencies updated!$(NC)"

status: ## Show project status
	@echo "$(GREEN)Project Status:$(NC)"
	@echo "Node.js: $(shell node --version)"
	@echo "PNPM: $(shell pnpm --version)"
	@echo "Environment: $(ENV)"
	@echo "Docker: $(shell docker --version 2>/dev/null || echo 'Not installed')"
	@echo "Kubernetes: $(shell kubectl version --client --short 2>/dev/null || echo 'Not installed')"
	@echo "Helm: $(shell helm version --short 2>/dev/null || echo 'Not installed')"

# =================== ALIASES ===================
start: dev ## Alias for dev command
run: dev ## Alias for dev command
serve: dev ## Alias for dev command
ci: check ## Alias for check command
deploy: deploy:dev ## Alias for deploy:dev command 