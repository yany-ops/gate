FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY . .

RUN go build -o proxy cmd/proxy/*

FROM alpine:latest

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/proxy /usr/local/bin/proxy

ENTRYPOINT ["proxy"]
