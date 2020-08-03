echo 'start docker phase';
filename="Dockerfile";
filepath="./src/SampleNetCoreWebApp"
registry="registry.iherbugc.com"
repository="ugc"
tag=$registry/$repository:$CODE_VERSION_TAG;

echo "docker build -f $filepath/$filename -t $tag ./src"

docker build -f $filepath/$filename -t $tag ./src
docker push $tag
echo 'end of docker phase';