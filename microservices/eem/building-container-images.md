# Build your own container images

You will need a Docker Hub account and the Docker client installed in your environment.

1. Build the container images

```
export DOCKER_HUB_USERNAME=PLACE_YOUR_DOCKERHUB_USERNAME_HERE

docker build -t $DOCKER_HUB_USERNAME/eem-subscriber:1.0 eemSubscriber
docker build -t $DOCKER_HUB_USERNAME/example-restaurant-pos:1.0 exampleNotificationReceiver
```

2. Push the container images to Docker Hub

```
docker push $DOCKER_HUB_USERNAME/eem-subscriber:1.0
docker push $DOCKER_HUB_USERNAME/example-restaurant-pos:1.0
```

3. Modify the yaml files to use your own images

These are the container images respective yaml files in the deployments folder in this github repo. Modify the values for their container images spec (`image: TARGET_CONTAINER_IMAGE`)

> Note: remember to replace `<replace-with-your-dockerhub-user>`

* eem-subscriber.yaml - `<replace-with-your-dockerhub-user>/eem-subscriber:1.0`
* example-restaurant-pos.yaml - `<replace-with-your-dockerhub-user>/example-restaurant-pos:1.0`

You can now prodeed back to the [README.md](README.md#5-Deploy-the-microservices)
