# ---- Build Stage ----
FROM golang:1.23-alpine AS builder

# Set working directory
WORKDIR /app

# Copy Go modules and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy all source files
COPY . .

# Build binary (all files in current module)
RUN go build -o server .

# ---- Runtime Stage ----
FROM alpine:3.20

# Set working directory
WORKDIR /app

# Add CA certificates (needed for HTTPS if your app uses it)
RUN apk add --no-cache ca-certificates

# Copy the binary from the builder
COPY --from=builder /app/server .

# Expose backend port
EXPOSE 8080

# Run the binary
CMD ["./server"]
