include .env

.DEFAULT_GOAL=up

build: ## build all containers (docker compose)
	docker-compose build

up: ## build & start the project (docker-compose)
	docker-compose up --build -d

up-i: ## build & start the project (docker-compose)
	docker-compose up --build

down: ## stop the project (docker-compose)
	docker-compose down
