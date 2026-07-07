const BASE_URL =
  "https://campus-placements-intelligence-system.onrender.com";

function getTokens() {
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  };
}

function setAccessToken(token) {
  localStorage.setItem("access_token", token);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function setTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem("access_token", access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
}

async function tryRefresh() {
  const { refresh } = getTokens();
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE_URL}/refresh_tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setAccessToken(data.access_token);
    return true;
  } catch {
    return false;
  }
}

/**
 * Core request helper.
 * opts: { method, body, form (bool - send as x-www-form-urlencoded), auth (bool, default true), isFile (bool) }
 */
async function request(path, opts = {}) {
  const { method = "GET", body, form = false, auth = true, isFile = false } = opts;

  const headers = {};
  if (!isFile && !form) headers["Content-Type"] = "application/json";
  if (form) headers["Content-Type"] = "application/x-www-form-urlencoded";

  if (auth) {
    const { access } = getTokens();
    if (access) headers["Authorization"] = `Bearer ${access}`;
  }

  const doFetch = async () =>
    fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isFile ? body : body !== undefined ? (form ? body : JSON.stringify(body)) : undefined,
    });

  let res = await doFetch();

  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const { access } = getTokens();
      headers["Authorization"] = `Bearer ${access}`;
      res = await doFetch();
    }
  }

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message)) ||
      `Request failed (${res.status})`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path) => request(path, { method: "DELETE" }),

  login: (email, password) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    return request("/login", { method: "POST", body: form.toString(), form: true, auth: false });
  },

  register: (payload) => request("/register", { method: "POST", body: payload, auth: false }),

  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/resume-upload", { method: "POST", body: formData, isFile: true });
  },
};

export { BASE_URL };
