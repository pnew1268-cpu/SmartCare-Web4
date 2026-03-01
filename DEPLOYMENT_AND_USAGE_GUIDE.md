# DEPLOYMENT & USAGE GUIDE

## System Overview

This is a comprehensive medical records management system with family member support. The system includes:
- User registration with comprehensive validation
- User authentication with JWT tokens
- Family member management (add, edit, delete, view)
- Input validation at frontend and backend
- Egyptian-specific validation rules
- Medical information tracking (allergies, conditions, medications)

---

## Quick Start

### 1. Installation

```bash
# Navigate to project directory
cd your-project-path

# Install dependencies
npm install
```

### 2. Start the Server

Before launching, review environment variables -- a sample `.env.example` is
present with descriptions.  Key configuration options include:

- `JWT_SECRET` – secret used for signing JWT tokens (must be set in prod).
- `PHARMACY_API_URL` – base URL of an external pharmacy service (optional).
- `AUTO_APPROVE_DOCTORS` – when `true` all doctor accounts are marked
  `approved`; useful during development.  **Disable before production.**
- `USE_FAKE_PHARMACIES` – seeds dummy pharmacy records when development
  environment; ignored in production.
- `EXTERNAL_REGISTRATION_URL` – if provided, unauthenticated visitors will be
  redirected here instead of seeing the local login page.

```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Access the Application

Open your browser and go to: `http://localhost:3000`

You should see the registration/login page.

---

## User Registration

### Required Fields:

1. **National ID** (ID)
   - 14 numeric digits
   - Must start with 2 or 3
   - Example: `30001015555555`

2. **Full Name**
   - Letters, spaces, hyphens, apostrophes only
   - No numbers or special characters
   - Minimum 2 characters
   - Example: `Ahmed Hassan` or `Mary-Jane O'Brien`

3. **Phone Number**
   - Egyptian format only
   - Must start with 01X (where X is 0-2)
   - Total 11 digits
   - Example: `01001234567` or `01101234567`

4. **Email** (optional but must be valid if provided)
   - Standard email format
   - Example: `user@example.com`

5. **Password**
   - Minimum 8 characters
   - Must contain at least one letter
   - Must contain at least one number
   - Example: `Password123` or `SecurePass2024`

6. **Age**
   - Number between 1 and 150
   - Required for medical records
   - Example: `35`

7. **Date of Birth** (alternative to age)
   - Must be in the past
   - Not more than 150 years old
   - Example: `1989-03-15`

8. **Gender**
   - Select: Male, Female, or Other

9. **City**
   - Text field for city name
   - Example: `Cairo` or `Alexandria`

10. **Governorate**
    - Select from 27 valid Egyptian governorates
    - Examples: Cairo, Alexandria, Giza, Qalyubia, etc.

### Registration Example:

```
National ID: 30001015555555
Full Name: Ahmed Hassan
Phone: 01001234567
Email: ahmed@example.com
Password: SecurePass123
Age: 35
Gender: Male
City: Cairo
Governorate: Cairo
```

---

## User Login

### Login Fields:

1. **Login ID**
   - Either your National ID or Phone Number
   - Example: `30001015555555` or `01001234567`

2. **Password**
   - The password you set during registration
   - Example: `SecurePass123`

### Login Example:

```
Login ID: 01001234567
Password: SecurePass123
```

---

## Family Member Management

### Adding a Family Member

1. Go to **Settings** → **Manage Family Members**
2. Click **Add Family Member**
3. Fill in the form:
   - **Full Name**: Required (letters, spaces, hyphens only)
   - **Age or Date of Birth**: At least one required
   - **Gender**: Select male, female, or other
   - **Relationship**: Select from dropdown
   - **Blood Type**: Optional
   - **Allergies**: Optional (comma-separated)
   - **Medical Conditions**: Optional (comma-separated)
4. Click **Save**

### Valid Relationships:

- Spouse
- Son
- Daughter
- Parent
- Sibling
- Dependent
- Other

### Add Family Member Example:

```
Full Name: Ahmed Hassan
Age: 12
Gender: Male
Relationship: Son
Blood Type: O+
Allergies: Peanuts, Shellfish
Medical Conditions: Asthma
```

### Viewing Family Members

1. Go to **Settings** → **Manage Family Members**
2. See list of all family members
3. Each member shows: Name, Age, Gender, Relationship

### Editing Family Member

1. Click **Edit** button next to family member
2. Update any information
3. Click **Save**

### Deleting Family Member

1. Click **Delete** button next to family member
2. Confirm deletion
3. Family member removed from system

---

## Input Validation Rules

### National ID
- **Rule**: Exactly 14 numeric digits, starts with 2 or 3
- **Valid**: `23456789012345`, `30001014158923`
- **Invalid**: `1234567890123` (only 13 digits), `13456789012345` (starts with 1)

### Phone Number
- **Rule**: Egyptian format, 11 digits starting with 01X
- **Valid**: `01001234567`, `01101234567`, `01201234567`
- **Invalid**: `02001234567` (starts with 02), `0100123456` (10 digits)

### Email
- **Rule**: Standard email format
- **Valid**: `user@example.com`, `test@domain.co.uk`
- **Invalid**: `invalidemail`, `user@`, `@example.com`

### Full Name
- **Rule**: Letters, spaces, hyphens, apostrophes only
- **Valid**: `Ahmed Hassan`, `Mary-Jane`, `O'Brien`
- **Invalid**: `Ahmed123`, `User@Name`, `Name!`

### Password
- **Rule**: 8+ characters, with letter and number
- **Valid**: `SecurePass123`, `Password2024`, `Test@123`
- **Invalid**: `Password` (no number), `12345678` (no letter), `Test1` (less than 8 chars)

