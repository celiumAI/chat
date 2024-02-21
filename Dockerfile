# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5020 available to the world outside this container
EXPOSE 5020

# Use an environment variable for the LLM_BASE_URL
ENV HOST=0.0.0.0 PORT=5020 LLM_BASE_URL=http://host.docker.internal:11434

# Run app.py when the container launches
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5020"]

