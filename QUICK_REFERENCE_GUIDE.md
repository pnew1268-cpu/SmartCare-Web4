# MedRecord System - Quick API Reference & Commands

## 🚀 Quick Start

### Start Server
```bash
npm start
```

### Run All Tests
```bash
node test_all_requirements.js
```

### Run Individual Tests
```bash
node test_pharmacy_suggestions.js    # Requirement 1
node test_messaging.js               # Requirement 2  
node test_register_specialization.js # Specializations
node test_doc_bypass.js              # Doctor auto-approval
```

---

## 📋 API ENDPOINTS REFERENCE

### Authentication
```
POST   /api/login                    - Log in user
POST   /api/register                 - Register new user or doctor
GET    /api/users/profile            - Get user profile
PUT    /api/users/profile            - Update profile
GET    /api/config                   - Get system configuration
```

### Pharmacy Features
```
POST   /api/pharmacy/suggest         - Doctor suggests new pharmacy [DOCTOR]
GET    /api/pharmacy/my-suggestions  - Get doctor's suggestions [DOCTOR]
GET    /api/users/pharmacies/nearby  - Find nearby pharmacies by GPS
GET    /api/pharmacies               - Get all seeded pharmacies
```

### Messaging
```
POST   /api/messages                 - Send private message [AUTH]
GET    /api/messages/:partnerId      - Get conversation with partner [AUTH]
```

### Prescriptions
```
POST   /api/clinical/prescribe       - Write prescription (auto-fills doctor data) [DOCTOR]
GET    /api/clinical/prescriptions   - Get prescriptions [PATIENT/DOCTOR]
PUT    /api/clinical/prescriptions/:id - Update prescription [DOCTOR]
```

### Doctor Services
```
POST   /api/users/rate-doctor        - Rate a doctor 1-5 stars [PATIENT]
GET    /api/users/doctors/:id/rating - Get doctor's average rating
GET    /api/users/doctors            - List all doctors
GET    /api/users/specializations    - List doctor specializations
```

### Admin
```
GET    /api/admin/doctors            - List pending doctor verifications [ADMIN]
PUT    /api/admin/verify-doctor/:id  - Approve/reject doctor [ADMIN]
```

### Multi-Role
```
PUT    /api/users/profile            - Switch active role
  Body: { "activeRole": "doctor" or "patient" }
```

---

## 🧪 TEST ACCOUNTS

### Admin Account
- **ID/Email**: admin001
- **Password**: admin123

### Patient Account  
- **ID**: 12345678901234
- **Phone**: 01012345678
- **Password**: test123

### Doctor Account
- **Phone**: 01099999999
- **Password**: password123
- **Email**: testdoctor@example.com

---

## 🎯 FEATURE CHECKLIST

### ✅ REQUIREMENT 1: Doctor Pharmacy Suggestions
- Doctor logs in
- POST `/api/pharmacy/suggest` with pharmacy details
- GET `/api/pharmacy/my-suggestions` to view all suggestions
- Status: Pending until admin approval

### ✅ REQUIREMENT 2: Private Messaging  
- Patient/Doctor POST `/api/messages` with receiverId + content
- GET `/api/messages/:partnerId` to retrieve conversation
- Messages sorted chronologically
- Bidirectional messaging works

### ✅ REQUIREMENT 3: Arabic Language Support
- Click 🌍 icon in navbar to switch language
- Full RTL layout applied
- All text translated
- Selection saved in localStorage

### ✅ REQUIREMENT 4: Multi-Role System
- User profile shows `roles` array
- `activeRole` field indicates current role
- PUT `/api/users/profile` to switch roles
- Middleware checks `roles.includes(role)`

### ✅ REQUIREMENT 5: Prescription Auto-Fill
- Doctor writes prescription
- Auto-populated fields:
  - Doctor name
  - Doctor phone
  - Current date
- Patient sees complete prescription info

### ✅ REQUIREMENT 6: Nearby Pharmacies (GPS)
- Frontend: `navigator.geolocation.getCurrentPosition()`
- Backend: GET `/api/users/pharmacies/nearby?lat=X&lng=Y`
- Response: Pharmacies sorted by distance
- Uses Haversine formula

### ✅ REQUIREMENT 7: Doctor Rating System
- POST `/api/users/rate-doctor` with doctorId + rating (1-5)
- GET `/api/users/doctors/:id/rating` returns:
  - `averageRating` (calculated average)
  - `totalReviews` (count)
  - `ratings` array (all reviews)

### ✅ REQUIREMENT 8: Testing Mode
- Environment: `AUTO_APPROVE_DOCTORS=true`
- New doctors auto-approved immediately
- No verification pending state in development
- Production: Set to `false` for manual verification

---

## 📊 TEST RESULTS

