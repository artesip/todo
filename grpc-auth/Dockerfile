FROM golang:latest AS build

WORKDIR /app

COPY go.mod .
COPY go.sum .

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/auth ./cmd/api

FROM alpine:latest

WORKDIR /app

COPY --from=build /app/auth ./auth
COPY --from=build /app/config.yml .
COPY --from=build /app/jwt.key .

ENTRYPOINT ["./auth"]
