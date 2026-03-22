// Change to your machine's local IP when testing on a real device
// e.g. 'http://192.168.1.XX:8080'
// localhost works when using the iOS Simulator
// const API_BASE = 'http://192.168.1.XX:8080'; // 替换 XX 为你Mac的实际IP
const API_BASE = 'http://localhost:8080';


const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const login = (loginVal, password) =>
  fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: loginVal, password }),
  }).then(handleResponse);

export const register = (data) =>
  fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const resetPassword = (data) =>
  fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

const buildUrl = (base, startDate, endDate) => {
  const params = [];
  if (startDate) params.push(`dateDebut=${encodeURIComponent(startDate)}`);
  if (endDate) params.push(`dateFin=${encodeURIComponent(endDate)}`);
  return params.length ? `${base}?${params.join('&')}` : base;
};

export const getStops = (participantId, startDate, endDate) =>
  fetch(buildUrl(`${API_BASE}/stops/${participantId}`, startDate, endDate)).then(handleResponse);

export const getStopsMbgp = (participantId, startDate, endDate) =>
  fetch(buildUrl(`${API_BASE}/stops-mbgp/${participantId}`, startDate, endDate)).then(handleResponse);

export const getMoves = (participantId, startDate, endDate) =>
  fetch(buildUrl(`${API_BASE}/moves/${participantId}`, startDate, endDate)).then(handleResponse);

export const sendGpsPoint = (point) =>
  fetch(`${API_BASE}/api/gps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(point),
  }).then((res) => res.ok);

export const processGps = (participantId) =>
  fetch(`${API_BASE}/api/gps/process/${participantId}`, { method: 'POST' }).then((res) => res.ok);

export const createStop = (participantId, longitude, latitude, commentaire = '', dateDebut = null, dateFin = null, isPublic = true, photo = null) =>
  fetch(`${API_BASE}/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stopId: 0, participantId, longitude, latitude, commentaire, dateDebut, dateFin, isPublic, photo }),
  }).then((res) => res.ok);

export const deleteStop = (stopId) =>
  fetch(`${API_BASE}/stop/${stopId}`, { method: 'DELETE' }).then((res) => res.ok);

export const updateStop = (stopId, commentaire) =>
  fetch(`${API_BASE}/stop`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stopId, commentaire }),
  }).then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

export const updateStopMbgp = (stopId, commentaire) =>
  fetch(`${API_BASE}/stop-mbgp`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stopId, commentaire }),
  }).then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

export const saveCarnetActivite = (data) =>
  fetch(`${API_BASE}/carnet-activite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

export const updateCarnetActivite = (data) =>
  fetch(`${API_BASE}/carnet-activite`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

export const saveCarnetDeplacement = (data) =>
  fetch(`${API_BASE}/carnet-deplacement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });

export const updateCarnetDeplacement = (data) =>
  fetch(`${API_BASE}/carnet-deplacement`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); });
