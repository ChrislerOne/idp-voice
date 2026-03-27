# IDP Voice

A feature recommendation and voting platform for IDP teams. Submit ideas, vote on what matters, and surface the features your team needs most.

## Stack

- **Backend**: Java 25, Spring Boot, JPA (SQLite for dev, PostgreSQL for prod)
- **Frontend**: Angular 21, standalone components, SCSS
- **Tooling**: [mise-en-place](https://mise.jdx.dev) for Java, Maven, and Node version management
- **Deployment**: Helm chart with Dockerfiles for Kubernetes

## Prerequisites

- [mise](https://mise.jdx.dev) installed
- For production: PostgreSQL, Docker, Kubernetes + Helm

## Getting Started

```bash
# Install tools (Java 21, Maven, Node 22)
mise install

# Start backend and frontend
mise run dev
```

Backend runs on `http://localhost:8080`, frontend on `http://localhost:4200`.

## Mise Tasks

| Task | Description |
|------|-------------|
| `mise run dev` | Start backend and frontend together |
| `mise run backend` | Start Spring Boot backend only |
| `mise run frontend` | Start Angular dev server only |
| `mise run seed` | Generate random mock recommendations (backend must be running) |
| `mise run reset-db` | Delete all recommendations from the SQLite database |

## Deployment

### Docker

```bash
# Build images
docker build -t idp-voice-backend ./idp-voice-backend
docker build -t idp-voice-frontend ./idp-voice-frontend
```

### Helm

```bash
helm install idp-voice ./helm/idp-voice \
  --set postgresql.host=my-postgres \
  --set backend.image.repository=my-registry/idp-voice-backend \
  --set frontend.image.repository=my-registry/idp-voice-frontend \
  --set ingress.enabled=true \
  --set ingress.host=idp-voice.mycompany.com
```

The chart creates backend and frontend Deployments, ClusterIP Services, and an optional Ingress. PostgreSQL password can be provided via `existingSecret` for production use.

> **Note:** `ingress.host` must match the hostname your users actually access — the ingress rule only matches requests with that exact `Host` header. If using a cloud provider's auto-assigned hostname (e.g. Civo), set `ingress.host` to that hostname and omit `ingress.clusterIssuer` (TLS cert issuance requires a real domain with DNS control). For production, point a custom domain at the load balancer IP and set `ingress.clusterIssuer=zerossl`.
