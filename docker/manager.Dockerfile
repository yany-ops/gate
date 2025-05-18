FROM golang:1.24-alpine AS go-builder

WORKDIR /app

COPY . .

RUN go build -o manager cmd/manager/*

FROM node:22-slim AS node-builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable

COPY web/package.json web/pnpm-lock.yaml ./

RUN pnpm install

COPY web/ ./

RUN pnpm run build

FROM alpine:latest AS final

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY --from=go-builder /app/manager /usr/local/bin/manager
COPY --from=node-builder /app/dist /app/web/dist
COPY config.yaml /app/config.yaml

EXPOSE 8080

ENTRYPOINT ["manager"]
