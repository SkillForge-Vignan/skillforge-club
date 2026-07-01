# ✅ Developer Checklist & Quick Reference

## 🚀 Getting Started (First Time)

- [ ] Extract the project
- [ ] Navigate to backend folder: `cd SkillForge/backend`
- [ ] Install dependencies: `npm install`
- [ ] Copy env file: `cp .env.example .env`
- [ ] Edit `.env` with your credentials
- [ ] Start server: `npm start` or `npm run dev`
- [ ] Open Swagger: http://localhost:5000/api-docs
- [ ] Test health: http://localhost:5000/api/health

---

## 📚 Documentation Quick Links

- **Need API reference?** → Read: `API_GUIDE.md`
- **Need validation rules?** → Read: `VALIDATION_RULES.md`
- **Need overview?** → Read: `COMPLETION_SUMMARY.md`
- **Need tech details?** → Read: `ENHANCEMENTS.md`
- **Need roadmap?** → Read: `README_ENHANCED.md`
- **Need full report?** → Read: `FINAL_REPORT.md`

---

## 🔧 Common Tasks

### Task: Call Auth Endpoint
**Steps:**
1. Open Swagger UI: http://localhost:5000/api-docs
2. Expand "Auth" section
3. Click on endpoint (e.g., "POST /auth/register")
4. Click "Try it out"
5. Fill in example values
6. Click "Execute"

**Or with cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

---

### Task: Fix Validation Error
**Steps:**
1. Check error response
2. Find field name in error message
3. Open `VALIDATION_RULES.md`
4. Search for field name in table
5. Check required format
6. Fix request and retry

**Example:**
```json
Error: "Password must be at least 8 characters"
Solution: Use password with 8+ chars, uppercase, lowercase, number
```

---

### Task: Create New Endpoint
**Steps:**
1. Add validation to `middleware/validation.js`:
   ```javascript
   export const validateMyEndpoint = [
     body('field1').notEmpty().withMessage('Required'),
     body('field2').isEmail().withMessage('Invalid email'),
     handleValidationErrors,
   ];
   ```

2. Update route file `routes/myroute.js`:
   ```javascript
   import { validateMyEndpoint } from "../middleware/validation.js";
   router.post("/", validateMyEndpoint, myController);
   ```

3. Add Swagger docs (JSDoc):
   ```javascript
   /**
    * @swagger
    * /my-endpoint:
    *   post:
    *     summary: My endpoint description
    *     tags: [MyTag]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema: { ... }
    *     responses:
    *       201:
    *         description: Created
    */
   ```

4. Add test to `auth-validation.test.js`

5. Update `VALIDATION_RULES.md`

---

### Task: Add Field to Existing Endpoint
**Steps:**
1. Update validation schema
2. Update controller to handle new field
3. Update Swagger docs
4. Update `VALIDATION_RULES.md`
5. Test in Swagger UI

---

### Task: Debug Test Failure
**Steps:**
```bash
# 1. Run tests with details
npm test -- --verbose

# 2. Run specific test file
npm test setup.test.js

# 3. Run in watch mode
npm run test:watch

# 4. Check test output for failure reason
# 5. Fix issue in code
# 6. Tests auto-rerun in watch mode
```

---

### Task: Deploy to Production
**Steps:**
1. Check all environment variables in `.env`
2. Change `NODE_ENV=production`
3. Run tests: `npm test`
4. Verify no console.log statements
5. Build: Not needed (Node.js), just run
6. Start: `npm start`
7. Test endpoints with production URLs
8. Setup monitoring

---

## 🧪 Testing Cheatsheet

```bash
# Run all tests once
npm test

# Run in watch mode (auto-rerun on file change)
npm run test:watch

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test setup.test.js

# Run specific test
npm test -- -t "Health Check"

# Run with verbose output
npm test -- --verbose

# Run without coverage (faster)
npm test -- --no-coverage
```

---

## 📝 npm Scripts

```bash
npm start              # Start server (production)
npm run dev           # Start with nodemon (development)
npm test              # Run all tests
npm run test:watch   # Run tests in watch mode
npm run seed          # Seed database with demo data
```

---

## 🔐 Security Reminders

- [ ] **Never commit .env file** (already in .gitignore)
- [ ] **Change JWT_SECRET** before production
- [ ] **Validate all inputs** using middleware
- [ ] **Sanitize all outputs** (done automatically)
- [ ] **Use HTTPS in production** (configure reverse proxy)
- [ ] **Set secure cookies** (if using sessions)
- [ ] **Rate limiting enabled** (default: 100/15min)
- [ ] **Error details hidden** in production (check NODE_ENV)

---

## 📋 Code Review Checklist

When reviewing code:

- [ ] Validation added to all inputs
- [ ] Swagger docs included (JSDoc)
- [ ] Test cases added
- [ ] Error handling implemented
- [ ] No sensitive data logged
- [ ] No hardcoded credentials
- [ ] No SQL queries (use Supabase)
- [ ] Performance considered
- [ ] Documentation updated

---

## 🐛 Common Issues & Solutions

### Issue: Module not found
**Solution:**
```bash
npm install              # Reinstall dependencies
rm package-lock.json    # Remove lock file
npm install             # Clean install
```

### Issue: Port 5000 already in use
**Solution:**
```bash
# Change port in .env
PORT=5001

# Or kill process using port 5000
# (On Mac/Linux): lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill
```

### Issue: CORS error
**Solution:**
- Check server.js has CORS middleware
- Verify origin in .env
- Check request headers match requirements

