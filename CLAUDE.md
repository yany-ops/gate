# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gate is a Kubernetes access proxy with OIDC authentication and RBAC management. It consists of:
- **Manager/Proxy**: Handles authentication, authorization, and RBAC configuration
- **Agent**: In-cluster component for executing Kubernetes API calls
- **CLI Client**: OIDC device flow authentication
- **Web UI**: React-based management interface

## Common Development Commands

### Backend Development
```bash
# Build all Go binaries
make build

# Run the proxy server
make run

# Build Docker images
make docker-build

# Deploy to Kubernetes
make k8s-manager  # Deploy manager
make k8s-proxy    # Deploy proxy
```

### Frontend Development
```bash
cd web

# Install dependencies (uses pnpm)
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```

### Testing
```bash
# Run Go tests
go test ./...

# Run Go tests with coverage
go test -cover ./...
```

## Architecture Overview

### Backend Structure
The Go backend follows a layered architecture:
- `cmd/` - Application entry points (manager and proxy)
- `internal/manager/` - Core business logic
  - `auth/` - OIDC authentication
  - `handlers/` - HTTP request handlers
  - `models/` - Database models (User, Group, Role, Permission, Cluster, AuditLog)
  - `db/` - Database initialization and migrations
- `internal/proxy/` - Proxy server implementation
- `internal/repository/` - Data access layer

### Frontend Structure
React application with Vite:
- `web/src/pages/` - Application pages (dashboard, clusters, RBAC)
- `web/src/components/` - Reusable UI components
- Uses React Router for navigation, Radix UI for components, TailwindCSS for styling

### Configuration
- `config.yaml` - Main application configuration (server, OIDC, database)
- `dex.yaml` - Dex OIDC provider configuration
- `docker-compose.yaml` - Local development environment

### Key Dependencies
- **Backend**: Chi router, Gorm ORM, k8s.io/client-go, go-oidc
- **Frontend**: React 19, Vite, TailwindCSS, Radix UI

## Development Workflow

1. **Local Environment**: Use `docker-compose up` to start PostgreSQL and Dex
2. **Backend**: Run `make run` to start the proxy server
3. **Frontend**: Run `pnpm dev` in the web directory
4. **Testing**: Write tests alongside implementations, run with `go test`

## Important Concepts

- **Multi-cluster Support**: Supports both EKS API and agent-based in-cluster access
- **RBAC Model**: Group-based role assignments with fine-grained permissions
- **Audit Logging**: All access is logged with optional S3 storage
- **Authentication Flow**: OIDC device flow for CLI, web-based flow for UI