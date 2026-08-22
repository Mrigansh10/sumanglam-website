# Consultation Booking

> **⚠️ History worth knowing.** This flow was **broken in production and had never worked** until 2026-07-06. See [[Trap - No DB Defaults On Insert]].

## Trigger

User clicks Book Consultation from any page.

## User Steps

1. User clicks Book Consultation.
2. Consultation form opens.
3. User enters name, phone, optional email, project type, and requirements.
4. User submits form.
5. User sees success screen.
6. User receives confirmation.

## System Steps

1. Pre-fill or capture source context.
2. Validate input.
3. Create or update [[Lead]].
4. Create [[Consultation Request]].
5. Store source page, source type, referring URL, and timestamp.
6. Trigger admin notification.
7. Track Consultation Started and Consultation Submitted.

## Success Condition

Lead and consultation request exist, user receives success confirmation, and admin is notified.

## Failure/Edge Cases

* Invalid phone.
* Missing required fields.
* Duplicate lead.
* Database error.
* Notification failure.
* Spam submission.

## Pages Involved

[[Book Consultation]], [[Homepage]], [[Inspiration]], [[Brands]], [[Product Detail]], [[Showroom Experience]], [[Architects And Designers]]

## Data Involved

[[Lead]], [[Consultation Request]]

## API/backend Involved

[[API - Consultations]], [[API - Analytics Events]], [[API - Admin Leads]]

## Validation Rules

Name and phone are required. Email is optional in docs. Project type and requirements are required by the flow. Server-side validation is mandatory.

## Forbidden Mistakes

* Do not create forms without validation.
* Do not trust client-side validation alone.
* Do not lose lead source tracking.
* Do not require user accounts.

## Source Trace

Source files and sections: `07-screen-event-flows.md` Flow 4, `08-database-design.md`, `09-api-specification.md`, `12-dontdo.md`.
