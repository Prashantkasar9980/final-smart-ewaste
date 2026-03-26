const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

async function handleJsonResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    let data = null;

    if (contentType.includes("application/json")) {
        try {
            data = await response.json();
        } catch (err) {}
    } else {
        const text = await response.text();
        data = { message: text };
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }

    return data;
}

/* ========================== LOGIN ========================== */

export async function loginApi(username, password) {
    const response = await fetch(`${API_BASE}/api/public/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    return handleJsonResponse(response);
}

/* ======================== REGISTER ========================= */
/* backend accepts JSON only */

export async function registerUserApi(form) {
    const response = await fetch(`${API_BASE}/api/public/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            address: form.address || "",
            city: form.city || "",
        }),
    });

    const data = await handleJsonResponse(response);
    return data?.message || "Registration successful.";
}

/* ======================= ADMIN APIs ========================= */

export async function fetchAdminUsersApi(token) {
    const response = await fetch(`${API_BASE}/api/admin/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleJsonResponse(response);
}

export async function approveUserApi(userId, approve, token) {
    const response = await fetch(`${API_BASE}/api/admin/users/approve`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, approve }),
    });

    return handleJsonResponse(response);
}

export async function updateUserRoleApi(userId, role, token) {
    const response = await fetch(`${API_BASE}/api/admin/users/role`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role }),
    });

    return handleJsonResponse(response);
}

export async function fetchAdminDashboardApi(token) {
    const response = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return handleJsonResponse(response);
}

export async function fetchAdminEwasteRequestsApi({ token, page = 0, size = 10, status } = {}) {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.set("status", status);
    const response = await fetch(`${API_BASE}/api/admin/ewaste?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return handleJsonResponse(response);
}

export async function updateAdminEwasteStatusApi({ token, id, status }) {
    const params = new URLSearchParams({ status });
    const response = await fetch(`${API_BASE}/api/admin/ewaste/${id}/status?${params.toString()}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
    });
    return handleJsonResponse(response);
}

export async function assignAdminEwastePersonnelApi({ token, id, personnelName }) {
    const response = await fetch(`${API_BASE}/api/admin/ewaste/${id}/assign`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ personnelName }),
    });
    return handleJsonResponse(response);
}

export async function scheduleAdminEwastePickupApi({ token, id, scheduledAt }) {
    const params = new URLSearchParams({ scheduledAt });
    const response = await fetch(`${API_BASE}/api/admin/ewaste/${id}/schedule?${params.toString()}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
    });
    return handleJsonResponse(response);
}

/* ======================= USER E-WASTE APIs ================== */

export async function fetchStaffPickupsApi({ token, page = 0, size = 10 } = {}) {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    const response = await fetch(`${API_BASE}/api/staff/my-pickups?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return handleJsonResponse(response);
}

export async function updateStaffPickupStatusApi({ token, id, status }) {
    const response = await fetch(`${API_BASE}/api/staff/pickups/${id}/status`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status }),
    });
    return handleJsonResponse(response);
}

export async function fetchUserEwasteRequestsApi({ token, page = 0, size = 10 }) {
    const response = await fetch(
        `${API_BASE}/api/user/ewaste?page=${page}&size=${size}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return handleJsonResponse(response);
}

/** Submit e-waste request (multipart: dto + optional file). dto.pickupDateTime as ISO string. */
export async function submitEwasteRequestApi(token, dto, file = null) {
    const form = new FormData();
    form.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
    if (file && file instanceof File) form.append("file", file);
    const response = await fetch(`${API_BASE}/api/user/ewaste`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });
    return handleJsonResponse(response);
}

/* ======================= PASSWORD APIs ======================= */

export async function resetPasswordWithTempApi(payload) {
    const response = await fetch(`${API_BASE}/api/public/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return handleJsonResponse(response);
}

export async function resetPasswordWithTokenApi({ email, token, newPassword }) {
    const response = await fetch(`${API_BASE}/api/public/reset-password-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, newPassword }),
    });

    return handleJsonResponse(response);
}

export async function forgotPasswordApi(email) {
    const frontendUrl = window.location.origin;
    const response = await fetch(`${API_BASE}/api/public/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, frontendUrl }),
    });

    return handleJsonResponse(response);
}

/* ====================== AUTH STORAGE ======================== */

export function saveAuthToStorage(authData) {
    const { token, role, mustResetPassword, loginId, fullName, email, phone, city, address, avatarUrl } = authData;
    if (token) localStorage.setItem("authToken", token);
    if (role) localStorage.setItem("authRole", role);
    if (typeof mustResetPassword === "boolean")
        localStorage.setItem("authMustReset", String(mustResetPassword));
    if (loginId) localStorage.setItem("loginId", loginId);
    if (fullName) localStorage.setItem("fullName", fullName);
    if (email) localStorage.setItem("email", email);
    if (phone) localStorage.setItem("phone", phone);
    if (city) localStorage.setItem("city", city);
    if (address) localStorage.setItem("address", address);
    if (avatarUrl) localStorage.setItem("avatarUrl", avatarUrl);
}

export function clearAuthFromStorage() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authMustReset");
    localStorage.removeItem("loginId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    localStorage.removeItem("city");
    localStorage.removeItem("address");
    localStorage.removeItem("avatarUrl");
}

export function getAuthFromStorage() {
    return {
        token: localStorage.getItem("authToken"),
        role: localStorage.getItem("authRole"),
        mustResetPassword: localStorage.getItem("authMustReset") === "true",
        loginId: localStorage.getItem("loginId"),
        fullName: localStorage.getItem("fullName"),
        email: localStorage.getItem("email"),
        phone: localStorage.getItem("phone"),
        city: localStorage.getItem("city"),
        address: localStorage.getItem("address"),
        avatarUrl: localStorage.getItem("avatarUrl"),
    };
}
