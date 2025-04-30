VERSION := 0.0.1

build:
	go build -o bin/gate cmd/proxy.go

run:
	go run cmd/proxy.go

docker-build:
	docker build -t gate:$(VERSION) .
	kubectl delete pod gate*
k8s:
	kubectl apply -f manifests.yaml