### Age
- **Rule**: Integer between 1 and 150
- **Valid**: `25`, `5`, `100`
- **Invalid**: `0`, `151`, `25.5`

### Gender
- **Rule**: Select male, female, or other
- **Valid**: `male`, `female`, `other`
- **Invalid**: `man`, `woman`, `unknown`

### Governorate
- **Valid**: Cairo, Alexandria, Giza, Qalyubia, Monufia, Beheira, Kafr El-Sheikh, Dakahlia, Damietta, Port Said, Ismailia, Suez, North Sinai, South Sinai, Red Sea, New Valley, Matrouh, Aswan, Luxor, Sohag, Qena, Assiut, Minya, Beni Suef, Faiyum, Giza, 6th of October

---

## API Reference

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "id": "30001015555555",
  "name": "Ahmed Hassan",
  "phone": "01001234567",
  "email": "ahmed@example.com",
  "password": "SecurePass123",
  "age": 35,
  "gender": "male",
  "city": "Cairo",
  "governorate": "Cairo"
}

Response: 201 Created
{
  "msg": "User registered successfully. You can now login.",
  "phone": "01001234567"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "loginId": "01001234567",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Ahmed Hassan",
    "id": "user-id",
    "roles": ["user"],
    "activeRole": "user"
  }
}
```

### Family Members

#### Get All Family Members
```
GET /api/family
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "family-id",
    "fullName": "Ahmed Hassan",
    "age": 12,
    "gender": "male",
    "relationship": "son",
    "bloodType": "O+",
    "allergies": ["Peanuts"],
    "chronicConditions": ["Asthma"]
  }
]
```

#### Get Specific Family Member
```
GET /api/family/:familyMemberId
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "family-id",
  "fullName": "Ahmed Hassan",
  "age": 12,
  "gender": "male",
  "relationship": "son",
  "bloodType": "O+",
  "allergies": ["Peanuts"],
  "chronicConditions": ["Asthma"],
  "createdAt": "2024-02-27T10:00:00Z"
}
```

#### Create Family Member
```
POST /api/family
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Ahmed Hassan",
  "age": 12,
  "gender": "male",
  "relationship": "son",
  "bloodType": "O+",
  "allergies": ["Peanuts"],
  "chronicConditions": ["Asthma"]
}

Response: 201 Created
{
  "msg": "Family member added successfully",
  "familyMember": { ... }
}
```

#### Update Family Member
```
PUT /api/family/:familyMemberId
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Ahmed Hassan",
  "age": 13,
  "gender": "male",
  "relationship": "son",
  "bloodType": "O+",
  "allergies": ["Peanuts", "Shellfish"],
  "chronicConditions": ["Asthma", "Allergic Rhinitis"]
}

Response: 200 OK
{
  "msg": "Family member updated successfully",
  "familyMember": { ... }
}
```

#### Delete Family Member
```
DELETE /api/family/:familyMemberId
Authorization: Bearer <token>

Response: 200 OK
{
  "msg": "Family member deleted successfully"
}
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request - Validation Failed
```json
{
  "msg": "National ID must be exactly 14 numeric digits"
}
```

#### 400 Bad Request - Duplicate Data
```json
{
  "msg": "Phone number already registered"
}
```

#### 401 Unauthorized - Missing Token
```json
{
  "msg": "No token, authorization denied"
}
```

#### 401 Unauthorized - Invalid Token
```json
{
  "msg": "Token is not valid"
}
```

#### 404 Not Found
```json
{
  "msg": "Family member not found"
}
```

#### 500 Server Error
```json
{
  "msg": "Server error"
}
```

---

## Troubleshooting

### Registration Issues

**Problem**: "National ID must be exactly 14 numeric digits"
- **Solution**: Check that your National ID is exactly 14 digits and starts with 2 or 3

**Problem**: "Phone number already registered"
- **Solution**: This phone number is already associated with another account. Use a different phone number.

**Problem**: "Password must contain at least one number"
- **Solution**: Add at least one number (0-9) to your password

### Login Issues

**Problem**: "Please provide login ID and password"
- **Solution**: Enter both your login ID (phone or national ID) and password

**Problem**: "Invalid credentials"
- **Solution**: Check that your login ID and password are correct

### Family Member Issues

**Problem**: "No token, authorization denied"
- **Solution**: You need to login first to manage family members
- **Recovery**: Refresh the page and login again

**Problem**: "Family member not found"
- **Solution**: The family member may have been deleted. Refresh the page.

---

## Features

### ✅ Implemented
- User registration with comprehensive validation
- User authentication with JWT tokens
- Family member management (add, edit, delete, view)
- Dual validation system (frontend + backend)
- Egyptian-specific validation rules
- Allergies tracking
- Medical conditions tracking
- Blood type information
- Age/Date of birth support
- Gender support
- Relationship tracking
- Medical notes support
- Secure password hashing
- Session management

### 🔄 Planned for Future
- Medical history records
- Appointment scheduling
- Prescription management
- Medical report uploads
- Notification system
- Mobile app integration
- Analytics dashboard
- Multi-language support

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review validation rules for your input
3. Check that all required fields are filled
4. Ensure the server is running
5. Try refreshing the browser

---

## Version Information

- **System Version**: 1.0
- **Status**: Production Ready
- **Last Updated**: 2024
- **Node.js Version**: 14.0 or higher
- **Database**: SQLite (via Sequelize)

---

## License & Credits

This system has been developed with comprehensive input validation and security features.

---

*For deployment support, please ensure all requirements are met before going live.*
