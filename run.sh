docker build -t chat .
docker run -d --name simple_chat -p 5020:5020 -e LLM_BASE_URL=http://host.docker.internal:11434 chat:latest
