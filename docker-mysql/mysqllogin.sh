IP=$(docker inspect --format '{{ index .NetworkSettings.Networks "mysql-network" "IPAddress"}}' dgendillmysql-c)
USER=$1
mysql -u$1 -h"$IP" -P"3306" -p