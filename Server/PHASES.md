````
# 🚀 BrowseSight Server - Phased Development Plan

Build the server incrementally, test each phase, and document progress.

---

### 🔄 **Phase 5: Rate Limiting & Security**

**Goal**: Add production-ready security

**Files to modify**:

- `server.js` - Add rate limiting, helmet, better error handling

**What you'll build**:

- Rate limiting (100 req/15min)
- Security headers (helmet)
- Better error responses
- Request logging

**Testing**:

```bash
# Make 101 requests rapidly
# 101st request should be rate limited
````

**Success criteria**: ✅ Rate limiting works, secure headers
