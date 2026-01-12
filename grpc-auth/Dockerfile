FROM golang:1.25.5 AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod tidy

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/auth ./cmd/api

FROM alpine:3.18.12

WORKDIR /app

COPY --from=build /app/auth ./auth
COPY --from=build /app/config.yml .
COPY --from=build /app/jwt.key .

ENTRYPOINT ["./auth"]
