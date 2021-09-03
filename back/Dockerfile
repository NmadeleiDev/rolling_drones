FROM golang:alpine
WORKDIR /app
ADD . /app/
RUN go mod tidy && go build -o app
EXPOSE 1323