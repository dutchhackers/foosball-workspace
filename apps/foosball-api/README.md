# foosball-api

This (foosball-api) is the default REST API for Foosball.

## Run locally

..

## Deploy to GCP

### Step 1: build docker image

nx run foosball-api:dockerize

### Step 2: push docker image

nx run foosball-api:docker-push --projectId <gcp-project-id>

### Step 3: deploy Cloud Run service

In GCP, deploy (or create) Cloud Run service
