# Backend Stack

> **⚠️ Partly superseded.** Runtime data access is Supabase REST, not Prisma. See [[Data Access Layer]].

## Framework

Next.js Route Handlers.

## Architecture Style

Monolithic application with a single deployment.

## Responsibilities

* Data retrieval.
* Lead creation.
* Consultation handling.
* Admin operations.
* Analytics event collection.

## API Structure

Base path:

`/api/v1`

Modules:

* brands.
* products.
* collections.
* inspirations.
* showroom.
* consultations.
* leads.
* events.
* admin.

## Forbidden Architecture

* No microservices.
* No separate backend services.
* No Redis.
* No Kafka.
* No Elasticsearch.
* No complex event systems.

## Linked Notes

* [[API Overview]]
* [[Security Auth Rules]]
* [[Forbidden Patterns]]

## Source Trace

Source files: `10-techincal-architecture.md`, `12-dontdo.md`.
