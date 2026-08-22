# Performance SEO Security

> **ℹ️ Implemented.** See [[Security Posture]] for the shipped headers/CSP/RLS and [[SEO And Metadata]] for the completed on-site SEO pass.

## Performance Targets

* Homepage load: under 2 seconds.
* Lighthouse: 90+.
* Mobile is the primary optimization target.

## Performance Requirements

* Optimize images.
* Optimize rendering.
* Optimize queries.
* Prefer simple solutions.
* Use Cloudinary transformations.
* Use Next.js Image.

## SEO Requirements

Support:

* Metadata API.
* Open Graph.
* Structured Data.
* Sitemap.
* Robots.txt.
* Canonical URLs.

Every page should support SEO metadata and Open Graph metadata.

## Security Requirements

* Input validation.
* Rate limiting.
* Admin authentication.
* Environment variable protection.
* CSRF protection.

## Error Handling

APIs should return structured JSON responses.

Frontend should provide:

* Graceful fallback states.
* Loading states.
* Error boundaries.

## Linked Notes

* [[API - Error Format]]
* [[Security Auth Rules]]
* [[Image Strategy]]
* [[Mobile Experience]]

## Source Trace

Source files: `10-techincal-architecture.md`, `11-rules.md`, `12-dontdo.md`.
