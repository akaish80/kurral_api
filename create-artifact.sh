#!/usr/bin/env bash

# Defaults
CREATE_PACKAGE=0
DIRECTORY="artifacts"
DIST="dist"
VERSION=$BUILD_NUMBER
BUILDNO=1
ARTIFACTORY_REPO_NAME="kurral-api"

if ( ! getopts ":s:" opt); then
	echo "option -s service-name required";
	exit $E_OPTERROR;
fi

while getopts ":ps:d:v:b:" opt; do
  case $opt in
    p)
      CREATE_PACKAGE=1 >&2
      ;;
    s)
      SERVICE=$OPTARG >&2
      ;;
    d)
      DIRECTORY=$OPTARG >&2
      ;;
    v)
      VERSION=$OPTARG >&2
      ;;
    b)
      BUILDNO=$OPTARG >&2
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

# Artifact
HASH=$(git rev-parse --short HEAD)
DATE=`date +%Y%m%d`
TAR_NAME="$SERVICE-$VERSION.$DATE.$BUILDNO-$HASH.tar.gz"

# Build
# docker run -v $(pwd):/src -w /src --entrypoint /bin/sh nmo-app-serverless-deploy:latest /bin/bash -c "\
if [ -d "$DIRECTORY" ]; then rm -rf $DIRECTORY/* ; fi
if [ -d "$DIST" ]; then rm -rf $DIST/* ; fi

mkdir $DIRECTORY
mkdir $DIST

unzip .serverless/kurral-api.zip -d $DIRECTORY/
cp serverless.yml $DIRECTORY/
cp serverless.dev.yml $DIRECTORY/
echo $DIRECTORY/

tar -C $DIRECTORY -czvf $DIST/$TAR_NAME ./

