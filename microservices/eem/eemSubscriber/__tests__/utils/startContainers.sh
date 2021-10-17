check_docker_execution() {
    if [ $? -ne 0 ];
    then
        echo "\033[0;31mFailed to start $1 container\033[0m"
        "$(dirname "$0")"/stopContainers.sh
        exit 1
    fi
}
docker run --rm -d --name redis-code-pattern-test -p 6379:6379 redis:6.2
check_docker_execution REDIS
# docker run --rm -d -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 --name mysql-code-pattern-test mysql:5.6
# check_docker_execution MYSQL

# wait for redis to start
echo -n "Waiting for redis to start"
while [ "`docker logs redis-code-pattern-test | tail -n 1 | grep "Ready to accept connections" | wc -l`" != "1" ];
do
    echo -n "."
    sleep 2;
done
echo ""
echo "redis container is ready"

# # wait for mysql to start
# echo -n "Waiting for mysql to start"
# while [ "`docker logs mysql-code-pattern-test 2>&1 | grep "socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)" | wc -l`" != "1" ];
# do
# echo -n "."
# sleep 2;
# done
# echo ""
# echo "mysql container is ready"

