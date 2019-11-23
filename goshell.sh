#!/usr/bin/bash

WORKROOT=$(pwd)
cd ${WORKROOT}

# unzip go environment
apt-get install build-essential
go_env="go1.11.2.linux-amd64.tar.gz"
wget -c https://storage.googleapis.com/golang/go1.11.2.linux-amd64.tar.gz
tar -zxf $go_env
if [ $? -ne 0 ];
then
    echo "fail in extract go"
    exit 1
fi
echo "OK for extract go"
rm -rf $go_env

# prepare PATH, GOROOT and GOPATH
export PATH=$(pwd)/go/bin:$PATH
export GOROOT=$(pwd)/go
export GOPATH=$(pwd)
go get -v -u github.com/gorilla/mux
export PATH=$PATH:$GOPATH/bin
go get go.mongodb.org/mongo-driver
export PATH=$PATH:$GOPATH/bin
go get github.com/stretchr/testify/assert
export PATH=$PATH:$GOPATH/bin
# build
cd NoteShare/Backend/User/server
go build
echo "go is running"
./server &
cd tests
go test user_test.go
if [ $? -ne 0 ];
then
    echo "fail to go build"
    exit 1
fi
echo "OK for go build"
