# Videoflix – Containerized Fullstack Streaming Application
Videoflix is a containerized full-stack video streaming application inspired by Netflix. <br>
An Angular frontend communicates via REST API with a Django backend, <br>
both services are operated in isolation and reproducibly using Docker and Docker Compose. <br>
The application supports HLS video streaming, background video processing via RQ workers, Redis caching, and automated deployment via GitHub Actions.

## Table of contents
1. [Prerequisites](#prerequisites)
2. [Quickstart](#quickstart)
3. [Project Structure](#project-structure)
4. [Usage](#usage)
5. [Docker commands](#docker-commands)
6. [Logs](#logs)
7. [Author](#author)


## Prerequisites
Before running this project, ensure you have:

- **Docker** installed
- **Docker Compose** installed


## Quickstart
Clone the repository from GitHub
```bash
git clone git@github.com:EnsslinAdrian/Videoflix.git videoflix
```

Navigate to the folder
```bash
cd videoflix
```

Create a `.env` file using this command and fill in the variables:
```bash
cp .env.template .env
```

Generate a Django secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

> [!NOTE]
> Paste the generated key into `SECRET_KEY` in your `.env`.

Build the images:
```bash
docker compose build
```

Start the application:
```bash
docker compose up -d
```

Access the frontend:
```
http://<FRONTEND_VIRTUAL_HOST>
```

Access the backend API:
```
http://<BACKEND_VIRTUAL_HOST>/api/
```


## Project Structure
```
|-- 📁 .github
|  |-- 📁 workflows
|  |  |-- ❕ deployment.yml
|
|-- 📁 videoflix_backend
|  |-- 📁 auth_app
|  |-- 📁 movie_app
|  |-- 📁 videoflix_config
|  |-- 📄 .dockerignore
|  |-- 📄 .gitignore
|  |-- 📄 backend.entrypoint.sh
|  |-- 📄 Dockerfile
|  |-- 📄 manage.py
|  |-- 📄 requirements.txt
|
|-- 📁 videoflix_frontend
|  |-- 📁 nginx
|  |  |-- ⚙️ default.conf
|  |-- 📁 src
|  |-- 📄 .dockerignore
|  |-- 📄 .gitignore
|  |-- 📄 angular.json
|  |-- 📄 Dockerfile
|  |-- 📄 package.json
|  |-- 📄 tsconfig.json
|
|-- ⚙️ .env
|-- ⚙️ .env.template
|-- 📄 .gitignore
|-- 📄 docker-compose.yml
|-- ℹ️ README.md
```


## Usage
This project uses Docker Compose to orchestrate multiple services: frontend, backend, database, Redis cache, and an RQ background worker.

> The docker-compose.yml acts as the orchestrator of this application. It defines all services which share the same internal network.

→ [docker-compose.yml](./docker-compose.yml)
```yml
- frontend    # Angular app served via Nginx, built with API_URL injected at build time
- backend     # Django REST API served via Gunicorn on port 8000
- db          # PostgreSQL 16 database with healthcheck
- redis       # Redis 7 cache with password protection
- rq-worker   # Background worker for video processing tasks (ffmpeg / HLS conversion)
```

<br>

> The backend Dockerfile uses a two-stage build to separate dependency installation from the runtime image.

→ [Backend Dockerfile](./videoflix_backend/Dockerfile)
```yml
- builder stage    # Installs Python dependencies including gcc and libpq-dev
- runtime stage    # Copies installed packages into a slim Python 3.12 image
- ffmpeg           # Installed for server-side HLS video conversion
- expose           # Exposes port 8000 for the Gunicorn application
- entrypoint       # Starts the application via backend.entrypoint.sh
```

<br>

> The entrypoint script prepares and starts the backend at container startup.

→ [Entrypoint script](./videoflix_backend/backend.entrypoint.sh)
```yml
- migrations      # Applies all pending Django database migrations
- static files    # Collects static assets for production usage
- superuser setup # Creates an admin user from environment variables if not exists
- application run # Starts Django via Gunicorn with configurable workers and threads
```

<br>

> The frontend is built using a multi-stage Docker build and served via Nginx.

→ [Frontend Dockerfile](./videoflix_frontend/Dockerfile)
```yml
- build stage      # Compiles the Angular application using Node.js 22 Alpine
- config injection # Injects the backend API URL at build time via ARG/ENV
- runtime stage    # Copies compiled output into a minimal Nginx Alpine image
- nginx config     # Serves the SPA with try_files fallback for Angular routing
```

<br>

> The Nginx configuration serves the Angular SPA and handles client-side routing.

→ [Nginx configuration](./videoflix_frontend/nginx/default.conf)
```yml
- listen         # Serves the application on port 80
- try_files      # Falls back to index.html for Angular client-side routing
- server_tokens  # Hides Nginx version for security
```

<br>

> The GitHub Actions workflow automates building, publishing, and deploying the application on every push to main.

→ [GitHub Actions Workflow](./.github/workflows/deployment.yml)
```yml
- checkout        # Checks out the repository to access Dockerfiles and compose configuration
- registry login  # Authenticates to GitHub Container Registry (GHCR) using GITHUB_TOKEN
- frontend build  # Builds the Angular image with API_URL injected and pushes to GHCR
- backend build   # Builds the Django image and pushes to GHCR (latest + commit SHA tags)
- env provisioning# Creates and secures the .env file on the target VM via SSH
- compose sync    # Transfers docker-compose.yml to the remote server via SCP
- deployment      # Pulls updated images and recreates containers with Docker Compose
- cleanup         # Removes unused Docker images to keep the server clean
```


## Docker commands
Start project
```bash
docker compose up -d
```

Stop containers
```bash
docker compose down
```

Remove containers + volumes
```bash
docker compose down -v
```

Restart
```bash
docker compose restart
```

Rebuild images
```bash
docker compose build --no-cache
```

### Useful Docker commands
List running containers
```bash
docker ps
```

View container logs
```bash
docker compose logs -f <service>
```

Execute command inside container
```bash
docker compose exec <service> sh
```

Clear Redis cache
```bash
docker compose exec redis redis-cli -a <REDIS_PASSWORD> FLUSHDB
```


## Logs
View all service logs
```bash
docker compose logs -f
```

View backend logs only
```bash
docker compose logs -f backend
```

View RQ worker logs
```bash
docker compose logs -f rq-worker
```


## Author
**Adrian Enßlin**
