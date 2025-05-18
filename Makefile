VERSION := 0.0.1

build:
	mkdir -p ./bin
	go build -o ./bin ./...

run:
	go run cmd/proxy.go

docker-build:
	docker build -t gate/manager:$(VERSION) -f ./docker/manager.Dockerfile .
	docker build -t gate/proxy:$(VERSION) -f ./docker/proxy.Dockerfile .

k8s-manager:
	kubectl delete deployment gate-manager
	kubectl apply -f manifests/manager.yaml

k8s-proxy:
	kubectl delete deployment gate-proxy
	kubectl apply -f manifests/proxy.yaml
