const app = {
    user: null,
    lang: 'en',
    currentView: 'dashboard',  // Track current view for UI state
    currentPatient: null,
    currentFamilyMemberId: null, // For family member editing

    
    // ════════════════════════════════════════════════════════════════
    // CLIENT-SIDE VALIDATION UTILITIES
    // ════════════════════════════════════════════════════════════════
    validators: {
        nationalId(value) {
            if (!value) return { valid: false, message: 'National ID is required' };
            const cleaned = String(value).trim().replace(/\s/g, '');
            if (!/^\d{14}$/.test(cleaned)) {
                return { valid: false, message: 'National ID must be exactly 14 numeric digits' };
            }
            if (!/^[23]\d{13}$/.test(cleaned)) {
                return { valid: false, message: 'National ID must start with 2 or 3' };
            }
            return { valid: true, value: cleaned };
        },

        phoneNumber(value) {
            if (!value) return { valid: false, message: 'Phone number is required' };
            const cleaned = String(value).trim().replace(/\s/g, '');
            if (!/^01[0125]\d{8}$/.test(cleaned)) {
                return { valid: false, message: 'Phone must be 11 digits (e.g., 01012345678)' };
            }
            return { valid: true, value: cleaned };
        },

        email(value) {
            if (!value) return { valid: false, message: 'Email is required' };
            const trimmed = String(value).trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                return { valid: false, message: 'Invalid email format' };
            }
            return { valid: true, value: trimmed };
        },

        name(value, fieldName = 'Name') {
            if (!value) return { valid: false, message: `${fieldName} is required` };
            const trimmed = String(value).trim();
            const cleaned = trimmed.replace(/\s+/g, ' ');
            if (cleaned.length < 2 || cleaned.length > 100) {
                return { valid: false, message: `${fieldName} must be 2-100 characters` };
            }
            if (!/^[a-zA-Z\s\-']{2,100}$/i.test(cleaned)) {
                return { valid: false, message: `${fieldName} must contain only letters, spaces, hyphens, and apostrophes` };
            }
            return { valid: true, value: cleaned };
        },

        password(value) {
            if (!value) return { valid: false, message: 'Password is required' };
            if (value.length < 8) {
                return { valid: false, message: 'Password must be at least 8 characters' };
            }
            if (!/[a-zA-Z]/.test(value)) {
                return { valid: false, message: 'Password must contain at least one letter' };
            }
            if (!/\d/.test(value)) {
                return { valid: false, message: 'Password must contain at least one number' };
            }
            return { valid: true };
        },

        age(value) {
            if (value === '' || value === null || value === undefined) {
                return { valid: false, message: 'Age is required' };
            }
            const age = parseInt(value);
            if (isNaN(age) || age < 1 || age > 150) {
                return { valid: false, message: 'Age must be between 1 and 150' };
            }
            return { valid: true, value: age };
        },

        dateOfBirth(value) {
            if (!value) return { valid: false, message: 'Date of birth is required' };
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return { valid: false, message: 'Invalid date format' };
            }
            if (date > new Date()) {
                return { valid: false, message: 'Date must be in the past' };
            }
            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() - 150);
            if (date < maxDate) {
                return { valid: false, message: 'Invalid date of birth' };
            }
            return { valid: true, value: date.toISOString().split('T')[0] };
        },

        gender(value) {
            const validGenders = ['', 'male', 'female', 'other'];
            if (!validGenders.includes(String(value).toLowerCase())) {
                return { valid: false, message: 'Invalid gender selection' };
            }
            return { valid: true, value: String(value).toLowerCase() };
        },

        governorate(value) {
            const validGovs = [
                "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum",
                "Gharbia", "Ismailia", "Menofia", "Minya", "Qalyubia", "New Valley", "Suez",
                "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", "South Sinai",
                "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
            ];
            if (!validGovs.includes(value)) {
                return { valid: false, message: 'Invalid governorate' };
            }
            return { valid: true, value };
        }
    },
    

    translations: {
        en: {
            lang_name: "Arabic", login_title: "Welcome Back", national_id: "National ID",
            login_id_label: "Phone Number or National ID",
            password: "Password", login_btn: "Login", no_account: "Don't have an account?",
            register_link: "Register here", register_title: "Create Account", role: "Role",
            role_patient: "Patient", role_doctor: "Doctor", full_name: "Full Name",
            phone: "Phone Number", email: "Email", register_btn: "Register",
            has_account: "Already have an account?", login_link: "Login here",
            nav_dashboard: "Dashboard", my_profile: "My Profile",
            nav_patients: "Patients", search_btn: "Search", search_patient_placeholder: "Enter Patient National ID...",
            search_doc_placeholder: "Enter Doctor Name...",
            select_doc_msg: "Select a doctor to message...",
            personal_info: "Personal Information", edit: "Edit", save: "Save", cancel: "Cancel",
            my_prescriptions: "My Prescriptions", doctor_welcome: "Welcome, Doctor",
            doctor_instruct: "Use the search bar above to find a patient by their National ID.",
            prescribe_new: "Write Prescription", medications: "Medications", notes: "Doctor's Notes",
            send_prescription: "Send Prescription", no_prescriptions: "No prescriptions found.",
            prescribed_by: "Prescribed by Dr. ", patient_workspace: "Patient Workspace",
            prescriptions_upload: "Upload Medical File",
            upload_sync_btn: "Upload & Sync",
            get_directions: "Get Directions",
            patient_status: "Medical Status",
            back_to_search: "Back to Search",
            approve: "Approve", reject: "Reject", apply_doctor: "Apply for Doctor Role", license_label: "Upload License/Cert (PDF/Image)",
            status_active_verified: "Account Active & Verified",
            records_synced_msg: "Your medical records are synchronized and up to date.",
            medical_file_label: "Medical File (PDF or Image)",
            no_medical_records: "No medical records found",
            no_history: "No history.",
            switch_role: "Switch to", status_pending: "Pending", status_approved: "Approved", status_rejected: "Rejected",
            verify_title: "Verify Your Account", verify_desc: "A 4-digit code was sent to your phone/email. Enter it below:",
            verify_btn: "Verify", verify_error: "Invalid code. Please try again.", verify_success: "Account verified successfully!",
            nav_appointments: "Appointments", book_apt: "Book Appointment", date_label: "Select Date", time_label: "Select Time",
            no_apt: "No appointments scheduled.", my_appointments: "My Appointments",
            notifications: "Notifications", no_notifs: "No new notifications",
            capture_rx: "Capture Prescription", capture: "Capture", cancel: "Cancel",
        },
        ar: {
            lang_name: "English", login_title: "مرحباً بعودتك", national_id: "الرقم القومي",
            login_id_label: "رقم الهاتف أو الرقم القومي",
            password: "كلمة المرور", login_btn: "تسجيل الدخول", no_account: "ليس لديك حساب؟",
            register_link: "سجل هنا", register_title: "إنشاء حساب", role: "الدور",
            role_patient: "مريض", role_doctor: "طبيب", full_name: "الاسم الكامل",
            phone: "رقم الهاتف", email: "البريد الإلكتروني", register_btn: "تسجيل",
            has_account: "لديك حساب بالفعل؟", login_link: "سجل الدخول هنا",
            nav_dashboard: "لوحة التحكم", my_profile: "ملفي الشخصي",
            nav_patients: "المرضى", search_btn: "بحث", search_patient_placeholder: "الرقم القومي للمريض...",
            search_doc_placeholder: "بحث عن طبيب...",
            select_doc_msg: "اختر طبيباً للمراسلة...",
            prescriptions_upload: "تحميل ملف طبي",
            upload_sync_btn: "رفع ومزامنة",
            get_directions: "احصل على الاتجاهات",
            patient_status: "الحالة الطبية",
            personal_info: "المعلومات الشخصية", edit: "تعديل", save: "حفظ", cancel: "إلغاء",
            my_prescriptions: "الروشتات الطبية", doctor_welcome: "مرحباً بك، دكتور",
            doctor_instruct: "البحث عن مريض بالرقم القومي للبدء.",
            prescribe_new: "كتابة روشتة جديدة", medications: "الأدوية", notes: "ملاحظات الطبيب",
            send_prescription: "إرسال الروشتة", no_prescriptions: "لا توجد روشتات.",
            prescribed_by: "وصفها د. ", patient_workspace: "ملف المريض الحالي",
            back_to_search: "العودة للبحث",
            admin_panel: "لوحة التحكم", pending_apps: "طلبات الأطباء", approve: "موافقة", 
            reject: "رفض", apply_doctor: "التقديم كطبيب", license_label: "تحميل الرخصة (PDF/صورة)",
            switch_role: "التبديل إلى", status_pending: "قيد الانتظار", status_approved: "تمت الموافقة", status_rejected: "مرفوض",
            verify_title: "تأكيد حسابك", verify_desc: "تم إرسال كود من 4 أرقام لهاتفك/بريدك. أدخله أدناه:",
            verify_btn: "تأكيد", verify_error: "الكود غير صحيح. حاول مرة أخرى.", verify_success: "تم تأكيد الحساب بنجاح!",
            notifications: "التنبيهات", no_notifs: "لا توجد تنبيهات جديدة",
            capture_rx: "التقاط صورة الروشتة", capture: "التقاط", nav_appointments: "المواعيد",
            book_apt: "حجز موعد", date_label: "التاريخ", time_label: "الوقت",
            nav_settings: "الإعدادات", nav_pharmacy: "الصيدليات",
            city: "المدينة", governorate: "المحافظة",
            search_pharmacy_placeholder: "البحث عن صيدليات...",
            pharmacy_name: "اسم الصيدلية", pharmacy_address: "العنوان", pharmacy_phone: "الهاتف",
            pharmacy_distance: "المسافة", no_pharmacies: "لا توجد صيدليات."
        }
    },

    // ─────────────────────────────────────────────────────────────
    // REAL BACKEND API - Connects to Express Server
    // ─────────────────────────────────────────────────────────────
    geo: {
        async getPosition() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) return reject("No geo");
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        }
    },
    
    api: async (endpoint, method = 'GET', body = null) => {
        const token = localStorage.getItem('mr_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Handle absolute vs relative URLs (for local file display support)
        let baseUrl = '/api';
        if (window.location.protocol === 'file:') {
            baseUrl = 'http://127.0.0.1:3000/api';
        } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            if (window.location.port !== '3000') baseUrl = `http://${window.location.hostname}:3000/api`;
        } else if (window.location.port && window.location.port !== '3000') {
            baseUrl = `${window.location.protocol}//${window.location.hostname}:3000/api`;
        }
        
        const targetUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
        
        console.log(`[API] ${method} ${targetUrl}`, body);

        const options = { method, headers };
        if (body && method !== 'GET') options.body = JSON.stringify(body);


        try {
            const response = await fetch(targetUrl, options);
            const contentType = response.headers.get("content-type");
            
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error('[API] Non-JSON Response received:', text.substring(0, 200));
                throw new Error(`Server returned non-JSON response (${response.status}). Check backend status.`);
            }
            
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('mr_token');
                    if (!endpoint.includes('/auth/login')) app.auth.logout();
                }
                const errorMsg = data.msg || data.message || data.error || 'API Request failed';
                console.warn(`[API] Error ${response.status}:`, errorMsg);
                throw new Error(errorMsg);
            }
            return data;
        } catch (err) {
            console.error('[API] Fetch Error:', err);
            const msg = err.name === 'SyntaxError' ? 'Server returned invalid JSON. Check backend logs.' : (err.name === 'TypeError' && err.message === 'Failed to fetch' 
                ? 'Could not connect to server. Ensure backend is running.' 
                : err.message);
            app.ui.toast(msg, 'error');
            throw err;
        }
    },


    apiUpload: async (endpoint, formData) => {
        const token = localStorage.getItem('mr_token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        let baseUrl = '/api';
        if (window.location.protocol === 'file:') baseUrl = 'http://127.0.0.1:3000/api';
        else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            if (window.location.port !== '3000') baseUrl = `http://${window.location.hostname}:3000/api`;
        } else if (window.location.port && window.location.port !== '3000') {
            baseUrl = `${window.location.protocol}//${window.location.hostname}:3000/api`;
        }
        
        const targetUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

        try {
            const res = await fetch(targetUrl, { method: 'POST', headers, body: formData });
            const contentType = res.headers.get("content-type");
            if (!contentType || contentType.indexOf("application/json") === -1) {
                const text = await res.text();
                throw new Error(`Upload failed (${res.status}). Server returned non-JSON.`);
            }
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || data.message || 'Upload failed');
            return data;
        } catch (err) {
            app.ui.toast(err.message, 'error');
            throw err;
        }
    },

    notifications: {
        list: [],
        async load() {
            try {
                const data = await app.api('/notifications');
                this.list = data;
                this.updateUI();
            } catch (err) {}
        },
        updateUI() {
            const badge = document.getElementById('notifBadge');
            const listContainer = document.getElementById('notifList');
            if (!badge || !listContainer) return;

            const unread = this.list.filter(n => !n.isRead).length;
            if (unread > 0) {
                badge.textContent = unread;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }

            if (this.list.length === 0) {
                listContainer.innerHTML = `<p style="text-align:center; padding:20px; font-size:12px; color:var(--text-muted);" data-i18n="no_notifs">${app.translations[app.lang].no_notifs}</p>`;
                return;
            }

            listContainer.innerHTML = this.list.map(n => `
                <div class="notif-item ${n.isRead ? '' : 'unread'}" onclick="app.notifications.markRead('${n.id || n._id}')">
                    <div style="font-size:12px; font-weight:600;">${n.message}</div>
                    <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">${new Date(n.createdAt || n.date).toLocaleString()}</div>
                </div>
            `).join('');
        },
        async markRead(id) {
            try {
                await app.api(`/notifications/${id}/read`, 'PUT');
                this.load();
            } catch (err) {}
        }
    },

    profile: {
        triggerUpload() {
            // Allow profile picture change only from the Profile view.
            if (app.currentView !== 'profile') {
                // In other views just display the full image if present.
                if (app.user && app.user.profilePic) return window.open(app.user.profilePic, '_blank');
                return app.ui.toast('Open Profile to change avatar', 'info');
            }
            document.getElementById('profilePicInput').click();
        },
        async handleUpload(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowed.includes(file.type)) return app.ui.toast("Only JPG and PNG are allowed", "error");
            if (file.size > 2 * 1024 * 1024) return app.ui.toast("File too large (max 2MB)", "error");

            const formData = new FormData();
            formData.append('file', file);

            try {
                const data = await app.apiUpload('/users/upload', formData);
                await app.api('/users/profile', 'PUT', { profilePic: data.url });
                app.user.profilePic = data.url;
                app.profile.updateDisplay();
                app.ui.toast("Avatar updated", "success");
            } catch (err) { }
        },
        updateDisplay() {
            const headerAvatar = document.getElementById('headerAvatar');
            if (!headerAvatar || !app.user) return;
            const pic = app.user.profilePic;
            if (pic) {
                headerAvatar.innerHTML = `<img src="${pic}" alt="Profile">`;
            } else {
                headerAvatar.textContent = app.user.name ? app.user.name.charAt(0).toUpperCase() : '?';
            }
            const heros = ['heroAvatar', 'heroAvatarDoc'];
            heros.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = pic ? `<img src="${pic}">` : (app.user && app.user.name ? app.user.name.charAt(0) : '');
            });
        },
        async saveGeneralSettings() {
            const email = document.getElementById('profEmail').value;
            const city = document.getElementById('profCity').value;
            try {
                const updated = await app.api('/profile', 'PUT', { email, city });
                app.user = updated;
                app.ui.toast("Profile updated", "success");
            } catch (err) { app.ui.toast("Failed to save", "error"); }
        },
        async saveDocSettings() {
            const specialization = document.getElementById('profSpecialization').value;
            const clinicAddress = document.getElementById('profClinic').value;
            const contactInfo = document.getElementById('profContact').value;
            try {
                const updated = await app.api('/profile', 'PUT', { specialization, clinicAddress, contactInfo });
                app.user = updated;
                app.ui.toast("Professional info updated", "success");
            } catch (err) { app.ui.toast("Failed to save", "error"); }
        },
        async uploadProfessionalDocs() {
            const cvFile = document.getElementById('doctorCvFile')?.files[0];
            const certFile = document.getElementById('doctorCertFile')?.files[0];
            
            if (!cvFile && !certFile) return app.ui.toast("Select a file to upload", "info");

            try {
                const updates = {};
                if (cvFile) {
                    const formData = new FormData();
                    formData.append('file', cvFile);
                    const data = await app.apiUpload('/users/upload', formData);
                    updates.licenseIdUrl = data.url; // Use as primary doc
                }
                if (certFile) {
                    const formData = new FormData();
                    formData.append('file', certFile);
                    const data = await app.apiUpload('/users/upload', formData);
                    updates.certificatesUrls = [data.url];
                }
                
                await app.api('/profile', 'PUT', updates);
                app.ui.toast("Documents synced", "success");
                app.ui.renderProfile();
            } catch (err) { }
        }
    },

    auth: {
        async init() {
            // load specializations list for the doctor dropdown
            try {
                const specs = await app.api('/specializations', 'GET');
                const sel = document.getElementById('regSpecialization');
                if (sel) {
                    sel.innerHTML = '<option value="">Select specialization...</option>';
                    specs.forEach(s => {
                        const opt = document.createElement('option');
                        opt.value = s.code || s.name;
                        opt.textContent = s.name + (s.nameAr ? ` (${s.nameAr})` : '');
                        sel.appendChild(opt);
                    });
                }
            } catch (e) {
                console.warn('Could not load specializations', e);
            }

            // fetch any runtime configuration (e.g. external landing page)
            try {
                const cfg = await app.api('/config', 'GET');
                app.config = cfg || {};
                // show developer/testing banner if appropriate
                if (app.config.devMode) {
                    // persistent banner at top of page
                    const existing = document.getElementById('devModeBanner');
                    if (!existing) {
                        const banner = document.createElement('div');
                        banner.id = 'devModeBanner';
                        banner.style.cssText = 'background:#ffcc00;color:#000;padding:6px;text-align:center;font-weight:600;';
                        banner.textContent = '⚠️ WARNING: Application running in DEVELOPMENT / TESTING MODE';
                        document.body.insertBefore(banner, document.body.firstChild);
                    }
                }
            } catch (e) {
                app.config = {};
            }

            // Check if user has a valid token and verify it with the server
            const token = localStorage.getItem('mr_token');
            if (token) {
                try {
                    const fullProfile = await app.api('/users/profile', 'GET');
                    // merge with any existing basic user data
                    app.user = { ...app.user, ...fullProfile };
                    app.ui.showApp();
                } catch (err) {
                    // token invalid or expired
                    localStorage.removeItem('mr_token');
                    app.ui.showLogin();
                }
            } else {
                // No token – redirect to configured external registration page if present
                if (app.config && app.config.externalRegistrationUrl) {
                    window.location.href = app.config.externalRegistrationUrl;
                    return;
                }
                app.ui.showLogin();
            }
        },


        toggleDoctorFields() {
            const role = document.getElementById('regRole')?.value || '';
            const doctorFields = document.getElementById('doctorFields');
            const licenseInput = document.getElementById('regLicenseId');
            const certificatesInput = document.getElementById('regCertificates');
            
            if (role === 'doctor') {
                doctorFields?.classList.remove('hidden');
                licenseInput?.setAttribute('required', 'required');
                certificatesInput?.setAttribute('required', 'required');
            } else {
                doctorFields?.classList.add('hidden');
                licenseInput?.removeAttribute('required');
                certificatesInput?.removeAttribute('required');
            }
        },

        async register(e) {
            e.preventDefault();
            const id = document.getElementById('regId')?.value.trim() || '';
            const name = document.getElementById('regName')?.value.trim() || '';
            const phone = document.getElementById('regPhone')?.value.trim() || '';
            const email = document.getElementById('regEmail')?.value.trim() || '';
            const password = document.getElementById('regPassword')?.value || '';
            const age = document.getElementById('regAge')?.value || '';
            const dob = document.getElementById('regDOB')?.value || '';
            const gender = document.getElementById('regGender')?.value || '';
            const city = document.getElementById('regCity')?.value.trim() || '';
            const gov = document.getElementById('regGov')?.value || '';
            const role = document.getElementById('regRole')?.value || 'patient';

            // ════════════════════════════════════════════════════════════════
            // FRONTEND VALIDATION
            // ════════════════════════════════════════════════════════════════

            // National ID
            const idVal = app.validators.nationalId(id);
            if (!idVal.valid) {
                app.ui.toast(idVal.message, 'error');
                return;
            }

            // Name
            const nameVal = app.validators.name(name, 'Full name');
            if (!nameVal.valid) {
                app.ui.toast(nameVal.message, 'error');
                return;
            }

            // Phone
            const phoneVal = app.validators.phoneNumber(phone);
            if (!phoneVal.valid) {
                app.ui.toast(phoneVal.message, 'error');
                return;
            }

            // Email (if provided)
            if (email) {
                const emailVal = app.validators.email(email);
                if (!emailVal.valid) {
                    app.ui.toast(emailVal.message, 'error');
                    return;
                }
            }

            // Password
            const passVal = app.validators.password(password);
            if (!passVal.valid) {
                app.ui.toast(passVal.message, 'error');
                return;
            }

            // Age or DOB (at least one required)
            let selectedAge = null;
            let selectedDOB = null;

            if (age) {
                const ageVal = app.validators.age(age);
                if (!ageVal.valid) {
                    app.ui.toast(ageVal.message, 'error');
                    return;
                }
                selectedAge = ageVal.value;
            } else if (dob) {
                const dobVal = app.validators.dateOfBirth(dob);
                if (!dobVal.valid) {
                    app.ui.toast(dobVal.message, 'error');
                    return;
                }
                selectedDOB = dobVal.value;
            } else {
                app.ui.toast('Please provide either age or date of birth', 'error');
                return;
            }

            // Gender (if provided)
            if (gender) {
                const genderVal = app.validators.gender(gender);
                if (!genderVal.valid) {
                    app.ui.toast(genderVal.message, 'error');
                    return;
                }
            }

            // City
            if (!city) {
                app.ui.toast('City is required', 'error');
                return;
            }

            // Governorate
            const govVal = app.validators.governorate(gov);
            if (!govVal.valid) {
                app.ui.toast(govVal.message, 'error');
                return;
            }

            // ════════════════════════════════════════════════════════════════
            // DOCTOR-SPECIFIC VALIDATION
            // ════════════════════════════════════════════════════════════════

            if (role === 'doctor') {
                const selectEl = document.getElementById('regSpecialization');
                const specialization = selectEl?.value ? selectEl.value.trim() : '';
                const specialization_code = selectEl?.value ? selectEl.value.trim() : '';
                const licenseFile = document.getElementById('regLicenseId')?.files?.[0];
                const certificateFiles = document.getElementById('regCertificates')?.files;

                if (!specialization) {
                    app.ui.toast('Specialization is required for doctors', 'error');
                    return;
                }

                if (!licenseFile) {
                    app.ui.toast('Medical license ID is required', 'error');
                    return;
                }

                if (!certificateFiles || certificateFiles.length === 0) {
                    app.ui.toast('At least one medical certificate is required', 'error');
                    return;
                }

                // Validate file sizes and types
                const maxSize = 5 * 1024 * 1024; // 5MB
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

                if (licenseFile.size > maxSize) {
                    app.ui.toast('License file size must be less than 5MB', 'error');
                    return;
                }

                if (!allowedTypes.includes(licenseFile.type)) {
                    app.ui.toast('License file must be PDF or image (JPG/PNG)', 'error');
                    return;
                }

                for (let cert of certificateFiles) {
                    if (cert.size > maxSize) {
                        app.ui.toast(`Certificate "${cert.name}" exceeds 5MB limit`, 'error');
                        return;
                    }
                    if (!allowedTypes.includes(cert.type)) {
                        app.ui.toast(`Certificate "${cert.name}" must be PDF or image`, 'error');
                        return;
                    }
                }

                // Use FormData for doctor registration (multipart file upload)
                try {
                    const formData = new FormData();
                    formData.append('id', idVal.value);
                    formData.append('name', nameVal.value);
                    formData.append('phone', phoneVal.value);
                    formData.append('email', email || '');
                    formData.append('password', password);
                    formData.append('age', selectedAge);
                    formData.append('dateOfBirth', selectedDOB || '');
                    formData.append('gender', gender || '');
                    formData.append('city', city);
                    formData.append('governorate', govVal.value);
                    // send selected value as both specialization (text) and code
                    formData.append('specialization', specialization);
                    formData.append('specialization_code', specialization);
                    formData.append('licenseId', licenseFile);
                    
                    // Append all certificate files
                    for (let cert of certificateFiles) {
                        formData.append('certificates', cert);
                    }

                    // include role field so server knows this is a doctor
                    formData.append('role', 'doctor');
                    const res = await fetch('/api/register', {
                        method: 'POST',
                        body: formData
                    });

                    if (!res.ok) {
                        const errData = await res.json();
                        throw new Error(errData.msg || 'Doctor registration failed');
                    }

                    const data = await res.json();
                    if (data.verificationStatus === 'approved') {
                        app.ui.toast("✓ Doctor account created and automatically approved. You may login now.", "success");
                    } else {
                        app.ui.toast("✓ Doctor account created! Your account is pending admin verification.", "success");
                    }
                    document.getElementById('registerForm')?.reset();
                    app.auth.toggleDoctorFields();
                    
                    setTimeout(() => {
                        app.ui.showLogin();
                        const loginIdField = document.getElementById('loginId');
                        if (loginIdField) {
                            loginIdField.value = phone;
                            loginIdField.focus();
                        }
                    }, 1500);
                } catch (err) {
                    app.ui.toast(err.message || 'Doctor registration failed', 'error');
                }
            } else {
                // ════════════════════════════════════════════════════════════════
                // PATIENT REGISTRATION
                // ════════════════════════════════════════════════════════════════
                try {
                    const body = {
                        id: idVal.value,
                        name: nameVal.value,
                        phone: phoneVal.value,
                        email: email || null,
                        password,
                        age: selectedAge,
                        dateOfBirth: selectedDOB,
                        gender: gender || null,
                        city: city,
                        governorate: govVal.value
                    };
                    const res = await app.api('/register', 'POST', body);
                    app.ui.toast("✓ Registration successful! Please login with your credentials.", "success");
                    document.getElementById('registerForm')?.reset();
                    
                    setTimeout(() => {
                        app.ui.showLogin();
                        const loginIdField = document.getElementById('loginId');
                        if (loginIdField) {
                            loginIdField.value = phone;
                            loginIdField.focus();
                        }
                    }, 1000);
                } catch (err) {
                    app.ui.toast(err.message || "Registration failed", "error");
                }
            }
        },

        async login(e) {
            e.preventDefault();
            const loginId  = document.getElementById('loginId').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!loginId || !password) {
                app.ui.toast('Please enter your login ID and password', 'error');
                return;
            }

            try {
                const res = await app.api('/login', 'POST', { loginId, password });
                if (res && res.token && res.user) {
                    localStorage.setItem('mr_token', res.token);
                    app.user = res.user;
                    
                    // Fetch full user profile to get verification status
                    try {
                        const fullProfile = await app.api('/users/profile', 'GET');
                        app.user = { ...app.user, ...fullProfile };
                    } catch (e) {
                        // If profile fetch fails, continue with basic user data
                        console.warn('Could not fetch full profile');
                    }
                    
                    app.ui.toast('Welcome back, ' + (res.user.name || 'User') + '!', 'success');
                    app.ui.showApp();
                } else {
                    app.ui.toast('Login failed: invalid response', 'error');
                }
            } catch (err) {}
        },

        // TEMPORARY DEVELOPMENT TEST BUTTON – REMOVE BEFORE PRODUCTION
        // This helper just calls the normal login API using hard‑coded test doctor
        // credentials; it does **not** bypass authentication or alter core logic.
        // NOTE: the login endpoint accepts national ID or phone only, so we use the
        // seeded doctor's ID here rather than an email address.
        async loginTestDoctor() {
            // credentials correspond to the seeded test doctor account.  We prefer
            // the hard‑coded phone since the login endpoint doesn't accept email.
            // This value is kept stable by the server seed so developers can hit the
            // button repeatedly without worrying about random phones generated by
            // earlier bypass scripts.
            const creds = { loginId: '01099999999', password: 'password123' };
            try {
                const res = await app.api('/login', 'POST', creds);
                if (res && res.token && res.user) {
                    localStorage.setItem('mr_token', res.token);
                    app.user = res.user;
                    try {
                        const fullProfile = await app.api('/users/profile', 'GET');
                        app.user = { ...app.user, ...fullProfile };
                    } catch (e) {
                        console.warn('Could not fetch full profile');
                    }
                    app.ui.toast('Logged in as test doctor', 'success');
                    app.ui.showApp();
                } else {
                    app.ui.toast('Test login failed: invalid response', 'error');
                }
            } catch (err) {
                app.ui.toast(err.message || 'Test login error', 'error');
            }
        },


        logout() {
            localStorage.removeItem('mr_token');
            if (app.ui.notifInterval) clearInterval(app.ui.notifInterval);
            app.user = null;
            app.ui.showLogin();
        },
    },

    ui: {
        toastTimeout: null,
        toast(msg, type="success") {
            const t = document.getElementById('toast');
            if (!t) return;
            t.textContent = msg; t.className = `toast ${type}`;
            clearTimeout(this.toastTimeout);
            this.toastTimeout = setTimeout(() => t.className='toast hidden', 3000);
        },
        async showCamera() {
            const modal = document.getElementById('cameraModal');
            const video = document.getElementById('cameraVideo');
            modal.classList.remove('hidden');
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                video.srcObject = this.stream;
            } catch (err) {
                app.ui.toast("Camera access denied or not available", "error");
                this.hideCamera();
            }
        },
        toggleNotifs() {
            const dropdown = document.getElementById('notifDropdown');
            if (dropdown) dropdown.classList.toggle('hidden');
            if (!dropdown.classList.contains('hidden')) {
                app.notifications.load();
            }
        },
        hideCamera() {
            const modal = document.getElementById('cameraModal');
            modal.classList.add('hidden');
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
        },
        showLogin() {
            document.getElementById('appContainer')?.classList.add('hidden');
            document.getElementById('authContainer')?.classList.remove('hidden');
            document.getElementById('registerForm')?.classList.add('hidden');
            document.getElementById('loginForm')?.classList.remove('hidden');
        },
        showRegister() {
            document.getElementById('loginForm')?.classList.add('hidden');
            document.getElementById('registerForm')?.classList.remove('hidden');
        },
        showApp() {
            document.getElementById('authContainer')?.classList.add('hidden');
            document.getElementById('appContainer')?.classList.remove('hidden');
            
            const headerName = document.getElementById('headerName');
            if (headerName && app.user && app.user.name) headerName.textContent = app.user.name;
            app.profile.updateDisplay();

            const switcher = document.getElementById('roleSwitcher');
            if (app.user.roles && app.user.roles.length > 1) {
                switcher?.classList.remove('hidden');
                const label = document.getElementById('currentRoleLabel');
                if (label) label.textContent = app.translations[app.lang][`role_${app.user.activeRole}`] || app.user.activeRole;
            } else {
                switcher?.classList.add('hidden');
            }

            // Start Notification Polling
            app.notifications.load();
            this.notifInterval = setInterval(() => app.notifications.load(), 30000);

            // Check doctor verification status
            const userRoles = Array.isArray(app.user.roles) ? app.user.roles : [app.user.roles];
            if (userRoles.includes('doctor') && app.user.verificationStatus === 'pending') {
                // Show pending verification dashboard
                this.showView('doctorPending');
                app.ui.toast('⏳ Your doctor account is pending admin verification. Please check back later.', 'info');
            } else {
                // Initial view based on role
                if (app.user.activeRole === 'patient') {
                    this.showView('dashboard');
                } else if (app.user.activeRole === 'doctor') {
                    this.showView('dashboard');
                } else if (app.user.activeRole === 'admin') {
                    this.showView('admin');
                }
            }
            
            app.i18n.apply();
        },

        toggleRoleSwitch() {
            const currentIdx = app.user.roles.indexOf(app.user.activeRole);
            const nextIdx = (currentIdx + 1) % app.user.roles.length;
            app.ui.switchRole(app.user.roles[nextIdx]);
        },

        async switchRole(role) {
            try {
                const res = await app.api('/users/profile', 'PUT', { activeRole: role });
                app.user = res;
                app.ui.toast(`${app.translations[app.lang].switch_role || 'Switched to'} ${app.translations[app.lang][`role_${role}`] || role}`, "info");
                app.ui.showApp();
            } catch (err) {}
        },

        updateNav(active) {
            const nav = document.getElementById('navMenu');
            if (!nav) return;
            let navHtml = '';
            
            // Language switcher
            navHtml += `<div style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.1);"><button onclick="app.i18n.switchLang()" style="background: var(--surface); border: 1px solid var(--border); padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 500;"><i class="fa-solid fa-globe"></i> ${app.lang === 'en' ? 'عربي' : 'English'}</button></div>`;
            
            if (app.user.activeRole === 'patient') {
                navHtml += `<a href="#" class="nav-item ${active === 'dashboard' ? 'active' : ''}" onclick="app.ui.showView('dashboard')"><i class="fa-solid fa-house"></i> <span data-i18n="nav_dashboard">${app.translations[app.lang].nav_dashboard}</span></a>`;
                navHtml += `<a href="#" class="nav-item ${active === 'pharmacy' ? 'active' : ''}" onclick="app.ui.showView('pharmacy')"><i class="fa-solid fa-capsules"></i> <span data-i18n="nav_pharmacy">Pharmacies</span></a>`;
                navHtml += `<a href="#" class="nav-item ${active === 'appointments' ? 'active' : ''}" onclick="app.ui.showView('appointments')"><i class="fa-solid fa-calendar-check"></i> <span data-i18n="nav_appointments">${app.translations[app.lang].nav_appointments}</span></a>`;
            } else if (app.user.activeRole === 'doctor') {
                // if the doctor is not yet approved we limit the nav to the
                // pending notice and profile/settings.  approved doctors see full
                // menu.
                const isApproved = app.user.verificationStatus === 'approved';
                if (isApproved) {
                    navHtml += `<a href="#" class="nav-item ${active === 'dashboard' ? 'active' : ''}" onclick="app.ui.showView('dashboard')"><i class="fa-solid fa-hospital-user"></i> <span data-i18n="nav_patients">${app.translations[app.lang].nav_patients}</span></a>`;
                    navHtml += `<a href="#" class="nav-item ${active === 'messages' ? 'active' : ''}" onclick="app.ui.showView('messages')"><i class="fa-solid fa-message"></i> <span data-i18n="nav_messages">${app.translations[app.lang].nav_messages}</span></a>`;
                    navHtml += `<a href="#" class="nav-item ${active === 'appointments' ? 'active' : ''}" onclick="app.ui.showView('appointments')"><i class="fa-solid fa-calendar-check"></i> <span data-i18n="nav_appointments">${app.translations[app.lang].nav_appointments}</span></a>`;
                } else {
                    navHtml += `<a href="#" class="nav-item ${active === 'doctorPending' ? 'active' : ''}" onclick="app.ui.showView('doctorPending')"><i class="fa-solid fa-hourglass-clock"></i> <span>Verification Pending</span></a>`;
                }
            } else if (app.user.activeRole === 'admin') {
                navHtml += `<a href="#" class="nav-item ${active === 'admin' ? 'active' : ''}" onclick="app.ui.showView('admin')"><i class="fa-solid fa-shield-halved"></i> <span data-i18n="admin_panel">Admin Panel</span></a>`;
            }

            navHtml += `
                <a href="#" class="nav-item ${active === 'profile' ? 'active' : ''}" onclick="app.ui.showView('profile')">
                    <i class="fa-solid fa-user-gear"></i> <span data-i18n="my_profile">My Profile</span>
                </a>
                <a href="#" class="nav-item ${active === 'settings' ? 'active' : ''}" onclick="app.ui.showView('settings')">
                    <i class="fa-solid fa-cog"></i> <span data-i18n="nav_settings">Settings</span>
                </a>
                <hr style="margin: 10px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
                <a href="#" class="nav-item" onclick="app.auth.logout(); event.preventDefault();" style="color: var(--danger);">
                    <i class="fa-solid fa-sign-out-alt"></i> <span>Logout</span>
                </a>
            `;
            nav.innerHTML = navHtml;
            app.i18n.apply();
        },

        showView(view) {
            // guard against unauthorized access - if user is not set redirect to
            // login page. this also prevents errors when other parts of the UI try
            // to switch views before authentication.
            if (!app.user) {
                app.auth.logout();
                return;
            }

            // prevent pending doctors from navigating away from the waiting screen
            const userRoles = Array.isArray(app.user.roles) ? app.user.roles : [app.user.roles];
            if (userRoles.includes('doctor') && app.user.verificationStatus !== 'approved') {
                if (view !== 'doctorPending') {
                    // the guard will re‑enter showView and stop recursion via return
                    this.showView('doctorPending');
                }
                return;
            }

            app.currentView = view;  // Track the current view
            document.querySelectorAll('.dashboard-content').forEach(c => c.classList.add('hidden'));
            const mainView = document.getElementById('mainView');
            const pharmacySearchSection = document.getElementById('pharmacySearchSection');
            const doctorSearch = document.getElementById('doctorSearch');
            const patientDoctorSelect = document.getElementById('patientDoctorSelect');

            if (mainView) mainView.classList.remove('hidden');
            if (pharmacySearchSection) pharmacySearchSection.classList.add('hidden');
            if (doctorSearch) doctorSearch.classList.add('hidden');
            if (patientDoctorSelect) patientDoctorSelect.classList.add('hidden');

            if (view === 'pharmacy') {
                if (pharmacySearchSection) pharmacySearchSection.classList.remove('hidden');
                if (mainView) mainView.classList.add('hidden');
                app.pharmacy.renderSearch();
            } else {
                if (view === 'dashboard') {
                    if (app.user.activeRole === 'patient') {
                        app.ui.renderPatientDashboard();
                        if (patientDoctorSelect) patientDoctorSelect.classList.remove('hidden');
                    } else if (app.user.activeRole === 'doctor') {
                        app.ui.renderDoctorDashboard();
                        if (doctorSearch) doctorSearch.classList.remove('hidden');
                    } else if (app.user.activeRole === 'admin') {
                        app.ui.renderAdminPanel();
                    }
                } else if (view === 'profile') {
                    app.ui.renderProfile();
                } else if (view === 'messages') {
                    app.ui.renderChatView();
                } else if (view === 'appointments') {
                    app.ui.renderAppointments();
                } else if (view === 'settings') {
                    app.ui.renderSettings();
                } else if (view === 'admin') {
                    app.ui.renderAdminPanel();
                } else if (view === 'doctorPending') {
                    app.ui.renderDoctorPendingView();
                }
            }
            this.updateNav(view);
        },

        renderDoctorPendingView() {
            const mainView = document.getElementById('mainView');
            if (!mainView) return;

            const html = `
                <div class="content-header">
                    <h1 class="page-title">Account Verification Pending</h1>
                </div>

                <div class="dashboard-widgets" style="display: flex; justify-content: center; padding: 60px 20px;">
                    <div class="card" style="max-width: 500px; text-align: center;">
                        <div style="font-size: 80px; color: var(--warning); margin-bottom: 20px;">
                            <i class="fa-solid fa-hourglass-clock"></i>
                        </div>
                        <h2 style="margin-bottom: 15px; color: var(--warning);">⏳ Account Under Review</h2>
                        <p style="font-size: 16px; color: var(--text-muted); line-height: 1.6; margin-bottom: 30px;">
                            Thank you for registering as a doctor. Your account and medical credentials are currently under review by our admin team.
                        </p>
                        <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--warning); padding: 20px; margin-bottom: 30px; text-align: left;">
                            <p style="font-size: 14px; margin-bottom: 10px;"><strong>What's happening?</strong></p>
                            <ul style="margin-left: 20px; font-size: 13px; color: var(--text-muted);">
                                <li>Your medical license and certificates are being verified</li>
                                <li>Your professional credentials are being validated</li>
                                <li>Once approved, you'll gain access to full doctor features</li>
                            </ul>
                        </div>
                        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 30px;">
                            We typically complete verification within 24-48 hours. You'll receive an email notification once your account is approved.
                        </p>
                        <button class="btn secondary-btn" onclick="window.location.href='/'" style="width: 100%;">
                            <i class="fa-solid fa-arrow-right"></i> Return Home
                        </button>
                    </div>
                </div>
            `;

            mainView.innerHTML = html;
        },

        async renderPatientDashboard() {
            const p = app.user;
            const html = `
                <div class="content-header">
                    <h1 class="page-title" data-i18n="nav_dashboard">Dashboard</h1>
                </div>
                
                <div class="dashboard-widgets">
                    <div class="card stagger-2">
                        <div class="card-header"><h2 data-i18n="patient_status">Medical Status</h2></div>
                        <div class="status-indicator" style="display:flex; align-items:center; gap:15px; padding:10px 0;">
                            <div style="width:12px; height:12px; border-radius:50%; background:var(--success);"></div>
                            <span style="font-weight:600;">${app.translations[app.lang].status_active_verified || 'Account Active & Verified'}</span>
                        </div>
                        <p class="text-muted" style="font-size:13px;">${app.translations[app.lang].records_synced_msg || 'Your medical records are synchronized and up to date.'}</p>
                    </div>
                    
                    <div class="card stagger-3">
                        <div class="card-header"><h2 data-i18n="prescriptions_upload">Quick Upload</h2></div>
                        <div class="form-group">
                            <label>${app.translations[app.lang].medical_file_label || 'Medical File (PDF or Image)'}</label>
                            <div style="display:flex; gap:10px;">
                                <input type="file" id="patientFileRx" accept="image/*,.pdf" style="flex:1; padding:10px; font-size:12px;">
                                <button class="btn secondary-btn small" onclick="app.ui.showCamera()">
                                    <i class="fa-solid fa-camera"></i>
                                </button>
                            </div>
                        </div>
                        <button class="btn primary-btn full-width" onclick="app.patient.uploadPrescription()">
                            <i class="fa-solid fa-upload"></i> ${app.translations[app.lang].upload_sync_btn || 'Upload & Sync'}
                        </button>
                    </div>
                </div>

                <div class="stagger-4">
                    <h2 class="page-title mt-5" data-i18n="my_prescriptions">My Medical Records</h2>
                    <div class="content-grid" id="patientPrescriptionsList"></div>
                </div>
            `;
            const mainView = document.getElementById('mainView');
            if (mainView) mainView.innerHTML = html;
            app.patient.loadPrescriptions();
            app.i18n.apply();
        },

        renderProfile() {
            const p = app.user;
            if (!p) return;
            const isDoc = p && p.roles && p.roles.includes('doctor');
            const html = `
                <div class="content-header">
                    <h1 class="page-title" data-i18n="my_profile">My Profile</h1>
                </div>

                <div class="profile-hero card stagger-1 mb-4" style="display:flex; align-items:center; gap :30px; padding:30px;">
                    <div class="avatar-container" style="width:120px; height:120px;" onclick="app.profile.triggerUpload()">
                        <div class="avatar large" id="heroAvatar">${p.profilePic ? `<img src="${p.profilePic}">` : (p && p.name ? p.name.charAt(0) : '?')}</div>
                        <div class="avatar-overlay" style="font-size:24px;"><i class="fa-solid fa-camera"></i></div>
                    </div>
                    <div>
                        <h1 style="margin:0; font-size:28px;">${p.name}</h1>
                        <p class="text-muted">${app.translations[app.lang][`role_${p.activeRole}`]} | ID: ${p.id}</p>
                        <div style="display:flex; gap:10px; margin-top:8px;">
                            <span class="status-badge approved">${p.isVerified ? 'Verified' : 'Unverified'}</span>
                            ${isDoc ? '<span class="status-badge approved">Professional</span>' : ''}
                        </div>
                    </div>
                </div>

                <div class="dashboard-widgets">
                    <div class="card stagger-2">
                        <div class="card-header"><h2>Account Settings</h2></div>
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" value="${p.name}" disabled>
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="text" value="${p.phone}" disabled>
                        </div>
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" id="profEmail" value="${p.email || ''}">
                        </div>
                        <div class="form-row">
                            <div class="form-group half">
                                <label>City</label>
                                <input type="text" id="profCity" value="${p.city || ''}">
                            </div>
                            <div class="form-group half">
                                <label>Governorate</label>
                                <input type="text" value="${p.governorate}" disabled>
                            </div>
                        </div>
                        <button class="btn primary-btn full-width" onclick="app.profile.saveGeneralSettings()">Save Changes</button>
                    </div>

                    ${isDoc ? `
                    <div class="card stagger-3">
                        <div class="card-header"><h2>Professional Center</h2></div>
                        <div class="form-group">
                            <label>Specialization</label>
                            <input type="text" id="profSpecialization" value="${p.specialization || ''}">
                        </div>
                        <div class="form-group">
                            <label>Clinic Address</label>
                            <input type="text" id="profClinic" value="${p.clinicAddress || ''}">
                        </div>
                        <div class="form-group">
                            <label>Contact Info</label>
                            <input type="text" id="profContact" value="${p.contactInfo || ''}">
                        </div>
                        <hr class="mb-4 mt-4">
                        <h3 style="font-size:14px; margin-bottom:15px;">Professional Documents</h3>
                        <div class="form-group">
                            <label>CV & Certificates (PDF/Images)</label>
                            <input type="file" id="doctorCvFile" accept="image/*,.pdf" class="mb-2">
                        </div>
                        <button class="btn secondary-btn full-width mb-3" onclick="app.profile.uploadProfessionalDocs()">Sync Files</button>
                        <button class="btn primary-btn full-width" onclick="app.profile.saveDocSettings()">Update Pro Info</button>
                        <!-- TEMPORARY DEVELOPMENT TEST BUTTON – REMOVE BEFORE PRODUCTION -->
                        <button class="btn danger-btn full-width mt-2" onclick="app.auth.loginTestDoctor()">
                            Login as Test Doctor (Development Only)
                        </button>
                    </div>
                    ` : `
                    <div class="card stagger-3">
                        <div class="card-header"><h2>Special Access</h2></div>
                        <p class="text-muted mb-4">Are you a healthcare professional? Secure your official doctor account to start providing care.</p>
                        <button class="btn secondary-btn full-width" onclick="app.ui.showDoctorApply()">Apply for Doctor Role</button>
                    </div>
                    `}
                </div>
            `;
            const mainView = document.getElementById('mainView');
            if (mainView) mainView.innerHTML = html;
            app.i18n.apply();
        },

        showDoctorApply() {
            const html = `
                <div class="card" style="max-width:500px; margin: 40px auto;">
                    <div class="card-header"><h2 data-i18n="apply_doctor">Apply as Doctor</h2></div>
                    <div class="form-group">
                        <label data-i18n="license_label">Upload License/Cert (PDF/Image)</label>
                        <input type="file" id="doctorLicenseFile" accept="image/*,.pdf">
                    </div>
                    <button class="btn primary-btn full-width" onclick="app.patient.applyForDoctor()">Submit Application</button>
                    <button class="btn text-btn full-width mt-2" onclick="app.ui.renderPatientDashboard()">Cancel</button>
                </div>
            `;
            const mainView = document.getElementById('mainView');
            if (mainView) mainView.innerHTML = html;
            app.i18n.apply();
        },

        async renderAppointments() {
            try {
                const isDoc = app.user.activeRole === 'doctor';
                const apts = await app.api('/clinical/appointments');
                
                const html = `
                    <div class="content-header">
                        <h1 class="page-title" data-i18n="nav_appointments">Appointments</h1>
                        ${!isDoc ? `<button class="btn primary-btn" onclick="app.ui.showAptBooking()"><i class="fa-solid fa-plus"></i> ${app.translations[app.lang].book_apt}</button>` : ''}
                    </div>
                    <div class="content-grid">
                        ${apts.length ? apts.map(a => {
                            const partnerName = isDoc ? (a.patientId?.name || 'Patient') : (a.doctorId?.name || 'Doctor');
                            const dte = new Date(a.date).toLocaleDateString(app.lang==='ar'?'ar-EG':'en-US');
                            return `
                                <div class="card stagger-1">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <div>
                                            <div style="font-weight:700; font-size:18px; color:var(--primary);">${partnerName}</div>
                                            <div class="text-muted" style="font-size:14px;"><i class="fa-solid fa-calendar"></i> ${dte} | <i class="fa-solid fa-clock"></i> ${a.time}</div>
                                        </div>
                                        <span class="status-badge approved">${a.status}</span>
                                    </div>
                                </div>
                            `;
                        }).join('') : `<p class="text-center text-muted mt-5" data-i18n="no_apt">No appointments scheduled.</p>`}
                    </div>
                `;
                const mainView = document.getElementById('mainView');
                if (mainView) mainView.innerHTML = html;
                app.i18n.apply();
            } catch (err) {}
        },

        async showAptBooking() {
            try {
                const docs = await app.api('/doctors');
                const html = `
                    <div class="card" style="max-width:500px; margin: 40px auto;">
                        <div class="card-header"><h2>${app.translations[app.lang].book_apt}</h2></div>
                        <div class="form-group">
                            <label>Select Doctor</label>
                            <select id="aptDocId" class="full-width" style="padding:10px; border-radius:8px; border:1px solid var(--border);">
                                ${docs.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="form-group half">
                                <label data-i18n="date_label">Date</label>
                                <input type="date" id="aptDate" class="full-width" style="padding:10px; border-radius:8px; border:1px solid var(--border);">
                            </div>
                            <div class="form-group half">
                                <label data-i18n="time_label">Time</label>
                                <input type="time" id="aptTime" class="full-width" style="padding:10px; border-radius:8px; border:1px solid var(--border);">
                            </div>
                        </div>
                        <div class="text-right mt-3">
                            <button class="btn text-btn mr-2" onclick="app.ui.renderAppointments()">Cancel</button>
                            <button class="btn primary-btn" onclick="app.patient.confirmApt()">Book Now</button>
                        </div>
                    </div>
                `;
                const mainView = document.getElementById('mainView');
                if (mainView) mainView.innerHTML = html;
                app.i18n.apply();
            } catch (err) {}
        },


        toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('open');
                const overlay = document.getElementById('sidebarOverlay');
                if (overlay) overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
            }
        },

        closeSidebar() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
                const overlay = document.getElementById('sidebarOverlay');
                if (overlay) overlay.style.display = 'none';
            }
        },

        // Family Member UI Functions
        showAddFamilyMemberForm() {
            const form = document.getElementById('familyMemberFormContainer');
            if (form) {
                form.classList.remove('hidden');
                document.getElementById('familyFormTitle').textContent = 'Add Family Member';
                // Clear form fields
                document.getElementById('familyFullName').value = '';
                document.getElementById('familyAge').value = '';
                document.getElementById('familyDOB').value = '';
                document.getElementById('familyGender').value = '';
                document.getElementById('familyRelationship').value = '';
                document.getElementById('familyNationalId').value = '';
                document.getElementById('familyBloodType').value = '';
                document.getElementById('familyAllergies').value = '';
                document.getElementById('familyConditions').value = '';
                document.getElementById('familyMedications').value = '';
                document.getElementById('familyNotes').value = '';
                app.currentFamilyMemberId = null;
            }
        },

        hideFamilyMemberForm() {
            const form = document.getElementById('familyMemberFormContainer');
            if (form) {
                form.classList.add('hidden');
                app.currentFamilyMemberId = null;
            }
        },

        showEditFamilyMemberForm(memberId, member) {
            const form = document.getElementById('familyMemberFormContainer');
            if (form) {
                form.classList.remove('hidden');
                document.getElementById('familyFormTitle').textContent = 'Edit Family Member';
                document.getElementById('familyFullName').value = member.fullName || '';
                document.getElementById('familyAge').value = member.age || '';
                document.getElementById('familyDOB').value = member.dateOfBirth || '';
                document.getElementById('familyGender').value = member.gender || '';
                document.getElementById('familyRelationship').value = member.relationship || '';
                document.getElementById('familyNationalId').value = member.nationalId || '';
                document.getElementById('familyBloodType').value = member.bloodType || '';
                document.getElementById('familyAllergies').value = (member.allergies || []).join(', ');
                document.getElementById('familyConditions').value = (member.chronicConditions || []).join(', ');
                document.getElementById('familyMedications').value = (member.medications || []).join(', ');
                document.getElementById('familyNotes').value = member.medicalNotes || '';
                app.currentFamilyMemberId = memberId;
            }
        },

        async renderAdminPanel() {
            try {
                const apps = await app.api('/admin/applications');
                const users = await app.api('/admin/users');
                const html = `
                    <h1 class="page-title" data-i18n="admin_panel">Admin Panel</h1>
                    <div class="card mb-4">
                        <div class="card-header"><h2 data-i18n="pending_apps">Doctor Applications</h2></div>
                        <div class="table-container" style="overflow-x:auto;">
                            <table style="width:100%; border-collapse: collapse; min-width:600px;">
                                <thead>
                                    <tr style="text-align:left; border-bottom: 2px solid var(--border);">
                                        <th style="padding:12px;">User</th>
                                        <th style="padding:12px;">Document</th>
                                        <th style="padding:12px; text-align:right;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${apps.length ? apps.map(a => `
                                        <tr style="border-bottom: 1px solid var(--border);">
                                            <td style="padding:12px;">${a.userId?.name || a.userId}</td>
                                            <td style="padding:12px;"><a href="${a.docUrl}" target="_blank" class="text-btn">View License</a></td>
                                            <td style="padding:12px; text-align:right;">
                                                <button class="btn secondary-btn small mr-2" onclick="app.admin.reject('${a._id}')">Reject</button>
                                                <button class="btn primary-btn small" onclick="app.admin.approve('${a._id}')">Approve</button>
                                            </td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="3" style="text-align:center; padding:20px;">No pending applications</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                const mainView = document.getElementById('mainView');
                if (mainView) mainView.innerHTML = html;
                app.i18n.apply();
            } catch (err) {}
        },

        renderSettings() {
            const html = `
                <div class="content-header"><h1 class="page-title" data-i18n="nav_settings">Settings</h1></div>
                
                <!-- Preferences Card -->
                <div class="content-grid" style="max-width: 800px;">
                        <div class="card stagger-1">
                        <div class="card-header"><h2>Preferences</h2></div>
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0;">
                            <div><strong>Language / اللغة</strong></div>
                            <button class="btn secondary-btn small" onclick="app.i18n.toggle()">${app.lang === 'en' ? 'عربي' : 'English'}</button>
                        </div>
                    </div>

                    <!-- Family Members Management Card -->
                    <div class="card stagger-2">
                        <div class="card-header">
                            <h2>Manage Family Members</h2>
                            <button class="btn primary-btn small" onclick="app.ui.showAddFamilyMemberForm()">
                                <i class="fa-solid fa-person-plus"></i> Add Member
                            </button>
                        </div>
                        <div id="familyMembersContainer" style="padding: 15px 0;">
                            <p style="color: var(--text-muted); text-align: center; padding: 20px;">Loading family members...</p>
                        </div>
                    </div>

                    <!-- Add/Edit Family Member Form (Hidden) -->
                    <div id="familyMemberFormContainer" class="card stagger-2 hidden">
                        <div class="card-header">
                            <h2 id="familyFormTitle">Add Family Member</h2>
                            <button class="btn icon-btn" onclick="app.ui.hideFamilyMemberForm()"><i class="fa-solid fa-times"></i></button>
                        </div>
                        <form onsubmit="app.family.saveFamilyMember(event)">
                            <div class="form-group">
                                <label>Full Name *</label>
                                <input type="text" id="familyFullName" required placeholder="Full name">
                            </div>

                            <div class="form-row">
                                <div class="form-group half">
                                    <label>Age</label>
                                    <input type="number" id="familyAge" min="1" max="150" placeholder="Age">
                                </div>
                                <div class="form-group half">
                                    <label>Date of Birth</label>
                                    <input type="date" id="familyDOB">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group half">
                                    <label>Gender *</label>
                                    <select id="familyGender" required>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="form-group half">
                                    <label>Relationship *</label>
                                    <select id="familyRelationship" required>
                                        <option value="">Select Relationship</option>
                                        <option value="spouse">Spouse</option>
                                        <option value="son">Son</option>
                                        <option value="daughter">Daughter</option>
                                        <option value="parent">Parent</option>
                                        <option value="sibling">Sibling</option>
                                        <option value="dependent">Dependent</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>National ID (Optional)</label>
                                <input type="text" id="familyNationalId" placeholder="14-digit national ID">
                            </div>

                            <div class="form-row">
                                <div class="form-group half">
                                    <label>Blood Type</label>
                                    <select id="familyBloodType">
                                        <option value="">Select Blood Type</option>
                                        <option value="O+">O+</option><option value="O-">O-</option>
                                        <option value="A+">A+</option><option value="A-">A-</option>
                                        <option value="B+">B+</option><option value="B-">B-</option>
                                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div class="form-group half">
                                    <label>Allergies (comma separated)</label>
                                    <input type="text" id="familyAllergies" placeholder="e.g., Peanuts, Penicillin">
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Chronic Conditions (comma separated)</label>
                                <input type="text" id="familyConditions" placeholder="e.g., Diabetes, Hypertension">
                            </div>

                            <div class="form-group">
                                <label>Current Medications (comma separated)</label>
                                <input type="text" id="familyMedications" placeholder="e.g., Metformin, Lisinopril">
                            </div>

                            <div class="form-group">
                                <label>Medical Notes</label>
                                <textarea id="familyNotes" style="resize: vertical; min-height: 80px; padding: 12px;" placeholder="Add any additional medical notes..."></textarea>
                            </div>

                            <button type="submit" class="btn primary-btn full-width">Save Family Member</button>
                        </form>
                    </div>

                    <button class="btn secondary-btn full-width mt-4" onclick="app.auth.logout()">Logout</button>
                </div>
            `;
            const mainView = document.getElementById('mainView');
            if (mainView) mainView.innerHTML = html;
            app.family.loadFamilyMembers();
            app.i18n.apply();
        },

        renderDoctorDashboard() {
            const mainView = document.getElementById('mainView');
            if (mainView) {
                mainView.innerHTML = `
                    <div class="card" style="margin-top: 50px; text-align:center; padding: 60px 40px;">
                        <i class="fa-solid fa-hospital-user" style="font-size: 40px; color: var(--primary); margin-bottom:20px;"></i>
                        <h1 class="page-title" data-i18n="doctor_welcome">Welcome, Doctor</h1>
                        <p class="text-muted" data-i18n="doctor_instruct">Search for a patient by National ID to start.</p>
                    </div>
                `;
            }
            app.i18n.apply();
        },

        renderDoctorWorkspace() {
            const p = app.currentPatient;
            if (!p) return this.renderDoctorDashboard();

            const html = `
                <div class="content-header" style="flex-wrap: wrap; gap: 15px;">
                    <h1 class="page-title m-0">Patient: ${p.name}</h1>
                </div>
                <div class="dashboard-widgets">
                    <div class="card stagger-1">
                        <div class="card-header"><h2>Write Prescription</h2></div>
                        <div class="form-group"><label>Medications</label><input type="text" id="rxMeds"></div>
                        <div class="form-group"><label>Notes</label><input type="text" id="rxNotes"></div>
                        <div class="form-group">
                            <label>File Attachment</label>
                            <div style="display:flex; gap:10px;">
                                <input type="file" id="doctorRxFile" accept="image/*,.pdf" style="flex:1;">
                                <button class="btn secondary-btn small" onclick="app.ui.showCamera(); app.doctor.activeCapture=true;"><i class="fa-solid fa-camera"></i></button>
                            </div>
                        </div>
                        <button class="btn primary-btn full-width mt-3" onclick="app.doctor.prescribe()">Send Prescription</button>
                    </div>
                    <div class="card stagger-2">
                        <div class="card-header"><h2>Prescriptions History</h2></div>
                        <div id="doctorPrescriptionsList"></div>
                    </div>
                    <div class="card stagger-3">
                        <div class="card-header"><h2>Shared Documents</h2></div>
                        <div id="doctorDocumentsList"></div>
                    </div>
                </div>
            `;
            const mainView = document.getElementById('mainView');
            if (mainView) mainView.innerHTML = html;
            app.doctor.loadPrescriptions();
            app.i18n.apply();
        }
    },

    clinical: {
        handlePrescriptionFile(e) {
            const file = e.target.files[0];
            if (!file) return;
            // Handle file selection and preview if needed
        },
        async captureImage() {
            const video = document.getElementById('cameraVideo');
            const canvas = document.getElementById('cameraCanvas');
            const context = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob(async (blob) => {
                const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const data = await app.apiUpload('/users/upload', formData);
                    const url = data.url;
                    
                    const isDoc = app.user.activeRole === 'doctor';
                    const patientId = isDoc ? app.currentPatient.id : app.user.id;
                    
                    await app.api('/clinical/prescribe', 'POST', { 
                        patientId, 
                        medications: isDoc ? "Doctor Camera Capture" : "Patient Capture", 
                        notes: isDoc ? "Captured by doctor during session" : "Captured via system camera", 
                        fileUrl: url 
                    });
                    app.ui.toast("Captured and Uploaded", "success");
                    app.ui.hideCamera();
                    if (isDoc) app.doctor.loadPrescriptions();
                    else app.patient.loadPrescriptions();
                } catch (err) {}
            }, 'image/jpeg');
        }
    },

    patient: {
        async applyForDoctor() {
            const fileInput = document.getElementById('doctorLicenseFile');
            if (!fileInput || !fileInput.files.length) return app.ui.toast("Select a file", "error");
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            try {
                const data = await app.apiUpload('/users/upload', formData);
                await app.api('/apply', 'POST', { docUrl: data.url });
                app.ui.toast("Application submitted", "success");
                app.ui.renderPatientDashboard();
            } catch (err) {}
        },
        async confirmApt() {
            const docId = document.getElementById('aptDocId').value;
            const date = document.getElementById('aptDate').value;
            const time = document.getElementById('aptTime').value;
            if (!date || !time) return app.ui.toast("Select date and time", "error");
            try {
                await app.api('/clinical/appointments', 'POST', { doctorId: docId, date, time });
                app.ui.toast("Booked!", "success");
                app.ui.renderAppointments();
            } catch (err) {}
        },
        async exportToPDF(rxId) {
            try {
                const rx = await app.api(`/clinical/prescriptions/${rxId}`);
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ unit: 'pt', format: 'a4' });

                const leftX = 40;
                const rightX = 350;
                const topY = 60;

                // Doctor info (top left)
                doc.setFontSize(12);
                doc.text(`Dr. ${rx.doctorName || ''}`, leftX, topY);
                if (rx.doctorPhone) doc.text(`Phone: ${rx.doctorPhone}`, leftX, topY + 16);
                if (rx.doctorAddress) doc.text(`${rx.doctorAddress}`, leftX, topY + 32);

                // Patient info (top right)
                const patientName = rx.patientName || (app.user && app.user.name ? app.user.name : 'Patient');
                const patientPhone = rx.patientPhone || '';
                doc.text(`Patient: ${patientName}`, rightX, topY);
                if (patientPhone) doc.text(`Phone: ${patientPhone}`, rightX, topY + 16);

                // Date
                doc.setFontSize(10);
                doc.text(`Date: ${new Date(rx.date).toLocaleString()}`, leftX, topY + 64);
                doc.line(leftX, topY + 72, 555, topY + 72);

                // Medications
                doc.setFontSize(14);
                doc.text('Medications:', leftX, topY + 100);
                doc.setFontSize(12);
                const meds = rx.medications || '(no medications)';
                doc.text(meds, leftX, topY + 120, { maxWidth: 520 });

                // Notes
                if (rx.notes) {
                    doc.setFontSize(12);
                    doc.text('Notes:', leftX, topY + 200);
                    doc.setFontSize(11);
                    doc.text(rx.notes, leftX, topY + 220, { maxWidth: 520 });
                }

                doc.save(`Prescription_${rxId}.pdf`);
            } catch (err) {
                app.ui.toast("PDF Export failed", "error");
            }
        },
        async uploadPrescription() {
            const fileInput = document.getElementById('patientFileRx');
            if (!fileInput || !fileInput.files.length) return app.ui.toast("Select a file to upload", "error");
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            try {
                const rx = await app.apiUpload('/clinical/patient/upload', formData);
                app.ui.toast("File uploaded", "success");
                this.loadPrescriptions();
                fileInput.value = '';
            } catch (err) {
                app.ui.toast("Upload failed", "error");
            }
        },
        async loadPrescriptions() {
            try {
                const prescriptions = await app.api('/clinical/prescriptions');
                const container = document.getElementById('patientPrescriptionsList');
                if (!container) return;
                if (prescriptions.length === 0) {
                    container.innerHTML = `<p class="text-muted">${app.translations[app.lang].no_medical_records || 'No medical records found'}</p>`;
                    return;
                }
                container.innerHTML = prescriptions.reverse().map(rx => `
                    <div class="card prescription-card mb-3">
                        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                            <strong>${rx.medications || 'No medications'}</strong>
                            <small>${new Date(rx.date).toLocaleDateString()}</small>
                        </div>
                        <div class="card-body">
                            <p>${rx.notes || 'No notes'}</p>
                            ${rx.fileUrl ? `<a href="${rx.fileUrl}" target="_blank" class="link">View Attachment</a>` : ''}
                        </div>
                        <div class="card-footer">
                            <button onclick="app.patient.exportToPDF('${rx.id}')" class="btn primary-btn btn-sm">
                                <i class="fa-solid fa-download"></i> Export
                            </button>
                        </div>
                    </div>
                `).join('');
            } catch (err) {
                app.ui.toast('Failed to load prescriptions', 'error');
            }
        }
    },

    doctor: {
        async searchPatient() {
            const id = document.getElementById('patientSearchInput').value;
            try {
                const p = await app.api(`/profile?id=${id}`);
                app.currentPatient = p;
                app.ui.renderDoctorWorkspace();
            } catch (err) {
                app.ui.toast("Patient not found", "error");
            }
        },
        async prescribe() {
            // ensure the doctor's account has been approved before submitting
            // allow bypass in devMode or when backend auto-approves doctors
            const bypass = (app.config && (app.config.devMode || app.config.autoApproveDoctors));
            if (app.user.verificationStatus !== 'approved' && !bypass) {
                app.ui.toast('Your doctor account is not approved yet.', 'error');
                return;
            }

            const meds = document.getElementById('rxMeds').value;
            const notes = document.getElementById('rxNotes').value;
            const fileInput = document.getElementById('doctorRxFile');
            if (!meds) return app.ui.toast("Meds cannot be empty", "error");
            let fileUrl = null;
            if (fileInput?.files.length) {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                try {
                    const data = await app.apiUpload('/users/upload', formData);
                    fileUrl = data.url;
                } catch (err) { return; }
            }
            try {
                const resp = await app.api('/clinical/prescribe', 'POST', { patientId: app.currentPatient.id, medications: meds, notes, fileUrl });
                app.ui.toast(resp.msg || "Prescription sent successfully.", "success");
                this.loadPrescriptions();
            } catch (err) {
                // if server returns authorization errors, show message
                if (err.message) app.ui.toast(err.message, 'error');
            }
        },

        async loadPrescriptions() {
            if (!app.currentPatient) return;
            try {
                const list = await app.api(`/clinical/prescriptions?patientId=${app.currentPatient.id}`);
                // categorize entries
                const prescriptions = list.filter(r => r.category === 'prescription');
                const documents = list.filter(r => r.category !== 'prescription');

                const presContainer = document.getElementById('doctorPrescriptionsList');
                const docContainer = document.getElementById('doctorDocumentsList');

                if (presContainer) {
                    presContainer.innerHTML = prescriptions.length === 0
                        ? `<p>${app.translations[app.lang].no_history || 'No history.'}</p>`
                        : prescriptions.reverse().map(rx => `
                            <div class="card mb-2">
                                <strong>${rx.medications || '(no medications)'}</strong><br><small>${new Date(rx.date).toLocaleDateString()}</small>
                                ${rx.fileUrl ? `<br><a href="${rx.fileUrl}" target="_blank">Attachment</a>` : ''}
                            </div>
                        `).join('');
                }

                if (docContainer) {
                    docContainer.innerHTML = documents.length === 0
                        ? `<p>${app.translations[app.lang].no_history || 'No history.'}</p>`
                        : documents.reverse().map(rx => `
                            <div class="card mb-2">
                                <small>${new Date(rx.date).toLocaleDateString()}</small>
                                ${rx.notes ? `<p>${rx.notes}</p>` : ''}
                                ${rx.fileUrl ? `<a href="${rx.fileUrl}" target="_blank">View Document</a>` : ''}
                            </div>
                        `).join('');
                }
            } catch (err) {}
        }
    },

    // Simple messaging UI / client helper to ensure conversations are fetched
    // correctly and refreshed automatically when open.
    messaging: {
        currentPartner: null,
        refreshHandle: null,
        renderView() {
            const main = document.getElementById('mainView');
            if (!main) return;
            const partnerPrefill = app.currentPatient ? app.currentPatient.id : '';
            main.innerHTML = `
                <div class="content-header"><h1 class="page-title">Messages</h1></div>
                <div style="max-width:800px;margin:0 auto;">
                    <div style="display:flex;gap:8px;margin-bottom:8px;">
                        <input id="msgPartnerId" placeholder="Partner ID" value="${partnerPrefill}" style="flex:1;padding:8px;">
                        <button class="btn primary-btn" onclick="app.messaging.openConversation(document.getElementById('msgPartnerId').value)">Open</button>
                    </div>
                    <div id="messagesContainer" style="min-height:300px;border:1px solid var(--border);padding:10px;overflow:auto;background:var(--bg);"></div>
                    <div style="display:flex;gap:8px;margin-top:8px;">
                        <input id="msgText" placeholder="Write a message..." style="flex:1;padding:8px;">
                        <button class="btn primary-btn" onclick="app.messaging.send()">Send</button>
                    </div>
                </div>
            `;
        },
        async openConversation(partnerId) {
            if (!partnerId) return app.ui.toast('Enter partner id', 'error');
            this.currentPartner = String(partnerId);
            await this.loadConversation();
            this.startAutoRefresh();
        },
        async loadConversation() {
            if (!this.currentPartner) return;
            try {
                const msgs = await app.api(`/messages/${this.currentPartner}`);
                const container = document.getElementById('messagesContainer');
                if (!container) return;
                container.innerHTML = msgs.map(m => `
                    <div style="margin-bottom:8px;">
                        <div style="font-size:12px;color:var(--text-muted);">${m.senderId === app.user.id ? 'You' : 'Partner'} • ${new Date(m.date).toLocaleString()}</div>
                        <div style="padding:8px;border-radius:6px;background:${m.senderId === app.user.id ? '#e6f7ff' : '#f4f4f4'};">${m.content}</div>
                    </div>
                `).join('');
                container.scrollTop = container.scrollHeight;
            } catch (err) {
                console.error('Failed to load conversation', err);
            }
        },
        async send() {
            const txt = document.getElementById('msgText')?.value;
            if (!txt || !this.currentPartner) return app.ui.toast('Open a conversation and enter a message', 'error');
            try {
                await app.api('/messages', 'POST', { receiverId: this.currentPartner, content: txt });
                document.getElementById('msgText').value = '';
                await this.loadConversation();
            } catch (err) {
                app.ui.toast('Send failed', 'error');
            }
        },
        startAutoRefresh() {
            this.stopAutoRefresh();
            this.refreshHandle = setInterval(() => this.loadConversation(), 4000);
        },
        stopAutoRefresh() {
            if (this.refreshHandle) clearInterval(this.refreshHandle);
            this.refreshHandle = null;
        }
    },


    pharmacy: {
        async renderSearch() {
            const container = document.getElementById('pharmacySearchSection');
            if (!container) return;
            
            try {
                let pharmacies;
                try {
                    const pos = await app.geo.getPosition();
                    pharmacies = await app.api(`/users/pharmacies/nearby?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`, 'GET');
                } catch (_) {
                    pharmacies = await app.api('/users/pharmacies', 'GET');
                }

                let html = `
                    <div class="search-box" style="padding: 20px;">
                        <h3>${app.translations[app.lang].nav_pharmacy || 'Pharmacies'}</h3>
                        <input type="text" id="pharmacySearch" placeholder="${app.translations[app.lang].search_pharmacy_placeholder || 'Search pharmacies...'}" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid var(--border); border-radius: 6px;">
                        <button onclick="app.pharmacy.searchPharmacies()" class="btn primary-btn" style="width: 100%;">
                            <i class="fa-solid fa-search"></i> ${app.translations[app.lang].search_btn || 'Search'}
                        </button>
                    </div>
                    <div id="pharmacyList" style="padding: 20px;"></div>
                `;
                container.innerHTML = html;
                this.displayPharmacies(pharmacies);
            } catch (err) {
                const container = document.getElementById('pharmacySearchSection');
                if (container) {
                    container.innerHTML = `<p class="error">Failed to load pharmacies</p>`;
                }
            }
        },
        async searchPharmacies() {
            const query = document.getElementById('pharmacySearch')?.value || '';
            try {
                let pharmacies;
                try {
                    const pos = await app.geo.getPosition();
                    pharmacies = await app.api(`/users/pharmacies/nearby?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`, 'GET');
                } catch (err) {
                    pharmacies = await app.api('/users/pharmacies', 'GET');
                }

                const filtered = pharmacies.filter(p => 
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.address.toLowerCase().includes(query.toLowerCase()) ||
                    p.city.toLowerCase().includes(query.toLowerCase())
                );
                this.displayPharmacies(filtered);
            } catch (err) {
                app.ui.toast('Search failed', 'error');
            }
        },
        displayPharmacies(pharmacies) {
            const list = document.getElementById('pharmacyList');
            if (!list) return;
            
            if (pharmacies.length === 0) {
                const msg = app.translations[app.lang].no_pharmacies || 'No pharmacies found';
                list.innerHTML = `<p class="text-muted">${msg}</p>`;
                return;
            }
            
            list.innerHTML = pharmacies.map(p => `
                <div class="card mb-2" style="padding: 15px;">
                    <h4>${p.name}${p.distance ? ` - ${p.distance} km` : ''}</h4>
                    <p><i class="fa-solid fa-map-marker-alt"></i> ${p.address}</p>
                    <p><i class="fa-solid fa-phone"></i> <a href="tel:${p.phone}">${p.phone}</a></p>
                    <p><i class="fa-solid fa-city"></i> ${p.city}</p>
                    <button onclick="window.open('https://maps.google.com/maps/search/${encodeURIComponent(p.name + ' ' + p.address)}')" class="btn secondary-btn" style="width: 100%;">
                        <i class="fa-solid fa-directions"></i> ${app.translations[app.lang].get_directions || 'Get Directions'}
                    </button>
                </div>
            `).join('');
        }
    },

    i18n: {
        // expose translation keys for pharmacy settings if needed
        // (no changes here yet)

        init() {
            const saved = localStorage.getItem('mr_lang');
            if (saved) app.lang = saved;
            this.apply();
        },
        switchLang() {
            app.lang = app.lang === 'en' ? 'ar' : 'en';
            localStorage.setItem('mr_lang', app.lang);
            this.apply();
            // Re-render current view without full reload
            if (app.user) {
                app.ui.updateNav(app.currentView || 'dashboard');
            }
        },
        toggle() {
            this.switchLang();
        },
        apply() {
            document.documentElement.setAttribute('dir', app.lang === 'ar' ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', app.lang);
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (app.translations[app.lang][key]) el.textContent = app.translations[app.lang][key];
            });
            const input = document.getElementById('langText');
            if (input) input.textContent = app.translations[app.lang].lang_name;
        }
    },

    admin: {
        async approve(id) {
            try {
                await app.api(`/admin/applications/${id}`, 'PUT', { status: 'approved' });
                app.ui.toast("Approved", "success");
                app.ui.renderAdminPanel();
            } catch (err) {}
        },
        async reject(id) {
            try {
                await app.api(`/admin/applications/${id}`, 'PUT', { status: 'rejected' });
                app.ui.toast("Rejected", "info");
                app.ui.renderAdminPanel();
            } catch (err) {}
        }
    },

    // ════════════════════════════════════════════════════════════════
    // FAMILY MEMBER MANAGEMENT
    // ════════════════════════════════════════════════════════════════
    family: {
        async loadFamilyMembers() {
            try {
                const members = await app.api('/family', 'GET');
                const container = document.getElementById('familyMembersContainer');
                if (!container) return;

                if (!members || members.length === 0) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
                            <i class="fa-solid fa-people-group" style="font-size: 40px; margin-bottom: 10px; opacity: 0.5;"></i>
                            <p>No family members added yet.</p>
                            <button class="btn primary-btn small" onclick="app.ui.showAddFamilyMemberForm()" style="margin-top: 15px;">
                                <i class="fa-solid fa-person-plus"></i> Add Family Member
                            </button>
                        </div>
                    `;
                    return;
                }

                let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
                
                members.forEach(member => {
                    const relationshipLabel = {
                        spouse: 'Spouse',
                        son: 'Son',
                        daughter: 'Daughter',
                        parent: 'Parent',
                        sibling: 'Sibling',
                        dependent: 'Dependent',
                        other: 'Other'
                    }[member.relationship] || member.relationship;

                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-hover); border-radius: var(--radius);">
                            <div style="flex: 1;">
                                <strong style="display: block; margin-bottom: 4px;">${member.fullName}</strong>
                                <small style="color: var(--text-muted);">
                                    ${relationshipLabel} • Age: ${member.age} • Gender: ${member.gender === 'male' ? '♂ Male' : member.gender === 'female' ? '♀ Female' : 'Other'}
                                </small>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn icon-btn small" onclick="app.ui.showEditFamilyMemberForm('${member.id}', JSON.parse('${JSON.stringify(member).replace(/'/g, "\\'")}'))" title="Edit">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="btn icon-btn small" onclick="app.family.deleteFamilyMember('${member.id}')" title="Delete" style="color: var(--danger);">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                html += '</div>';
                container.innerHTML = html;
            } catch (err) {
                const container = document.getElementById('familyMembersContainer');
                if (container) {
                    container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Error loading family members</p>';
                }
            }
        },

        async saveFamilyMember(e) {
            e.preventDefault();

            const fullName = document.getElementById('familyFullName').value.trim();
            const age = document.getElementById('familyAge').value;
            const dob = document.getElementById('familyDOB').value;
            const gender = document.getElementById('familyGender').value;
            const relationship = document.getElementById('familyRelationship').value;
            const nationalId = document.getElementById('familyNationalId').value.trim();
            const bloodType = document.getElementById('familyBloodType').value;
            const allergiesStr = document.getElementById('familyAllergies').value;
            const conditionsStr = document.getElementById('familyConditions').value;
            const medicationsStr = document.getElementById('familyMedications').value;
            const medicalNotes = document.getElementById('familyNotes').value;

            // ════════════════════════════════════════════════════════════════
            // FRONTEND VALIDATION
            // ════════════════════════════════════════════════════════════════

            // Full Name
            const nameVal = app.validators.name(fullName, 'Family member name');
            if (!nameVal.valid) {
                app.ui.toast(nameVal.message, 'error');
                return;
            }

            // Age or DOB (at least one required)
            let memberAge = null;
            let memberDOB = null;

            if (age) {
                const ageVal = app.validators.age(age);
                if (!ageVal.valid) {
                    app.ui.toast(ageVal.message, 'error');
                    return;
                }
                memberAge = ageVal.value;
            } else if (dob) {
                const dobVal = app.validators.dateOfBirth(dob);
                if (!dobVal.valid) {
                    app.ui.toast(dobVal.message, 'error');
                    return;
                }
                memberDOB = dobVal.value;
            } else {
                app.ui.toast('Please provide either age or date of birth', 'error');
                return;
            }

            // Gender
            const genderVal = app.validators.gender(gender);
            if (!genderVal.valid) {
                app.ui.toast(genderVal.message, 'error');
                return;
            }

            // Relationship
            const relVal = app.validators.relationship(relationship);
            if (!relVal.valid) {
                app.ui.toast(relVal.message, 'error');
                return;
            }

            // National ID (if provided)
            if (nationalId) {
                const idVal = app.validators.nationalId(nationalId);
                if (!idVal.valid) {
                    app.ui.toast(`Family member national ID: ${idVal.message.toLowerCase()}`, 'error');
                    return;
                }
            }

            // ════════════════════════════════════════════════════════════════
            // SEND TO BACKEND
            // ════════════════════════════════════════════════════════════════

            try {
                const body = {
                    fullName: nameVal.value,
                    age: memberAge,
                    dateOfBirth: memberDOB,
                    gender: genderVal.value,
                    relationship: relVal.value,
                    nationalId: nationalId || null,
                    bloodType: bloodType || null,
                    allergies: allergiesStr ? allergiesStr.split(',').map(s => s.trim()).filter(s => s) : [],
                    chronicConditions: conditionsStr ? conditionsStr.split(',').map(s => s.trim()).filter(s => s) : [],
                    medications: medicationsStr ? medicationsStr.split(',').map(s => s.trim()).filter(s => s) : [],
                    medicalNotes: medicalNotes || null
                };

                let url = '/family';
                let method = 'POST';
                let successMsg = 'Family member added successfully';

                // If editing
                if (app.currentFamilyMemberId) {
                    url = `/family/${app.currentFamilyMemberId}`;
                    method = 'PUT';
                    successMsg = 'Family member updated successfully';
                }

                await app.api(url, method, body);
                app.ui.toast(successMsg, 'success');
                app.ui.hideFamilyMemberForm();
                app.family.loadFamilyMembers();
            } catch (err) {
                app.ui.toast(err.message || 'Error saving family member', 'error');
            }
        },

        async deleteFamilyMember(memberId) {
            if (!confirm('Are you sure you want to delete this family member?')) return;

            try {
                await app.api(`/family/${memberId}`, 'DELETE');
                app.ui.toast('Family member deleted', 'success');
                app.family.loadFamilyMembers();
            } catch (err) {
                app.ui.toast(err.message || 'Error deleting family member', 'error');
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.i18n.init();
    app.auth.init();
});
