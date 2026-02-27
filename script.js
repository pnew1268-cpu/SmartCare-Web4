const app = {
    user: null,
    lang: 'en',
    currentChatPartner: null,
    currentPatient: null, // Only used by doctor

    translations: {
        en: {
            lang_name: "Arabic", login_title: "Welcome Back", national_id: "National ID",
            login_id_label: "Phone Number or National ID",
            password: "Password", login_btn: "Login", no_account: "Don't have an account?",
            register_link: "Register here", register_title: "Create Account", role: "Role",
            role_patient: "Patient", role_doctor: "Doctor", full_name: "Full Name",
            phone: "Phone Number", email: "Email", register_btn: "Register",
            has_account: "Already have an account?", login_link: "Login here",
            nav_dashboard: "Dashboard", my_profile: "My Profile", nav_messages: "Messages",
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
            chat_title: "Messages", type_message: "Type a message...", send_msg: "Send",
            no_messages: "No messages yet. Say hello!", select_chat_partner: "Select a patient to start chatting",
            back_to_search: "Back to Search",
            approve: "Approve", reject: "Reject", apply_doctor: "Apply for Doctor Role", license_label: "Upload License/Cert (PDF/Image)",
            switch_role: "Switch to", status_pending: "Pending", status_approved: "Approved", status_rejected: "Rejected",
            verify_title: "Verify Your Account", verify_desc: "A 4-digit code was sent to your phone/email. Enter it below:",
            verify_btn: "Verify", verify_error: "Invalid code. Please try again.", verify_success: "Account verified successfully!",
            nav_appointments: "Appointments", book_apt: "Book Appointment", date_label: "Select Date", time_label: "Select Time",
            no_apt: "No appointments scheduled.", my_appointments: "My Appointments"
        },
        ar: {
            lang_name: "English", login_title: "مرحباً بعودتك", national_id: "الرقم القومي",
            login_id_label: "رقم الهاتف أو الرقم القومي",
            password: "كلمة المرور", login_btn: "تسجيل الدخول", no_account: "ليس لديك حساب؟",
            register_link: "سجل هنا", register_title: "إنشاء حساب", role: "الدور",
            role_patient: "مريض", role_doctor: "طبيب", full_name: "الاسم الكامل",
            phone: "رقم الهاتف", email: "البريد الإلكتروني", register_btn: "تسجيل",
            has_account: "لديك حساب بالفعل؟", login_link: "سجل الدخول هنا",
            nav_dashboard: "لوحة التحكم", my_profile: "ملفي الشخصي", nav_messages: "الرسائل",
            nav_patients: "المرضى", search_btn: "بحث", search_patient_placeholder: "أدخل الرقم القومي للمريض...",
            search_doc_placeholder: "أدخل اسم الدكتور...",
            select_doc_msg: "اختر طبيباً للمراسلة...",
            prescriptions_upload: "تحميل ملف طبي",
            personal_info: "المعلومات الشخصية", edit: "تعديل", save: "حفظ", cancel: "إلغاء",
            my_prescriptions: "الروشتات الطبية", doctor_welcome: "مرحباً بك، دكتور",
            doctor_instruct: "استخدم شريط البحث أعلاه للعثور على مريض باستخدام الرقم القومي.",
            prescribe_new: "كتابة روشتة جديدة", medications: "الأدوية", notes: "ملاحظات الطبيب",
            send_prescription: "إرسال الروشتة", no_prescriptions: "لا توجد روشتات.",
            prescribed_by: "وصفها د. ", patient_workspace: "ملف المريض الحالى",
            chat_title: "الرسائل", type_message: "اكتب رسالة...", send_msg: "إرسال",
            no_messages: "لا توجد رسائل. ابدأ المحادثة!", select_chat_partner: "اختر مريضاً لبدء المحادثة",
            back_to_search: "العودة للبحث",
            admin_panel: "لوحة التحكم", pending_apps: "طلبات الأطباء", approve: "موافقة", 
            reject: "رفض", apply_doctor: "التقديم كطبيب", license_label: "تحميل الرخصة (PDF/صورة)",
            switch_role: "التبديل إلى", status_pending: "قيد الانتظار", status_approved: "تمت الموافقة", status_rejected: "مرفوض",
            verify_title: "تأكيد حسابك", verify_desc: "تم إرسال كود من 4 أرقام لهاتفك/بريدك. أدخله أدناه:",
            verify_btn: "تأكيد", verify_error: "الكود غير صحيح. حاول مرة أخرى.", verify_success: "تم تأكيد الحساب بنجاح!"
        }
    },

    api: async (url, method = 'GET', body = null) => {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('mr_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        const baseUrl = window.location.protocol === 'file:' ? 'http://localhost:5000/api' : '/api';
        
        try {
            const res = await fetch(`${baseUrl}${url}`, options);
            
            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                const text = await res.text();
                data = { msg: text || 'Server Error' };
            }

            if (!res.ok) throw new Error(data.msg || 'Something went wrong');
            return data;
        } catch (err) {
            console.error(`API Error (${url}):`, err);
            app.ui.toast(err.message, "error");
            throw err;
        }
    },

    profile: {
        triggerUpload() {
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
                const res = await fetch('/api/users/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('mr_token')}` },
                    body: formData
                });
                const { url } = await res.json();
                
                await app.api('/users/profile', 'PUT', { profilePic: url });
                app.user.profilePic = url;
                app.profile.updateDisplay();
                app.ui.toast("Avatar updated", "success");
            } catch (err) {
                app.ui.toast("Upload failed", "error");
            }
        },
        updateDisplay() {
            const headerAvatar = document.getElementById('headerAvatar');
            if (!headerAvatar) return;
            const pic = app.user.profilePic;
            if (pic) {
                headerAvatar.innerHTML = `<img src="${pic}" alt="Profile">`;
            } else {
                headerAvatar.textContent = app.user.name.charAt(0).toUpperCase();
            }
            const heros = ['heroAvatar', 'heroAvatarDoc'];
            heros.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = pic ? `<img src="${pic}">` : (app.user.name ? app.user.name.charAt(0) : '');
            });
        }
    },

    auth: {
        init() {
            const token = localStorage.getItem('mr_token');
            if (token) {
                // Use raw fetch so we can silently clear a stale token
                // without showing a confusing error toast to the user
                const baseUrl = window.location.protocol === 'file:' ? 'http://localhost:5000/api' : '/api';
                fetch(`${baseUrl}/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                })
                .then(r => r.ok ? r.json() : Promise.reject())
                .then(user => { app.user = user; app.ui.showApp(); })
                .catch(() => {
                    // Token is stale or server restarted — clear silently
                    localStorage.removeItem('mr_token');
                    app.user = null;
                    app.ui.showLogin();
                });
                return;
            }
            app.ui.showLogin();
        },

        async register(e) {
            e.preventDefault();
            const u = {
                id:       document.getElementById('regId').value.trim(),
                name:     document.getElementById('regName').value.trim(),
                phone:    document.getElementById('regPhone').value.trim(),
                email:    document.getElementById('regEmail').value.trim() || null,
                password: document.getElementById('regPassword').value
            };

            if (!u.id || !u.name || !u.phone || !u.password) {
                app.ui.toast('Please fill in all required fields', 'error');
                return;
            }

            try {
                // Step 1: Register the account
                await app.api('/auth/register', 'POST', u);

                // Step 2: Automatically log in so the user doesn't have to
                const loginRes = await app.api('/auth/login', 'POST', {
                    loginId: u.phone,
                    password: u.password
                });
                localStorage.setItem('mr_token', loginRes.token);
                app.user = loginRes.user;
                app.ui.toast('Account created! Welcome, ' + loginRes.user.name, 'success');
                app.ui.showApp();
            } catch (err) {
                // Error toast is already shown by app.api() — nothing extra needed
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
                const res = await app.api('/auth/login', 'POST', { loginId, password });
                localStorage.setItem('mr_token', res.token);
                app.user = res.user;
                app.ui.toast('Welcome back, ' + res.user.name + '!', 'success');
                app.ui.showApp();
            } catch (err) {}
        },

        logout() {
            localStorage.removeItem('mr_token');
            app.user = null;
            location.reload();
        }
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
            if (headerName) headerName.textContent = app.user.name;
            app.profile.updateDisplay();

            const switcher = document.getElementById('roleSwitcher');
            if (app.user.roles && app.user.roles.length > 1) {
                switcher?.classList.remove('hidden');
                const label = document.getElementById('currentRoleLabel');
                if (label) label.textContent = app.translations[app.lang][`role_${app.user.activeRole}`] || app.user.activeRole;
            } else {
                switcher?.classList.add('hidden');
            }

            const nav = document.getElementById('navMenu');
            if (!nav) return;
            let navHtml = '';
            
            if (app.user.activeRole === 'patient') {
                navHtml = `
                    <a href="#" class="nav-item active" onclick="app.ui.renderPatientDashboard(); return false;">
                        <i class="fa-solid fa-user"></i> <span data-i18n="my_profile">My Profile</span>
                    </a>
                    <a href="#" class="nav-item" onclick="app.ui.renderChatView(); return false;">
                        <i class="fa-solid fa-message"></i> <span data-i18n="nav_messages">Messages</span>
                    </a>
                    <a href="#" class="nav-item" onclick="app.ui.renderAppointments(); return false;">
                        <i class="fa-solid fa-calendar-check"></i> <span data-i18n="nav_appointments">Appointments</span>
                    </a>
                `;
                document.getElementById('doctorSearch')?.classList.add('hidden');
                document.getElementById('patientDoctorSelect')?.classList.remove('hidden');
                this.renderPatientDashboard();
            } else if (app.user.activeRole === 'doctor') {
                navHtml = `
                    <a href="#" class="nav-item active" onclick="app.ui.renderDoctorDashboard(); return false;">
                        <i class="fa-solid fa-hospital-user"></i> <span data-i18n="nav_patients">Patients</span>
                    </a>
                    <a href="#" class="nav-item" onclick="app.ui.renderChatView(); return false;">
                        <i class="fa-solid fa-message"></i> <span data-i18n="nav_messages">Messages</span>
                    </a>
                    <a href="#" class="nav-item" onclick="app.ui.renderAppointments(); return false;">
                        <i class="fa-solid fa-calendar-check"></i> <span data-i18n="nav_appointments">Appointments</span>
                    </a>
                `;
                document.getElementById('doctorSearch')?.classList.remove('hidden');
                document.getElementById('patientDoctorSelect')?.classList.add('hidden');
                this.renderDoctorDashboard();
            } else if (app.user.activeRole === 'admin') {
                navHtml = `
                    <a href="#" class="nav-item active" onclick="app.ui.renderAdminPanel(); return false;">
                        <i class="fa-solid fa-shield-halved"></i> <span data-i18n="admin_panel">Admin Panel</span>
                    </a>
                `;
                document.getElementById('doctorSearch')?.classList.add('hidden');
                document.getElementById('patientDoctorSelect')?.classList.add('hidden');
                this.renderAdminPanel();
            }

            navHtml += `
                <a href="#" class="nav-item" onclick="app.ui.renderSettings(); return false;">
                    <i class="fa-solid fa-cog"></i> <span data-i18n="nav_settings">Settings</span>
                </a>
            `;
            nav.innerHTML = navHtml;
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

        async renderPatientDashboard() {
            const p = app.user;
            const html = `
                <div class="profile-hero stagger-1" style="text-align:center; padding: 40px 0; background: linear-gradient(rgba(46, 134, 193, 0.05), white); border-radius: 20px; margin-bottom: 30px;">
                    <div class="avatar-container" style="width:120px; height:120px; margin: 0 auto 20px;" onclick="app.profile.triggerUpload()">
                        <div class="avatar large" id="heroAvatar">${p.profilePic ? `<img src="${p.profilePic}">` : p.name.charAt(0)}</div>
                        <div class="avatar-overlay" style="font-size:24px;"><i class="fa-solid fa-camera"></i></div>
                    </div>
                    <h1 class="page-title" style="margin:0; font-size:32px;">${p.name}</h1>
                    <p class="text-muted" style="font-size:16px;">${app.translations[app.lang].role_patient} | ID: ${p.id}</p>
                </div>
                
                <div class="content-grid">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                        <div class="card stagger-2">
                            <div class="card-header"><h2 data-i18n="personal_info">Personal Information</h2></div>
                            <div style="display:grid; gap:15px;">
                                <div><label class="text-muted" style="display:block; font-size:11px; text-transform:uppercase; font-weight:700;">National ID</label> <div style="font-weight:600;">${p.id}</div></div>
                                <div><label class="text-muted" style="display:block; font-size:11px; text-transform:uppercase; font-weight:700;">Phone</label> <div style="font-weight:600;">${p.phone}</div></div>
                                <div><label class="text-muted" style="display:block; font-size:11px; text-transform:uppercase; font-weight:700;">Email</label> <div style="font-weight:600;">${p.email}</div></div>
                            </div>
                            <button class="btn secondary-btn full-width mt-4" onclick="app.ui.toast('Edit coming soon', 'info')">Edit Information</button>
                        </div>
                        
                        <div class="card stagger-3">
                            <div class="card-header"><h2 data-i18n="prescriptions_upload">Quick Actions</h2></div>
                            <div class="form-group">
                             <div class="form-group">
                                <label>Medical File (PDF or Image)</label>
                                <div style="display:flex; gap:10px;">
                                    <input type="file" id="patientFileRx" accept="image/*,.pdf" style="flex:1; padding:10px; font-size:12px;">
                                    <button class="btn secondary-btn small" onclick="app.ui.showCamera()"><i class="fa-solid fa-camera"></i> Camera</button>
                                </div>
                            </div>
                            <button class="btn primary-btn full-width mb-3" onclick="app.patient.uploadPrescription()"><i class="fa-solid fa-upload"></i> Upload & Sync</button>
                            <hr style="border:0; border-top:1px solid var(--border); margin: 20px 0;">
                            <div id="doctorApplySection">
                                <button class="btn secondary-btn full-width" onclick="app.ui.showDoctorApply()">Apply as Doctor</button>
                            </div>
                        </div>
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
                const docs = await app.api('/users/doctors');
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

        async renderChatView() {
            const partnerId = app.currentChatPartner;
            if (!partnerId) {
                const mainView = document.getElementById('mainView');
                if (mainView) mainView.innerHTML = `<h2 class="center mt-5 text-muted" data-i18n="select_chat_partner">Select someone to chat with</h2>`;
                app.i18n.apply();
                return;
            }

            try {
                const partner = await app.api(`/users/profile?id=${partnerId}`); 
                const html = `
                    <div class="card" style="height: calc(100vh - 150px); display:flex; flex-direction:column; padding:0; overflow:hidden;">
                        <div class="card-header" style="padding: 15px 24px; background: white; margin:0;">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div class="avatar small" style="width:40px;height:40px;">${partner.profilePic ? `<img src="${partner.profilePic}">` : partner.name.charAt(0)}</div>
                                <h2 style="font-size:18px;">${partner.name}</h2>
                            </div>
                            <button class="btn text-btn" onclick="app.user.activeRole === 'doctor' ? app.ui.renderDoctorWorkspace() : app.ui.renderPatientDashboard()"><i class="fa-solid fa-arrow-left"></i> Back</button>
                        </div>
                        <div id="chatMessages" style="flex:1; overflow-y:auto; padding: 24px; background: #f8fafc; display:flex; flex-direction:column; gap:12px;"></div>
                        <div style="padding: 20px 24px; background: white; border-top: 1px solid var(--border); display:flex; gap:12px; align-items:center;">
                            <input type="text" id="chatInput" placeholder="${app.translations[app.lang].type_message}" style="flex:1; padding:12px 20px; border-radius:25px; border:1px solid var(--border); background:var(--bg-main); outline:none;">
                            <button class="btn primary-btn" style="width:45px; height:45px; border-radius:50%; padding:0;" onclick="app.chat.send()"><i class="fa-solid fa-paper-plane"></i></button>
                        </div>
                    </div>
                `;
                const mainView = document.getElementById('mainView');
                if (mainView) mainView.innerHTML = html;
                app.chat.loadMessages();
                app.i18n.apply();
            } catch (err) {}
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
                <div class="content-grid" style="max-width: 800px;">
                    <div class="card stagger-1">
                        <div class="card-header"><h2>Preferences</h2></div>
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0;">
                            <div><strong>Language / اللغة</strong></div>
                            <button class="btn secondary-btn small" onclick="app.i18n.toggle()">${app.lang === 'en' ? 'عربي' : 'English'}</button>
                        </div>
                    </div>
                    <button class="btn secondary-btn full-width mt-4" onclick="app.auth.logout()">Logout</button>
                </div>
            `;
            const mainView = document.getElementById('mainView');
            if (mainView) mainView.innerHTML = html;
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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h1 class="page-title m-0">Patient: ${p.name}</h1>
                    <button class="btn primary-btn" onclick="app.currentChatPartner='${p.id}'; app.ui.renderChatView();">Message Patient</button>
                </div>
                <div class="content-grid">
                    <div class="card">
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
                        <button class="btn primary-btn full-width" onclick="app.doctor.prescribe()">Send Prescription</button>
                    </div>
                    <div class="card">
                        <div class="card-header"><h2>History</h2></div>
                        <div id="doctorPrescriptionsList"></div>
                    </div>
                </div>
            `;
            const mainView = document.getElementById('mainView');
            if (mainView) mainView.innerHTML = html;
            app.doctor.loadPrescriptions();
            app.i18n.apply();
        }
    },

    patient: {
        async searchDoctor() {
            const name = document.getElementById('doctorSearchInput').value.toLowerCase().trim();
            if (!name) return app.ui.toast("Please enter a name", "error");
            try {
                const docs = await app.api('/users/doctors');
                const found = docs.find(d => d.name.toLowerCase().includes(name));
                if (!found) return app.ui.toast("Doctor not found", "error");
                app.currentChatPartner = found.id;
                app.ui.renderChatView();
            } catch (err) {}
        },
        async loadPrescriptions() {
            try {
                const list = await app.api('/clinical/prescriptions');
                const container = document.getElementById('patientPrescriptionsList');
                if (!container) return;
                container.innerHTML = list.length === 0 ? '<p>No prescriptions found.</p>' : list.reverse().map(rx => `
                    <div class="card mb-2">
                        <div style="display:flex; justify-content:space-between;"><strong>${rx.medications}</strong> <span>${new Date(rx.date).toLocaleDateString()}</span></div>
                        <p>${rx.notes}</p>
                        <div style="display:flex; gap:10px; margin-top:10px;">
                            ${rx.fileUrl ? `<a href="${rx.fileUrl}" target="_blank" class="btn text-btn small"><i class="fa-solid fa-file-pdf"></i> View File</a>` : ''}
                            <button class="btn secondary-btn small" onclick="app.patient.exportToPDF('${rx._id}')"><i class="fa-solid fa-file-export"></i> Export PDF</button>
                        </div>
                    </div>
                `).join('');
            } catch (err) {}
        },
        async uploadPrescription() {
            const fileInput = document.getElementById('patientFileRx');
            if (!fileInput.files.length) return app.ui.toast("Select a file", "error");
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            try {
                const res = await fetch('/api/users/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('mr_token')}` },
                    body: formData
                });
                const { url } = await res.json();
                await app.api('/clinical/prescribe', 'POST', { patientId: app.user.id, medications: "Self-Uploaded", notes: "File attached", fileUrl: url });
                app.ui.toast("Uploaded", "success");
                this.loadPrescriptions();
            } catch (err) {}
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
                    const baseUrl = window.location.protocol === 'file:' ? 'http://localhost:5000/api' : '/api';
                    const res = await fetch(`${baseUrl}/users/upload`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('mr_token')}` },
                        body: formData
                    });
                    const { url } = await res.json();
                    
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
                    else this.loadPrescriptions();
                } catch (err) {}
            }, 'image/jpeg');
        },
        async applyForDoctor() {
            const fileInput = document.getElementById('doctorLicenseFile');
            if (!fileInput || !fileInput.files.length) return app.ui.toast("Select a file", "error");
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            try {
                const res = await fetch('/api/users/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('mr_token')}` },
                    body: formData
                });
                const { url } = await res.json();
                await app.api('/users/apply', 'POST', { docUrl: url });
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
                const doc = new jsPDF();
                
                doc.setFontSize(22);
                doc.text("MedRecord Prescription", 20, 20);
                doc.setFontSize(12);
                doc.text(`Patient: ${app.user.name}`, 20, 40);
                doc.text(`Doctor: ${rx.doctorId?.name || 'System'}`, 20, 50);
                doc.text(`Date: ${new Date(rx.date).toLocaleDateString()}`, 20, 60);
                doc.line(20, 65, 190, 65);
                
                doc.setFontSize(16);
                doc.text("Medications:", 20, 80);
                doc.setFontSize(12);
                doc.text(rx.medications, 30, 90);
                
                doc.setFontSize(16);
                doc.text("Notes:", 20, 110);
                doc.setFontSize(12);
                doc.text(rx.notes, 30, 120);
                
                doc.save(`Prescription_${rxId}.pdf`);
            } catch (err) {
                app.ui.toast("PDF Export failed", "error");
            }
        }
    },

    doctor: {
        async searchPatient() {
            const id = document.getElementById('patientSearchInput').value;
            try {
                const p = await app.api(`/users/profile?id=${id}`);
                app.currentPatient = p;
                app.ui.renderDoctorWorkspace();
            } catch (err) {
                app.ui.toast("Patient not found", "error");
            }
        },
        async prescribe() {
            const meds = document.getElementById('rxMeds').value;
            const notes = document.getElementById('rxNotes').value;
            const fileInput = document.getElementById('doctorRxFile');
            if (!meds) return app.ui.toast("Meds cannot be empty", "error");
            let fileUrl = null;
            if (fileInput?.files.length) {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                const baseUrl = window.location.protocol === 'file:' ? 'http://localhost:5000/api' : '/api';
                const res = await fetch(`${baseUrl}/users/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('mr_token')}` },
                    body: formData
                });
                const data = await res.json();
                fileUrl = data.url;
            }
            try {
                await app.api('/clinical/prescribe', 'POST', { patientId: app.currentPatient.id, medications: meds, notes, fileUrl });
                app.ui.toast("Sent", "success");
                this.loadPrescriptions();
            } catch (err) {}
        },
        async loadPrescriptions() {
            try {
                const list = await app.api(`/clinical/prescriptions?patientId=${app.currentPatient.id}`);
                const container = document.getElementById('doctorPrescriptionsList');
                if (container) {
                    container.innerHTML = list.length === 0 ? '<p>No history.</p>' : list.reverse().map(rx => `
                        <div class="card mb-2">
                            <strong>${rx.medications}</strong><br><small>${new Date(rx.date).toLocaleDateString()}</small>
                            ${rx.fileUrl ? `<br><a href="${rx.fileUrl}" target="_blank">Attachment</a>` : ''}
                        </div>
                    `).join('');
                }
            } catch (err) {}
        }
    },

    chat: {
        async loadMessages() {
            const container = document.getElementById('chatMessages');
            if (!container || !app.currentChatPartner) return;
            try {
                const msgs = await app.api(`/messages/${app.currentChatPartner}`);
                container.innerHTML = msgs.length === 0 ? '<p class="center text-muted">No messages yet.</p>' : msgs.map(m => {
                    const me = m.senderId === app.user.id;
                    return `
                        <div style="display:flex; justify-content: ${me ? 'flex-end' : 'flex-start'}">
                            <div style="max-width: 70%; padding: 10px 15px; border-radius: 15px; background: ${me ? 'var(--primary)' : '#eee'}; color: ${me ? 'white' : 'black'}">
                                ${m.content}
                            </div>
                        </div>
                    `;
                }).join('');
                container.scrollTop = container.scrollHeight;
            } catch (err) {}
        },
        async send() {
            const input = document.getElementById('chatInput');
            if (!input?.value.trim()) return;
            try {
                await app.api('/messages', 'POST', { receiverId: app.currentChatPartner, content: input.value.trim() });
                input.value = '';
                this.loadMessages();
            } catch (err) {}
        }
    },

    i18n: {
        init() {
            const saved = localStorage.getItem('mr_lang');
            if (saved) app.lang = saved;
            this.apply();
        },
        toggle() {
            app.lang = app.lang === 'en' ? 'ar' : 'en';
            localStorage.setItem('mr_lang', app.lang);
            this.apply();
            location.reload(); // Simplest way to re-render everything
        },
        apply() {
            document.documentElement.setAttribute('dir', app.lang === 'ar' ? 'rtl' : 'ltr');
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
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.i18n.init();
    app.auth.init();
});
