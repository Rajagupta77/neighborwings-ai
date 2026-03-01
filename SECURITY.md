# 🔒 SECURITY.md — Security Prompting Playbook

> Every security measure in this project, written as reusable prompts and checklists.  
> Copy these into any project to harden it in one pass.

---

## Why This Document Exists

Security is often an afterthought — bolted on after the first breach scare. This document captures the **exact prompts** used to harden this app so you (or anyone) can apply the same checks to future projects systematically.

Every section follows this structure:
1. **The Risk** — what can go wrong
2. **The Prompt** — what you tell the AI to fix it
3. **The Pattern** — how it was implemented in this codebase

---

## 1. Generic Error Messages

### The Risk
Detailed error messages leak database schema, column names, query structure, and stack traces to attackers. A message like `"column 'password_hash' does not exist"` tells them your table structure.

### The Prompt
> "Make sure ALL edge functions return generic error messages to the client. Log the real error server-side with `console.error`. Never expose stack traces, database errors, column names, or query details to the frontend."

### The Pattern
```typescript
// ❌ BAD — leaks internals
catch (err) {
  return new Response(JSON.stringify({ error: err.message }), { status: 500 });
}

// ✅ GOOD — generic to client, detailed to server
catch (err) {
  const error = err as Error;
  console.error("admin-auth error:", error.message);
  return new Response(
    JSON.stringify({ error: "An internal error occurred" }),
    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
```

---

## 2. CORS Headers

### The Risk
Missing or incomplete CORS headers cause edge functions to silently fail from browser clients. Missing headers on error responses mean errors are swallowed — the frontend gets a CORS error instead of the actual error.

### The Prompt
> "Add CORS headers to ALL edge functions. Include the full `Access-Control-Allow-Headers` list with Supabase-specific headers. Handle OPTIONS preflight. Include CORS headers on EVERY response — including errors."

---

## 3. Email Enumeration Prevention

### The Risk
If your login/magic-link endpoint returns different responses for "email exists" vs "email not found", attackers can probe your user database to build a list of valid emails.

### The Prompt
> "When sending magic links or OTPs, return `{ success: true }` even if the email doesn't exist in the system. Don't reveal whether an email is registered."

---

## 4. Input Validation (Server-Side)

### The Risk
Client-side validation can be bypassed with curl or Postman. Every input must be validated server-side before touching the database.

### The Prompt
> "Validate ALL inputs server-side in every edge function: UUID format for IDs, email format and length, OTP format (4 digits only). Reject anything that doesn't match before querying the database."

---

## 5. Rate Limiting

### The Risk
Without rate limiting, attackers can brute-force OTPs, spam your email-sending endpoint (costing money), or DDoS your functions.

### The Prompt
> "Add rate limiting to the magic link / OTP sending. Don't let a user request a new code more than once every 2 minutes. For bulk operations, add delays between individual sends to prevent overwhelming downstream services."

---

## 6. Token & Session Expiry

### The Risk
Tokens that never expire mean a leaked token grants permanent access. Stale sessions accumulate as attack surface.

### The Prompt
> "Set expiry times on all tokens: OTPs expire after 10 minutes, admin sessions after 7 days, user cookies after 30 days. Check expiry server-side — never trust client-side clocks."

---

## 7. Password Hashing

### The Risk
Plaintext or weakly hashed passwords mean a database breach exposes all admin credentials.

### The Prompt
> "Hash admin passwords with PBKDF2 using 100,000 iterations, SHA-256, and a random 16-byte salt. Store as `salt:hash` format. Never store plaintext passwords."

---

## 8. API Key Protection

### The Risk
Exposed API keys allow unauthorized access to admin functions, data sync, and bulk operations.

### The Prompt
> "Protect all admin and sync endpoints with API keys. Never expose the service role key to the client."

---

## 9. Session Token Management (Resilient Validation)

### The Risk
Aggressive token clearing on network errors causes users to get logged out during temporary connectivity issues.

### The Prompt
> "Only clear the admin session token when the server explicitly returns `valid: false`. On network errors or transient failures, keep the token — report invalid for this check but don't destroy the session."

---

## 10. Client-Side Error Handling

### The Risk
Showing raw database errors to users leaks schema information. Showing "email already exists" confirms account existence.

### The Prompt
> "Show generic error messages to users. Handle duplicate email errors (Postgres code 23505) gracefully without revealing that the email is already registered. Never show raw error objects in the UI."

---

## 11. One-Time Token Use

### The Risk
If OTP tokens aren't cleared after validation, they can be replayed — the same code grants access multiple times.

### The Prompt
> "After a successful OTP validation, immediately set the token to null in the database. Each token should work exactly once."

---

## 12. Credential Stuffing Defense

### The Risk
If "wrong email" and "wrong password" return different error messages, attackers can first enumerate valid emails, then brute-force passwords.

### The Prompt
> "Return the exact same error message — 'Invalid credentials' — for both wrong email AND wrong password on admin login. Make the responses identical (same status code, same message, same timing)."

---

## 13. Service Role Key Isolation

### The Risk
The service role key bypasses all RLS policies. If it leaks to the client, anyone can read/write/delete all data.

### The Prompt
> "Never use the service role key in client-side code. Only use it in edge functions. The client should only ever have the anon/publishable key."

---

## 14. Row Level Security (RLS)

### The Risk
Without RLS, anyone with the anon key can read/write any row in any table. RLS is your last line of defense.

### The Prompt
> "Enable RLS on all tables. Public-facing tables should allow read-only access for everyone. User-specific tables should restrict access to the owning user. Admin tables should block all direct access."

---

## 15. No Debug Logs in Production

### The Risk
`console.log` statements in production edge functions can leak sensitive data (tokens, passwords, user data) to log aggregation services.

### The Prompt
> "Remove ALL `console.log` debug statements from production edge functions. Only keep `console.error` for actual errors. Never log tokens, passwords, email addresses, or user data."
