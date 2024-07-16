docker compose down
docker volume rm $(docker volume ls -q)  
docker compose up -d --build

sleep 3s

sh migrate.sh