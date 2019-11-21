FROM golang:latest 
RUN apt-get update
RUN apt-get install -y npm
RUN go get github.com/tools/godep
EXPOSE 8080
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 
ENV GOPATH /app
RUN cd /app ;
CMD ["./server"]
