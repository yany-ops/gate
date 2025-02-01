# Variables
VERSION := $(shell git describe --tags --always --dirty)
REGISTRY := your-registry  # Replace with your registry

# Binary names
CLI_BIN := cli
PROXY_BIN := proxy
AGENT_BIN := agent

# Image names
PROXY_IMAGE := gate-proxy
AGENT_IMAGE := gate-agent

# Build binaries
.PHONY: build
build: build-cli build-proxy build-agent

.PHONY: build-cli
build-cli:
	go build -o bin/$(CLI_BIN) ./cmd/cli/*.go

.PHONY: build-proxy
build-proxy:
	go build -o bin/$(PROXY_BIN) ./cmd/proxy/*.go

.PHONY: build-agent
build-agent:
	go build -o bin/$(AGENT_BIN) ./cmd/agent/*.go

# Docker builds
.PHONY: docker
docker: docker-proxy docker-agent

.PHONY: docker-proxy
docker-proxy:
	docker build -t $(REGISTRY)/$(PROXY_IMAGE):$(VERSION) -f Dockerfile.proxy .
	docker tag $(REGISTRY)/$(PROXY_IMAGE):$(VERSION) $(REGISTRY)/$(PROXY_IMAGE):latest

.PHONY: docker-agent
docker-agent:
	docker build -t $(REGISTRY)/$(AGENT_IMAGE):$(VERSION) -f Dockerfile.agent .
	docker tag $(REGISTRY)/$(AGENT_IMAGE):$(VERSION) $(REGISTRY)/$(AGENT_IMAGE):latest

# Push images
.PHONY: push
push: push-proxy push-agent

.PHONY: push-proxy
push-proxy:
	docker push $(REGISTRY)/$(PROXY_IMAGE):$(VERSION)
	docker push $(REGISTRY)/$(PROXY_IMAGE):latest

.PHONY: push-agent
push-agent:
	docker push $(REGISTRY)/$(AGENT_IMAGE):$(VERSION)
	docker push $(REGISTRY)/$(AGENT_IMAGE):latest

# Development
.PHONY: run-proxy
run-proxy:
	go run ./cmd/proxy/*.go

.PHONY: run-agent
run-agent:
	go run ./cmd/agent/*.go

.PHONY: test
test:
	go test -v ./...

# Clean
.PHONY: clean
clean:
	rm -rf bin/
	docker rmi $(REGISTRY)/$(PROXY_IMAGE):$(VERSION) || true
	docker rmi $(REGISTRY)/$(AGENT_IMAGE):$(VERSION) || true
	docker rmi $(REGISTRY)/$(PROXY_IMAGE):latest || true
	docker rmi $(REGISTRY)/$(AGENT_IMAGE):latest || true

.PHONY: install-cli
install-cli: build-cli
	cp bin/$(CLI_BIN) /usr/local/bin/$(CLI_BIN)