### Issue: JWT token expired
**Solution:**
- Tokens expire after 7 days
- Users need to login again
- Implement refresh token flow (code ready in auth.js)

### Issue: Validation error on valid data
**Solution:**
1. Check error message
2. Compare format with VALIDATION_RULES.md
3. Check field type and length
4. Test in Swagger UI first

---

## 🔍 Debug Mode

### Enable detailed logging
```javascript
// In middleware/auth.js
console.log("🔐 Auth Debug:", { token, decoded });

// In controllers
console.log("📝 Data received:", req.body);
```

### Check request in Swagger UI
1. Open http://localhost:5000/api-docs
2. Click on endpoint
3. Click "Try it out"
4. Enter values
5. Click "Execute"
6. Check response details

### View network requests
```bash
# In browser DevTools (F12):
1. Open Network tab
2. Make request
3. Click on request
4. View Headers, Preview, Response
```

---

## 📊 Endpoint Status Quick Reference

### Auth (8 endpoints)
- POST /auth/send-otp ✅
- POST /auth/verify-otp ✅
- POST /auth/register ✅
- POST /auth/login ✅
- GET /auth/me ✅
- PUT /auth/me ✅
- POST /auth/onboarding ✅
- GET /auth/users (admin) ✅

### Events (6 endpoints)
- GET /events ✅
- GET /events/categories ✅
- GET /events/{id} ✅
- POST /events ✅
- PUT /events/{id} ✅
- DELETE /events/{id} ✅

### Projects (5 endpoints)
- GET /projects ✅
- GET /projects/{id} ✅
- POST /projects ✅
- PUT /projects/{id} ✅
- DELETE /projects/{id} ✅

### Other Modules: See API_GUIDE.md

---

## 🎯 Development Workflow

### Daily Development
```bash
1. npm run dev              # Start with hot reload
2. Make changes to code
3. Swagger UI auto-refreshes
4. Test in http://localhost:5000/api-docs
5. Run tests: npm run test:watch
6. Commit when happy
```

### Before Pushing Code
```bash
1. npm test                 # Verify all tests pass
2. Fix any validation errors
3. Check documentation is updated
4. Verify no console.log in production code
5. Check error handling
6. Test in Swagger UI
7. Commit and push
```

### Preparing for Production
```bash
1. NODE_ENV=development → NODE_ENV=production
2. JWT_SECRET → Strong random secret
3. npm test               # Final test run
4. Review security checklist
5. Setup monitoring
6. npm start              # Start server
7. Test production endpoints
```

---

## 📚 File Quick Links

| File | Purpose | When to Edit |
|------|---------|--------------|
| middleware/validation.js | Validation schemas | Adding validation |
| server.js | Main server | Changing middleware |
| package.json | Dependencies | Adding packages |
| .env | Environment | Configuration |
| routes/*.js | API routes | Adding endpoints |
| API_GUIDE.md | API docs | Updated endpoints |

---

## 🚨 Critical Files (Don't Edit Carelessly)

- [ ] **server.js** - Main server config
- [ ] **.env** - Sensitive credentials
- [ ] **package.json** - Dependencies
- [ ] **middleware/auth.js** - Security
- [ ] **middleware/validation.js** - Input validation

---

## ✨ Best Practices

### ✅ DO:
- Use validation middleware for all inputs
- Add Swagger docs (JSDoc) to routes
- Write tests for new features
- Use meaningful error messages
- Check VALIDATION_RULES.md before validation
- Log errors but not sensitive data
- Use environment variables for config

### ❌ DON'T:
- Hardcode credentials
- Skip validation
- Commit .env file
- Use unvalidated user input
- Log passwords or tokens
- Remove security headers
- Change default rate limits without reason

---

## 📞 When Stuck

1. **Check documentation first:**
   - API_GUIDE.md (for endpoints)
   - VALIDATION_RULES.md (for formats)
   - ENHANCEMENTS.md (for features)

2. **Use Swagger UI:** http://localhost:5000/api-docs
   - Interactive testing
   - Request/response schemas
   - Try-it-out feature

3. **Check test files:**
   - setup.test.js
   - auth-validation.test.js
   - Show working examples

4. **Review error message:**
   - Validation errors are descriptive
   - Check exact field name
   - Compare with VALIDATION_RULES.md

5. **Run tests in watch mode:**
   - `npm run test:watch`
   - Get instant feedback

---

## 🎓 Learning Path

### For API Consumers
1. Swagger UI (http://localhost:5000/api-docs)
2. API_GUIDE.md (examples)
3. VALIDATION_RULES.md (formats)
4. Try endpoints in Swagger

### For Backend Developers
1. COMPLETION_SUMMARY.md (overview)
2. ENHANCEMENTS.md (technical)
3. middleware/validation.js (code)
4. routes/auth.js (example)
5. Test files (patterns)

### For DevOps/Deployment
1. FINAL_REPORT.md (checklist)
2. API_GUIDE.md (env variables)
3. COMPLETION_SUMMARY.md (security)
4. .env.example (what's needed)

---

## ✅ Daily Checklist

Start of day:
- [ ] Pull latest code: `git pull`
- [ ] Install deps: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Check tests pass: `npm test`

During day:
- [ ] Make changes
- [ ] Test in Swagger UI
- [ ] Watch mode tests: `npm run test:watch`
- [ ] Update docs

End of day:
- [ ] All tests pass
- [ ] No console errors
- [ ] Docs updated
- [ ] Commit code: `git commit`

---

**Last Updated:** January 15, 2024
**Version:** 1.0
**Status:** Active Development Ready ✅
