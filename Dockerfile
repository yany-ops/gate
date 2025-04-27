FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY . .

RUN go build -o gate cmd/proxy.go

FROM alpine:latest

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/gate /usr/local/bin/gate

ENTRYPOINT ["gate"]
