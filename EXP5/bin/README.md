# OmniPost Composer — Backend

Spring Boot REST API for "Write once, publish anywhere" — covers **Experiment 2.1.1**
(REST CRUD, validation, standardized responses, CORS) and **Experiment 2.1.2**
(global exception handling, correlation-ID logging, filters).

## Tech
Java 17 · Spring Boot 3.3 · Spring Data JPA · H2 (in-memory) · Bean Validation

## Project layout
```
com.omnipost.composer
├── config/       CorsConfig, CorrelationIdFilter (OncePerRequestFilter + MDC)
├── controller/   PostController (CRUD + scheduling)
├── dto/          PostRequest, PostResponse, ApiResponse<T>, ErrorResponse
├── exception/    GlobalExceptionHandler (@RestControllerAdvice), custom exceptions
├── model/        Post entity, Platform enum (word limits), PostStatus enum
├── repository/   PostRepository (Spring Data JPA)
└── service/      PostService + impl (business logic, word-limit validation)
```

## Run it
```bash
mvn spring-boot:run
```
API base URL: `http://localhost:8080/api/posts`
H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:omnipostdb`)

Change the allowed frontend origin in `application.properties`:
```
app.cors.allowed-origin=http://localhost:5173
```

## Endpoints

| Method | Path                     | Description                     |
|--------|--------------------------|----------------------------------|
| POST   | /api/posts               | Create a post                   |
| GET    | /api/posts               | List all posts                  |
| GET    | /api/posts/{id}          | Get a post by id                |
| PUT    | /api/posts/{id}          | Update a post                   |
| DELETE | /api/posts/{id}          | Delete a post                   |
| PUT    | /api/posts/{id}/schedule | Schedule a post                 |
| GET    | /api/posts/platforms     | List platforms + their word limits |

## Sample requests (curl / Postman)

**Create a post**
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{"platform":"TWITTER","content":"Launching OmniPost Composer today!"}'
```

**Success response shape**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": 1,
    "platform": "TWITTER",
    "content": "Launching OmniPost Composer today!",
    "wordCount": 5,
    "wordLimit": 50,
    "status": "DRAFT",
    "scheduledAt": null,
    "createdAt": "2026-09-25T10:00:00",
    "updatedAt": "2026-09-25T10:00:00"
  },
  "timestamp": "2026-09-25T10:00:00"
}
```

**Validation error (e.g. blank content, or word count over the platform limit)**
```json
{
  "success": false,
  "message": "Validation failed",
  "status": 400,
  "path": "/api/posts",
  "correlationId": "7c2b1e2a-...-9f1a",
  "details": ["content: Content must not be blank"],
  "timestamp": "2026-09-25T10:00:00"
}
```

**404 example**
```bash
curl http://localhost:8080/api/posts/999
```
Returns `404` with the same standardized `ErrorResponse` shape, including the
request's `correlationId` — grep the server logs for that same ID to see the
full request lifecycle (`CorrelationIdFilter` logs entry + exit, timing, and
status; `GlobalExceptionHandler` logs the failure) under one trace.

## Notes on design choices
- **Word limit validation** lives in the service layer (`PostServiceImpl`) rather
  than as a Bean Validation annotation, because the limit depends on the chosen
  `platform` field of the same object — a cross-field rule, thrown as a custom
  `WordLimitExceededException` and caught centrally.
- **CorrelationIdFilter** reuses an incoming `X-Correlation-Id` header if the
  client sends one (useful for tracing across microservices), otherwise
  generates a UUID. It's put into MDC so `logback-spring.xml`'s pattern prints
  it on every log line for that request, and echoed back as a response header.
- **GlobalExceptionHandler** returns the same `correlationId` in the JSON error
  body, so a frontend can show it to a user for support, and a developer can
  grep server logs for that exact string to reconstruct the entire request.
