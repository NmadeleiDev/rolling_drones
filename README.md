# Rolling Drones Repo

[[_TOC_]]

## Structure

Folers for parts of the project. Each part has its own Dockerfile inside. All parts connected with one docker-compose in the root of the project.

> _All Dockerfiles must have EXPOSE <PORT> to be visible with traefik._

### ML

Folder for ML Part.

### Back

Folder for backend business logic

### Front

Folder for frontend part

### DB

Folder for DB part

## TODO

- [X] Check Traefik on localhost.
- [ ] Make Dockerfiles for each part of the project.
