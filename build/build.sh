# UNCOMMITTED=$(git status --porcelain)
# if [ -n "$UNCOMMITTED" ]; then
echo 'start git phase';
#     echo "uncommitted changes found"
#     exit 1
# fi
# UPSTREAM=${1:-'@{u}'}
# LOCAL=$(git rev-parse @)
# REMOTE=$(git rev-parse "$UPSTREAM")
# BASE=$(git merge-base @ "$UPSTREAM")

# if [ $LOCAL = $REMOTE ]; then
#     echo "Up-to-date"
#     exit 1
# elif [ $LOCAL = $BASE ]; then
#     echo "Need to pull"
#     exit 1
# elif [ $REMOTE = $BASE ]; then
#     echo "Need to push"
#     exit 1
# else
#     echo "Diverged"
# fi
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "current branch is: $BRANCH"

COMMIT_SHORT_HASH=$(git rev-parse --short HEAD)
echo "current commit short hash is: $COMMIT_SHORT_HASH"

TIMESTAMP=$(date -u +%Y-%m-%d-%T)
echo "timestamp: $TIMESTAMP"

CODE_VERSION_TAG="$BRANCH-$COMMIT_SHORT_HASH"
echo "CODE_VERSION_TAG will be $CODE_VERSION_TAG"

echo 'end of git phase';

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

echo 'end of ci';