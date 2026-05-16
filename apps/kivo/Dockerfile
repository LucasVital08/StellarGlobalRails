FROM golang:1.25-bookworm AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY cmd ./cmd
COPY internal ./internal

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /kivo-api ./cmd/api

FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /
COPY --from=builder /kivo-api /kivo-api

EXPOSE 8080

USER nonroot:nonroot
CMD ["/kivo-api"]
