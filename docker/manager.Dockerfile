FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY . .

RUN go build -o manager cmd/manager/*

FROM alpine:latest

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/manager /usr/local/bin/manager

ENTRYPOINT ["manager"]