```
╔════════════════════════════════════════════════════════════╗
║                    TEST SUMMARY                            ║
╠════════════════════════════════════════════════════════════╣
║ Total Tests:  16                                           ║
║ ✓ Passed:     16                                           ║
║ ✗ Failed:     0                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Test Breakdown
- [✓] Doctor pharmacy suggestions
- [✓] Private messaging (send, receive, thread)
- [✓] Arabic/RTL support
- [✓] Multi-role user system
- [✓] Prescription auto-fill
- [✓] Nearby pharmacies GPS
- [✓] Doctor rating submission
- [✓] Doctor rating retrieval
- [✓] Test mode auto-approval

---

## 💾 DATABASE MODELS

### PharmacySuggestion (NEW)
```javascript
{
  id,
  doctorId,
  name,
  address,
  city,
  phone,
  latitude,
  longitude,
  notes,
  status: ["pending", "approved", "rejected"],
  createdAt,
  updatedAt
}
```

### User (MODIFIED)
```javascript
{
  id,
  roles: ["doctor", "patient"],
  activeRole: "doctor" or "patient",
  // ... other fields
  specializationCode,
  verificationStatus
}
```

### Message
```javascript
{
  id,
  senderId,
  receiverId,
  content,
  date
}
```

### DoctorRating
```javascript
{
  id,
  doctorId,
  patientId,
  rating: 1-5,
  review: optional,
  date
}
```

### Prescription
```javascript
{
  id,
  patientId,
  doctorId,
  prescription_text,
  prescriptionDate,
  doctorName,
  doctorPhone,
  doctorSpecialization
}
```

---

## 🔐 Authorization Levels

### Public (No Auth Required)
- `/api` - API info
- `/api/config` - System configuration
- `/api/pharmacies` - Public pharmacy list

### Patient Only [AUTH]
- View messages
- Send messages
- Rate doctors
- View prescriptions
- Find nearby pharmacies

### Doctor Only [AUTH]
- Suggest pharmacies
- View suggestions
- Write prescriptions
- View patient messages
- Access doctor dashboard

### Admin Only [AUTH]
- Approve/reject doctor registrations
- View all pending doctors
- System administration

---

## 🌍 LANGUAGE SWITCHING

### Frontend Implementation
```javascript
app.i18n.switchLang()  // Toggle between 'en' and 'ar'
```

### Automatic Features
- Sets `dir="rtl"` on HTML
- Updates `lang="ar"` attribute
- Saves selection to localStorage
- Reapplies on page load
- Translates all `[data-i18n]` elements

### Supported Languages
- English (en)
- Arabic (ar)

---

## 📱 RESPONSIVE DESIGN

### Viewport Settings
- Mobile: 320px - 768px
- Tablet: 769px - 1024px  
- Desktop: 1025px+

### Features
- Hamburger menu on mobile
- Touch-friendly buttons (44x44px minimum)
- Full-width form layouts
- Responsive grid layouts
- No horizontal scrolling
- Patients can upload medical PDFs/images from their dashboard which are stored as records

---

## 🛠️ ENVIRONMENT VARIABLES

```bash
NODE_ENV=development              # development or production
DB_HOST=localhost                 # Database host
DB_USER=medapp                    # Database user
DB_PASSWORD=M!nA@2026#S3cure      # Database password
DB_NAME=medical_system            # Database name
AUTO_APPROVE_DOCTORS=true         # Auto-approve new doctors (dev only)
USE_FAKE_PHARMACIES=true          # Use seeded pharmacies
EXTERNAL_REGISTRATION_URL=        # External registration redirect
```

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: Port 3000 Already in Use
```bash
npx kill-port 3000
npm start
```

### Issue: MySQL Connection Failed
- Check MySQL service is running
- Verify credentials in .env
- Ensure database exists

### Issue: Tests Failing
```bash
# 1. Kill old server
npx kill-port 3000

# 2. Restart server
npm start

# 3. Wait 2 seconds
sleep 2

# 4. Run tests again
node test_all_requirements.js
```

### Issue: Arabic Not Showing
- Enable localStorage in browser
- Check browser console for errors
- Try incognito/private mode
- Refresh page after language switch

### Issue: GPS Pharmacies Empty
- Ensure fake pharmacies enabled: `USE_FAKE_PHARMACIES=true`
- Check server logs for queries
- Verify Haversine calculation

---

## 📝 MAKING A TEST REQUEST

### Example: Send Message
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "receiverId": "12345678901234",
    "content": "Hello!"
  }'
```

### Example: Rate Doctor
```bash
curl -X POST http://localhost:3000/api/users/rate-doctor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "doctorId": "31772318528301",
    "rating": 5,
    "review": "Excellent!"
  }'
```

### Example: Find Nearby Pharmacies
```bash
curl http://localhost:3000/api/users/pharmacies/nearby?lat=30.0444&lng=31.2357 \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📞 SUPPORT CONTACTS

For issues during presentation:
- Check console logs: `npm start` output
- Review test failures: `node test_all_requirements.js` output
- Check database: Ensure MySQL is running
- Verify credentials: Check .env file

---

## ✨ READY FOR PRESENTATION

All systems operational. Tests passing. Documentation complete.

System Status: **🟢 READY**

Last Updated: March 1, 2026
