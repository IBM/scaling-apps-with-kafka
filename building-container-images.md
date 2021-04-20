# Build your own container images

You will need a Docker Hub account and the Docker client installed in your environment.

1. Build the container images

```
export DOCKER_HUB_USERNAME=PLACE_YOUR_DOCKERHUB_USERNAME_HERE

docker build -t $DOCKER_HUB_USERNAME/example-food-frontend:1.0 microservices/frontend
docker build -t $DOCKER_HUB_USERNAME/apiservice:1.0 microservices/apiservice
docker build -t $DOCKER_HUB_USERNAME/statusservice:1.0 microservices/statusservice
docker build -t $DOCKER_HUB_USERNAME/courierconsumer:1.0 microservices/consumers/courierconsumer
docker build -t $DOCKER_HUB_USERNAME/kitchenconsumer:1.0 microservices/consumers/kitchenconsumer
docker build -t $DOCKER_HUB_USERNAME/orderconsumer:1.0 microservices/consumers/orderconsumer
docker build -t $DOCKER_HUB_USERNAME/realtimedata:1.0 microservices/realtimedata
docker build -t $DOCKER_HUB_USERNAME/poddata:1.0 microservices/statusservice
```

2. Push the container images to Docker Hub

```
docker push $DOCKER_HUB_USERNAME/example-food-frontend:1.0
docker push $DOCKER_HUB_USERNAME/apiservice:1.0
docker push $DOCKER_HUB_USERNAME/statusservice:1.0
docker push $DOCKER_HUB_USERNAME/courierconsumer:1.0
docker push $DOCKER_HUB_USERNAME/kitchenconsumer:1.0
docker push $DOCKER_HUB_USERNAME/orderconsumer:1.0
docker push $DOCKER_HUB_USERNAME/realtimedata:1.0
docker push $DOCKER_HUB_USERNAME/poddata:1.0
```

3. Modify the yaml files to use your own images

These are the container images respective yaml files in the deployments folder in this github repo. Modify the values for their container images spec (`image: TARGET_CONTAINER_IMAGE`)

> Note: remember to replace `<replace-with-your-dockerhub-user>`

* apiservice.yaml - `<replace-with-your-dockerhub-user>/apiservice:1.0`
* courierconsumer.yaml - `<replace-with-your-dockerhub-user>/courierconsumer:1.0`
* frontend.yaml - `<replace-with-your-dockerhub-user>/example-food-frontend:1.0`
* kitchenconsumer.yaml - `<replace-with-your-dockerhub-user>/kitchenconsumer:1.0`
* orderconsumer.yaml - `<replace-with-your-dockerhub-user>/orderconsumer:1.0`
* podconsumer.yaml - `<replace-with-your-dockerhub-user>/podconsumer:1.0`
* realtimedata.yaml - `<replace-with-your-dockerhub-user>/realtimedata:1.0`
* statusservice.yaml - `<replace-with-your-dockerhub-user>/statusservice:1.0`

You can now prodeed back to the main [README.md](README.md#3-Deploy-the-microservices)