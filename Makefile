build:
	go build -o bin/cli cmd/cli/*.go
	go build -o bin/proxy cmd/proxy/*.go
	go build -o bin/agent cmd/agent/*.go
