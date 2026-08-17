# Fullstack API — Experiment 2.1.1 + 2.1.2 (combined)

A single Spring Boot project merging:

- **2.1.1** — RESTful CRUD API design: layered architecture (Controller → Service →
  Repository), Bean Validation, standardized `ApiResponse` envelope, CORS.
- **2.1.2** — Global exception handling (`@ControllerAdvice`), a logging filter,
  and correlation-ID request tracing via MDC.

## Project layout

```
src/main/java/com/example/fullstack/
 ├── FullstackApiApplication.java
 ├── config/CorsConfig.java              # 2.1.1 CORS
 ├── controller/PostController.java      # 2.1.1 CRUD endpoints
 ├── service/PostService.java
 ├── service/impl/PostServiceImpl.java
 ├── repository/PostRepository.java
 ├── entity/Post.java
 ├── dto/PostRequestDTO.java             # 2.1.1 Bean Validation
 ├── dto/PostResponseDTO.java
 ├── dto/ApiResponse.java                # 2.1.1 standardized response envelope
 ├── filter/CorrelationIdFilter.java     # 2.1.2 correlation ID + request logging
 └── exception/
     ├── ResourceNotFoundException.java
     ├── BusinessRuleException.java
     ├── ErrorResponse.java
     └── GlobalExceptionHandler.java     # 2.1.2 @ControllerAdvice
src/main/resources/
 ├── application.properties              # H2 in-memory DB
 └── logback-spring.xml                  # logs include %X{correlationId}
```

## Run it

Requires JDK 17+ and Maven (or use your IDE's built-in Maven support).

```bash
mvn spring-boot:run
```

The app starts on `http://localhost:8080`. An H2 console is available at
`http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:postsdb`, user `sa`,
empty password).

## Endpoints

| Method | URL              | Body               | Description        |
|--------|------------------|--------------------|---------------------|
| POST   | /api/posts       | PostRequestDTO     | Create a post       |
| GET    | /api/posts       | —                  | List all posts      |
| GET    | /api/posts/{id}  | —                  | Get one post        |
| PUT    | /api/posts/{id}  | PostRequestDTO     | Update a post        |
| DELETE | /api/posts/{id}  | —                  | Delete a post        |

`PostRequestDTO`:
```json
{
  "title": "Launch announcement",
  "content": "We are live!",
  "author": "Kannvi Rani",
  "scheduledAt": "2026-09-01T09:00:00"
}
```
`scheduledAt` is optional; if provided it must be a future date-time.

## Standardized response shape

Success:
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": { "id": 1, "title": "...", "...": "..." },
  "correlationId": "b6b1...-uuid",
  "timestamp": "2026-08-17T10:15:00"
}
```

Validation error (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["title: Title must not be blank"],
  "correlationId": "b6b1...-uuid",
  "timestamp": "2026-08-17T10:15:00"
}
```

Not found (404) and business-rule conflicts (409) follow the same envelope.

## Correlation ID / tracing (2.1.2)

- `CorrelationIdFilter` runs on every request. It reads `X-Correlation-Id` from
  the incoming request header if present, otherwise generates a UUID.
- The ID is put into MDC (`correlationId`) so **every log line for that
  request** — controller, service, exception handler — includes it
  automatically (see `logback-spring.xml`'s `%X{correlationId}`).
- The same ID is echoed back in the `X-Correlation-Id` response header and in
  every `ApiResponse.correlationId` field, so a client can match a response to
  its exact log trail.

## Testing with Postman / curl

```bash
# Create
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World","author":"Kannvi"}'

# Trigger a validation error
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"","content":"","author":""}'

# Trigger a not-found error
curl http://localhost:8080/api/posts/999

# Pass your own correlation ID and see it echoed back
curl -H "X-Correlation-Id: my-trace-123" http://localhost:8080/api/posts
```
