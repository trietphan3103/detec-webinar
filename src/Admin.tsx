import { useState, useEffect, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';

const API_BASE = 'https://detec-webinar.mona.academy';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  clinic_name: string;
  created_at?: string;
  updated_at?: string;
}

interface SubmitLog {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  clinic_name: string;
  submitted_at: string;
}

type Tab = 'users' | 'submit-logs' | 'analytics';

// ─── Auth helpers ───
function getToken() { return localStorage.getItem('detec_admin_token') || ''; }
function setToken(t: string) { localStorage.setItem('detec_admin_token', t); }
function clearToken() { localStorage.removeItem('detec_admin_token'); }

// ─── Export helpers ───
function exportCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) { alert('Không có dữ liệu để xuất.'); return; }
  const headers = Object.keys(data[0]);
  const escape = (val: unknown) => {
    const s = String(val ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [headers.map(escape), ...data.map(row => headers.map(h => escape(row[h])))];
  const csv = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function exportXLSX(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) { alert('Không có dữ liệu để xuất.'); return; }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, filename);
}

function ExportDropdown({ onCSV, onXLSX }: { onCSV: () => void; onXLSX: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-500 transition whitespace-nowrap"
      >
        ↓ Export
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
          <button
            onClick={() => { onCSV(); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
          >
            <span>📄</span> CSV
          </button>
          <button
            onClick={() => { onXLSX(); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 border-t border-slate-100"
          >
            <span>📊</span> XLSX
          </button>
        </div>
      )}
    </div>
  );
}

async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...opts.headers,
    },
  });
  if (res.status === 401 || res.status === 403) {
    clearToken();
    window.location.href = '/admin';
    throw new Error('Phiên đăng nhập hết hạn');
  }
  const data = await res.json();
  if (!res.ok) {
    const msg = data.error || `HTTP ${res.status}`;
    if (/unauthorized|unauthenticated|token/i.test(msg)) {
      clearToken();
      window.location.href = '/admin';
    }
    throw new Error(msg);
  }
  return data;
}

// ─── Login Page ───
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api<{ token: string }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Authorization': '' },
      });
      setToken(res.token);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">DETEC Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Đăng nhập quản trị</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ───
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── User Form ───
function UserForm({ initial, onSubmit, onCancel, loading }: {
  initial?: Partial<User>;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    city: initial?.city || '',
    clinic_name: initial?.clinic_name || '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      {(['name', 'email', 'phone', 'city', 'clinic_name'] as const).map(field => (
        <div key={field}>
          <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">
            {field === 'clinic_name' ? 'Phòng khám' : field === 'name' ? 'Họ tên' : field === 'email' ? 'Email' : field === 'phone' ? 'Số điện thoại' : 'Thành phố'}
          </label>
          <input
            type={field === 'email' ? 'email' : 'text'}
            value={form[field]}
            onChange={e => set(field, e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
          />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50">
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition">
          Hủy
        </button>
      </div>
    </form>
  );
}

// ─── SubmitLog Form ───
function SubmitLogForm({ initial, onSubmit, onCancel, loading }: {
  initial: SubmitLog;
  onSubmit: (data: Partial<SubmitLog>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: initial.name || '',
    email: initial.email || '',
    phone: initial.phone || '',
    city: initial.city || '',
    clinic_name: initial.clinic_name || '',
    submitted_at: initial.submitted_at || '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      {(['name', 'email', 'phone', 'city', 'clinic_name', 'submitted_at'] as const).map(field => (
        <div key={field}>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {field === 'clinic_name' ? 'Phòng khám' : field === 'name' ? 'Họ tên' : field === 'email' ? 'Email' : field === 'phone' ? 'Số điện thoại' : field === 'city' ? 'Thành phố' : 'Thời gian đăng ký'}
          </label>
          <input
            type={field === 'email' ? 'email' : field === 'submitted_at' ? 'datetime-local' : 'text'}
            value={form[field]}
            onChange={e => set(field, e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
          />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50">
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition">
          Hủy
        </button>
      </div>
    </form>
  );
}

// ─── Users Tab ───
function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ data: User[] }>('/admin/users');
      setUsers(res.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = async (data: Partial<User>) => {
    setSaving(true);
    try {
      await api('/admin/users', { method: 'POST', body: JSON.stringify(data) });
      setModal(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: Partial<User>) => {
    if (!editing) return;
    setSaving(true);
    try {
      await api(`/admin/users/${editing.id}`, { method: 'PUT', body: JSON.stringify(data) });
      setModal(null);
      setEditing(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Xóa học viên "${user.name}"?`)) return;
    try {
      await api(`/admin/users/${user.id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    const s = search.toLowerCase();
    return u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s) || u.phone?.includes(s) || u.clinic_name?.toLowerCase().includes(s) || u.city?.toLowerCase().includes(s);
  });

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Học viên</h2>
          <p className="text-slate-500 text-sm">{users.length} học viên</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 sm:w-64 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <ExportDropdown
            onCSV={() => exportCSV(
              filtered.map(u => ({ ID: u.id, 'Họ tên': u.name, Email: u.email, 'SĐT': u.phone, 'Thành phố': u.city, 'Phòng khám': u.clinic_name, 'Ngày tạo': u.created_at ?? '' })),
              `hoc-vien-${new Date().toISOString().slice(0,10)}.csv`
            )}
            onXLSX={() => exportXLSX(
              filtered.map(u => ({ ID: u.id, 'Họ tên': u.name, Email: u.email, 'SĐT': u.phone, 'Thành phố': u.city, 'Phòng khám': u.clinic_name, 'Ngày tạo': u.created_at ?? '' })),
              `hoc-vien-${new Date().toISOString().slice(0,10)}.xlsx`
            )}
          />
          <button onClick={() => setModal('create')} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition whitespace-nowrap">
            + Thêm
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Họ tên</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">SĐT</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Thành phố</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Phòng khám</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 text-slate-400">{user.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{user.city}</td>
                  <td className="px-4 py-3 text-slate-600">{user.clinic_name}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(user); setModal('edit'); }} className="text-primary hover:text-primary/70 font-medium mr-3">Sửa</button>
                    <button onClick={() => handleDelete(user)} className="text-red-500 hover:text-red-400 font-medium">Xóa</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(user => (
          <div key={user.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-400">#{user.id}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(user); setModal('edit'); }} className="text-primary text-sm font-medium">Sửa</button>
                <button onClick={() => handleDelete(user)} className="text-red-500 text-sm font-medium">Xóa</button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              {user.email && <p>📧 {user.email}</p>}
              {user.phone && <p>📱 {user.phone}</p>}
              {user.city && <p>📍 {user.city}</p>}
              {user.clinic_name && <p>🏥 {user.clinic_name}</p>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-slate-400 py-10">Không có dữ liệu</p>}
      </div>

      {modal === 'create' && (
        <Modal title="Thêm học viên" onClose={() => setModal(null)}>
          <UserForm onSubmit={handleCreate} onCancel={() => setModal(null)} loading={saving} />
        </Modal>
      )}
      {modal === 'edit' && editing && (
        <Modal title="Sửa học viên" onClose={() => { setModal(null); setEditing(null); }}>
          <UserForm initial={editing} onSubmit={handleUpdate} onCancel={() => { setModal(null); setEditing(null); }} loading={saving} />
        </Modal>
      )}
    </div>
  );
}

// ─── Submit Logs Tab ───
function SubmitLogsTab() {
  const [logs, setLogs] = useState<SubmitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<'edit' | null>(null);
  const [editing, setEditing] = useState<SubmitLog | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ data: SubmitLog[] }>('/admin/submit-logs');
      setLogs(res.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleUpdate = async (data: Partial<SubmitLog>) => {
    if (!editing) return;
    setSaving(true);
    try {
      await api(`/admin/submit-logs/${editing.id}`, { method: 'PUT', body: JSON.stringify(data) });
      setModal(null);
      setEditing(null);
      fetchLogs();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (log: SubmitLog) => {
    if (!confirm(`Xóa log #${log.id} của "${log.name}"?`)) return;
    try {
      await api(`/admin/submit-logs/${log.id}`, { method: 'DELETE' });
      fetchLogs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return d; }
  };

  const filtered = logs.filter(l => {
    if (!search) return true;
    const s = search.toLowerCase();
    return l.name?.toLowerCase().includes(s) || l.email?.toLowerCase().includes(s) || l.phone?.includes(s) || l.clinic_name?.toLowerCase().includes(s) || l.city?.toLowerCase().includes(s);
  });

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Lịch sử đăng ký</h2>
          <p className="text-slate-500 text-sm">{logs.length} lượt đăng ký</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 sm:w-64 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <ExportDropdown
            onCSV={() => exportCSV(
              filtered.map(l => ({ ID: l.id, 'Họ tên': l.name, Email: l.email, 'SĐT': l.phone, 'Thành phố': l.city, 'Phòng khám': l.clinic_name, 'Thời gian đăng ký': formatDate(l.submitted_at) })),
              `lich-su-dang-ky-${new Date().toISOString().slice(0,10)}.csv`
            )}
            onXLSX={() => exportXLSX(
              filtered.map(l => ({ ID: l.id, 'Họ tên': l.name, Email: l.email, 'SĐT': l.phone, 'Thành phố': l.city, 'Phòng khám': l.clinic_name, 'Thời gian đăng ký': formatDate(l.submitted_at) })),
              `lich-su-dang-ky-${new Date().toISOString().slice(0,10)}.xlsx`
            )}
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Họ tên</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">SĐT</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Thành phố</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Phòng khám</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Thời gian</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 text-slate-400">{log.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{log.name}</td>
                  <td className="px-4 py-3 text-slate-600">{log.email}</td>
                  <td className="px-4 py-3 text-slate-600">{log.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{log.city}</td>
                  <td className="px-4 py-3 text-slate-600">{log.clinic_name}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(log.submitted_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(log); setModal('edit'); }} className="text-primary hover:text-primary/70 font-medium mr-3">Sửa</button>
                    <button onClick={() => handleDelete(log)} className="text-red-500 hover:text-red-400 font-medium">Xóa</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(log => (
          <div key={log.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-slate-900">{log.name}</p>
                <p className="text-xs text-slate-400">#{log.id} · {formatDate(log.submitted_at)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(log); setModal('edit'); }} className="text-primary text-sm font-medium">Sửa</button>
                <button onClick={() => handleDelete(log)} className="text-red-500 text-sm font-medium">Xóa</button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              {log.email && <p>📧 {log.email}</p>}
              {log.phone && <p>📱 {log.phone}</p>}
              {log.city && <p>📍 {log.city}</p>}
              {log.clinic_name && <p>🏥 {log.clinic_name}</p>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-slate-400 py-10">Không có dữ liệu</p>}
      </div>

      {modal === 'edit' && editing && (
        <Modal title="Sửa log đăng ký" onClose={() => { setModal(null); setEditing(null); }}>
          <SubmitLogForm initial={editing} onSubmit={handleUpdate} onCancel={() => { setModal(null); setEditing(null); }} loading={saving} />
        </Modal>
      )}
    </div>
  );
}

// ─── Analytics Tab ───
// ─── Ads Types ───
interface AdCampaign {
  campaign_name: string;
  adset_name?: string;
  ad_name?: string;
  post_url?: string | null;
  impressions: number;
  reach: number;
  clicks: number;
  landing_page_views: number;
  spend: number;
  cpm: number;
  cpc: number;
  ctr: number;
  [k: string]: string | number | undefined;
}
interface AdsData { ads: AdCampaign[]; campaigns: AdCampaign[]; since: string; until: string; error?: string; }

interface PixelTotals { PageView?: number; FormSubmit?: number; ViewContentScroll25?: number; ViewContentScroll50?: number; ViewContentScroll75?: number; ViewContentScroll90?: number; TimeOnSite30s?: number; TimeOnSite60s?: number; TimeOnSite120s?: number; [k: string]: number | undefined; }
interface DailyRow { date: string; PageView?: number; FormSubmit?: number; [k: string]: string | number | undefined; }
interface HourRow { hour: number; PageView?: number; FormSubmit?: number; TimeOnSite30s?: number; ViewContentScroll25?: number; [k: string]: number | undefined; }
interface PixelData { totals: PixelTotals; daily: DailyRow[]; hourly: HourRow[]; days: number; }

function pct(num = 0, den = 1) { return den === 0 ? 0 : Math.round(num / den * 100); }

function StatusBadge({ value, warn, bad, suffix = '%', invert = false }: { value: number; warn: number; bad: number; suffix?: string; invert?: boolean }) {
  const ok = invert ? value <= warn : value >= warn;
  const isBad = invert ? value >= bad : value <= bad;
  const color = isBad ? 'bg-red-100 text-red-700' : ok ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700';
  const dot = isBad ? '●' : ok ? '●' : '●';
  return <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{dot} {value}{suffix}</span>;
}

function KpiCard({ label, value, sub, status }: { label: string; value: string | number; sub?: string; status?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-1">
      <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</div>
      <div className="text-3xl font-extrabold text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
      {status}
    </div>
  );
}

function FunnelBar({ label, count, base, color }: { label: string; count: number; base: number; color: string }) {
  const w = base === 0 ? 0 : Math.round(count / base * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="w-36 text-xs text-slate-600 font-medium shrink-0">{label}</div>
      <div className="flex-1 bg-slate-100 rounded-full h-5 relative overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${w}%` }} />
      </div>
      <div className="w-24 text-right text-xs font-bold text-slate-700">{count.toLocaleString()} <span className="text-slate-400 font-normal">({w}%)</span></div>
    </div>
  );
}

function MiniBarChart({ data }: { data: DailyRow[] }) {
  const max = Math.max(...data.map(d => d.PageView ?? 0), 1);
  const H = 220;
  return (
    <div className="flex items-end gap-2" style={{ height: H + 48 }}>
      {data.map(d => {
        const pv = d.PageView ?? 0;
        const fs = d.FormSubmit ?? 0;
        const cvr = pct(fs, pv);
        const barH = Math.max(Math.round(pv / max * H), 6);
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center group relative">
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none shadow-lg">
              {d.date.slice(5)}: {pv.toLocaleString()} views · {fs} leads · CVR {cvr}%
            </div>
            {/* CVR badge */}
            {pv > 0 && (
              <div className="text-[10px] font-semibold text-primary mb-1">{cvr}%</div>
            )}
            {/* Bar: stacked — leads (blue) on top of rest (gray) */}
            <div className="w-full rounded-lg overflow-hidden flex flex-col-reverse" style={{ height: barH }}>
              <div className="w-full bg-slate-100" style={{ height: barH - Math.round(fs / Math.max(pv,1) * barH) }} />
              <div className="w-full bg-primary/70 flex-1" style={{ height: Math.max(Math.round(fs / Math.max(pv,1) * barH), fs > 0 ? 3 : 0) }} />
            </div>
            {/* Date label */}
            <div className="text-[10px] text-slate-400 mt-1.5 font-medium">{d.date.slice(5)}</div>
          </div>
        );
      })}
    </div>
  );
}

function DiagnosisPanel({ t }: { t: PixelTotals }) {
  const pv = t.PageView ?? 0;
  const fs = t.FormSubmit ?? 0;
  const cvr = pct(fs, pv);
  const s25 = pct(t.ViewContentScroll25, pv);
  const s90 = pct(t.ViewContentScroll90, pv);
  const t30 = pct(t.TimeOnSite30s, pv);

  const issues: { level: 'ok' | 'warn' | 'bad'; msg: string }[] = [];

  if (cvr >= 8) issues.push({ level: 'ok', msg: `CVR ${cvr}% — tốt (benchmark webinar: 3-5%)` });
  else if (cvr >= 4) issues.push({ level: 'warn', msg: `CVR ${cvr}% — trung bình, còn cải thiện được` });
  else issues.push({ level: 'bad', msg: `CVR ${cvr}% — thấp, cần review offer hoặc form` });

  if (t30 >= 40) issues.push({ level: 'ok', msg: `${t30}% ở lại 30s+ — engagement tốt` });
  else if (t30 >= 20) issues.push({ level: 'warn', msg: `${t30}% ở lại 30s+ — bounce rate cao, hero section chưa đủ hấp dẫn` });
  else issues.push({ level: 'bad', msg: `${t30}% ở lại 30s+ — traffic không đúng đối tượng hoặc trang load chậm` });

  if (s25 >= 30) issues.push({ level: 'ok', msg: `${s25}% scroll 25% — phần đầu trang giữ chân được` });
  else issues.push({ level: 'warn', msg: `${s25}% scroll 25% — người dùng không cuộn xuống, CTA đầu trang quan trọng` });

  if (s90 >= 15) issues.push({ level: 'ok', msg: `${s90}% xem đến cuối trang — content thuyết phục` });
  else issues.push({ level: 'warn', msg: `${s90}% xem đến cuối — phần social proof / case study ít người đọc` });

  const color = { ok: 'text-emerald-600', warn: 'text-yellow-600', bad: 'text-red-600' };
  const icon = { ok: '✓', warn: '⚠', bad: '✗' };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-sm font-bold text-slate-700 mb-3">Chẩn đoán tự động</div>
      <div className="flex flex-col gap-2">
        {issues.map((i, idx) => (
          <div key={idx} className={`flex items-start gap-2 text-sm ${color[i.level]}`}>
            <span className="font-bold shrink-0">{icon[i.level]}</span>
            <span>{i.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HourlyCVRChart({ data }: { data: HourRow[] }) {
  const maxPV = Math.max(...data.map(h => h.PageView ?? 0), 1);
  const peaks = data.filter(h => {
    const pv = h.PageView ?? 0; const fs = h.FormSubmit ?? 0;
    return pv > 0 && pct(fs, pv) >= 15;
  }).map(h => h.hour);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-sm font-bold text-slate-700 mb-1">CVR theo giờ trong ngày</div>
      <div className="text-xs text-slate-400 mb-4">Thanh = volume · Màu đậm = CVR cao · Vàng = peak chuyển đổi</div>
      {(() => {
        const H = 112;
        return (
          <div className="flex items-end gap-0.5" style={{ height: H + 16 }}>
            {data.map(h => {
              const pv = h.PageView ?? 0;
              const fs = h.FormSubmit ?? 0;
              const cvr = pct(fs, pv);
              const barH = Math.max(Math.round(pv / maxPV * H), 3);
              const cvrH = Math.round(Math.min(cvr / 50, 1) * barH);
              const isPeak = peaks.includes(h.hour);
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                    {h.hour}:00 · {pv} views · CVR {cvr}%
                  </div>
                  <div className="w-full rounded-t relative overflow-hidden" style={{ height: barH, backgroundColor: isPeak ? '#fbbf24' : '#e2e8f0' }}>
                    {cvr > 0 && <div className="absolute bottom-0 left-0 right-0 rounded-t" style={{ height: cvrH, backgroundColor: isPeak ? '#d97706' : '#6366f1' }} />}
                  </div>
                  {h.hour % 6 === 0 && <div className="text-[9px] text-slate-400">{h.hour}h</div>}
                </div>
              );
            })}
          </div>
        );
      })()}
      <div className="flex gap-4 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-slate-200 inline-block" />Volume</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" />CVR</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" />Peak ≥15%</span>
      </div>
    </div>
  );
}

function TrafficSourceCard({ daily, adsData }: { daily: DailyRow[]; adsData?: AdsData | null }) {
  const totalPV = daily.reduce((s, d) => s + (d.PageView as number ?? 0), 0);
  // Use real ads landing_page_views if available, else fallback estimate
  const adsLPV = adsData?.campaigns?.reduce((s, c) => s + (c.landing_page_views ?? 0), 0) ?? 0;
  const adsTraffic = adsLPV > 0 ? Math.min(adsLPV, totalPV) : Math.min(117, totalPV);
  const organicTraffic = totalPV - adsTraffic;
  const adsPct = pct(adsTraffic, totalPV);
  const orgPct = 100 - adsPct;
  const source = adsLPV > 0 ? 'Ads Manager (landing_page_views thực)' : 'Ước tính từ Ads Manager';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-sm font-bold text-slate-700 mb-1">Nguồn traffic</div>
      <div className="text-xs text-slate-400 mb-4">{source} vs tổng PageView từ Pixel</div>
      <div className="flex flex-col gap-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-600">Organic / Word-of-mouth</span>
            <span className="font-bold text-emerald-600">{orgPct}% · {organicTraffic.toLocaleString()} views</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${orgPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-600">Facebook Ads</span>
            <span className="font-bold text-blue-600">{adsPct}% · {adsTraffic.toLocaleString()} views</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${adsPct}%` }} />
          </div>
        </div>
      </div>
      {adsData?.campaigns && (
        <div className="mt-3 text-xs text-slate-500 flex gap-3">
          <span>Ads spend: <strong>{adsData.campaigns.reduce((s,c) => s + c.spend, 0).toLocaleString('vi-VN')}đ</strong></span>
          <span>Impressions: <strong>{adsData.campaigns.reduce((s,c) => s + c.impressions, 0).toLocaleString()}</strong></span>
        </div>
      )}
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        <strong>Insight:</strong> {orgPct}% traffic đến từ organic — share link, Zalo, group FB. Ads có ngân sách nhỏ nhưng CVR tốt. Peak lead ngày 3/4 hoàn toàn không có ads.
      </div>
    </div>
  );
}

function AdsPerformanceSection({ adsData, pixelData }: { adsData: AdsData; pixelData: PixelData }) {
  const campaigns = adsData.campaigns;
  const totalPixelPV = pixelData.totals.PageView ?? 0;
  const totalPixelFS = pixelData.totals.FormSubmit ?? 0;
  const totalAdsLPV = campaigns.reduce((s, c) => s + c.landing_page_views, 0);
  const totalAdsSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalAdsImpr = campaigns.reduce((s, c) => s + c.impressions, 0);

  // FormSubmit from ads actions
  const getConv = (c: AdCampaign) => {
    // Try various action types for custom pixel events
    for (const k of ['offsite_conversion.fb_pixel_custom', 'lead', 'onsite_conversion.lead_grouped']) {
      if (typeof c[k] === 'number' && (c[k] as number) > 0) return c[k] as number;
    }
    return 0;
  };
  const totalAdsConv = campaigns.reduce((s, c) => s + getConv(c), 0);

  const fmt = (n: number) => Math.round(n).toLocaleString('vi-VN');
  const fmtPct = (n: number) => n.toFixed(2) + '%';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-5">
      <div>
        <div className="text-sm font-bold text-slate-700 mb-0.5">Hiệu suất quảng cáo</div>
        <div className="text-xs text-slate-400">{adsData.since} → {adsData.until} · {campaigns.length} chiến dịch</div>
      </div>

      {/* Mapping: Ads vs Pixel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">Impressions</div>
          <div className="text-xl font-extrabold text-slate-800">{totalAdsImpr.toLocaleString()}</div>
          <div className="text-xs text-slate-400">CPM avg {fmt(totalAdsSpend / Math.max(totalAdsImpr,1) * 1000)}đ</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">Landing Views</div>
          <div className="text-xl font-extrabold text-blue-700">{totalAdsLPV.toLocaleString()}</div>
          <div className="text-xs text-slate-400">{pct(totalAdsLPV, totalAdsImpr)}% of impressions</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">Pixel PageView</div>
          <div className="text-xl font-extrabold text-indigo-700">{totalPixelPV.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Ads est. {pct(Math.min(totalAdsLPV, totalPixelPV), totalPixelPV)}% of total</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">Spend</div>
          <div className="text-xl font-extrabold text-emerald-700">{fmt(totalAdsSpend)}đ</div>
          <div className="text-xs text-slate-400">CPL pixel {totalPixelFS > 0 ? fmt(totalAdsSpend / totalPixelFS) + 'đ' : '—'}</div>
        </div>
      </div>

      {/* Campaign table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 pr-3 font-semibold text-slate-500 whitespace-nowrap">Chiến dịch</th>
              <th className="py-2 px-2 font-semibold text-slate-500">Post</th>
              <th className="text-right py-2 px-2 font-semibold text-slate-500">Reach</th>
              <th className="text-right py-2 px-2 font-semibold text-slate-500">Impr.</th>
              <th className="text-right py-2 px-2 font-semibold text-slate-500">CTR (all)</th>
              <th className="text-right py-2 px-2 font-semibold text-slate-500">CTR (link)</th>
              <th className="text-right py-2 px-2 font-semibold text-slate-500">LPV</th>
              <th className="text-right py-2 px-2 font-semibold text-slate-500">CPM</th>
              <th className="text-right py-2 px-2 font-semibold text-slate-500">Spend</th>
              {totalAdsConv > 0 && <th className="text-right py-2 px-2 font-semibold text-slate-500">Conv.</th>}
              {totalAdsConv > 0 && <th className="text-right py-2 px-2 font-semibold text-slate-500">CVR</th>}
              {totalAdsConv > 0 && <th className="text-right py-2 pl-2 font-semibold text-slate-500">CPL</th>}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => {
              const conv = getConv(c);
              return (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-2 pr-3 font-medium text-slate-800 max-w-[160px] truncate" title={c.campaign_name as string}>{c.campaign_name}</td>
                  <td className="py-2 px-2 text-center">
                    {c.post_url ? (
                      <a href={c.post_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-xs font-medium underline">↗ Xem</a>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="py-2 px-2 text-right text-slate-600">{c.reach.toLocaleString()}</td>
                  <td className="py-2 px-2 text-right text-slate-600">{c.impressions.toLocaleString()}</td>
                  <td className="py-2 px-2 text-right">
                    <span className={`font-semibold ${c.ctr >= 2 ? 'text-emerald-600' : c.ctr >= 1 ? 'text-amber-600' : 'text-red-500'}`}>{fmtPct(c.ctr)}</span>
                  </td>
                  <td className="py-2 px-2 text-right">
                    {(() => { const lc = (c['link_click'] as number ?? 0); const lctr = c.impressions > 0 ? lc/c.impressions*100 : 0; return <span className={`font-semibold ${lctr >= 2 ? 'text-emerald-600' : lctr >= 1 ? 'text-amber-600' : 'text-red-500'}`}>{fmtPct(lctr)}</span>; })()}
                  </td>
                  <td className="py-2 px-2 text-right text-blue-600 font-medium">{c.landing_page_views.toLocaleString()}</td>
                  <td className="py-2 px-2 text-right text-slate-600">{fmt(c.cpm)}đ</td>
                  <td className="py-2 px-2 text-right font-medium text-slate-800">{fmt(c.spend)}đ</td>
                  {totalAdsConv > 0 && <td className="py-2 px-2 text-right text-emerald-600 font-bold">{conv}</td>}
                  {totalAdsConv > 0 && (() => {
                    const lpv = c.landing_page_views ?? 0;
                    const cvr = lpv > 0 ? +(conv / lpv * 100).toFixed(1) : 0;
                    return <td className="py-2 px-2 text-right">
                      <span className={`font-semibold ${cvr >= 15 ? 'text-emerald-600' : cvr >= 8 ? 'text-amber-600' : 'text-slate-500'}`}>{lpv > 0 ? cvr + '%' : '—'}</span>
                    </td>;
                  })()}
                  {totalAdsConv > 0 && <td className="py-2 pl-2 text-right text-slate-600">{conv > 0 ? fmt(c.spend / conv) + 'đ' : '—'}</td>}
                </tr>
              );
            })}
            <tr className="bg-slate-50 font-bold">
              <td className="py-2 pr-3 text-slate-700">Tổng</td>
              <td className="py-2 px-2" />
              <td className="py-2 px-2 text-right text-slate-700">{campaigns.reduce((s,c)=>s+c.reach,0).toLocaleString()}</td>
              <td className="py-2 px-2 text-right text-slate-700">{totalAdsImpr.toLocaleString()}</td>
              <td className="py-2 px-2 text-right text-slate-700">{fmtPct(totalAdsImpr > 0 ? campaigns.reduce((s,c)=>s+c.clicks,0)/totalAdsImpr*100 : 0)}</td>
              <td className="py-2 px-2 text-right text-slate-700">{fmtPct(totalAdsImpr > 0 ? campaigns.reduce((s,c)=>s+(c['link_click'] as number ?? 0),0)/totalAdsImpr*100 : 0)}</td>
              <td className="py-2 px-2 text-right text-blue-700">{totalAdsLPV.toLocaleString()}</td>
              <td className="py-2 px-2 text-right text-slate-700">{fmt(totalAdsSpend/Math.max(totalAdsImpr,1)*1000)}đ</td>
              <td className="py-2 px-2 text-right text-slate-700">{fmt(totalAdsSpend)}đ</td>
              {totalAdsConv > 0 && <td className="py-2 px-2 text-right text-emerald-700">{totalAdsConv}</td>}
              {totalAdsConv > 0 && <td className="py-2 px-2 text-right text-emerald-700 font-bold">{totalAdsLPV > 0 ? (totalAdsConv/totalAdsLPV*100).toFixed(1)+'%' : '—'}</td>}
              {totalAdsConv > 0 && <td className="py-2 pl-2 text-right text-slate-700">{totalAdsConv > 0 ? fmt(totalAdsSpend/totalAdsConv)+'đ' : '—'}</td>}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ads vs Organic CVR comparison */}
      {totalAdsLPV > 0 && totalPixelPV > 0 && (() => {
        const adsConv = totalAdsConv > 0 ? totalAdsConv : Math.round(totalPixelFS * totalAdsLPV / totalPixelPV);
        const adsLPVn = totalAdsLPV;
        const orgSessions = Math.max(totalPixelPV - adsLPVn, 0);
        const orgConv = Math.max(totalPixelFS - adsConv, 0);
        const adsCVR = adsLPVn > 0 ? +(adsConv / adsLPVn * 100).toFixed(1) : 0;
        const orgCVR = orgSessions > 0 ? +(orgConv / orgSessions * 100).toFixed(1) : 0;
        return (
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-2">Ads vs Organic — so sánh CVR</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-xs text-blue-600 font-semibold mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Facebook Ads
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-extrabold text-blue-700">{adsCVR}%</div>
                    <div className="text-xs text-slate-500 mt-0.5">CVR</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-800">{adsConv} leads</div>
                    <div className="text-xs text-slate-500">{adsLPVn.toLocaleString()} sessions</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-700">CPL: {adsConv > 0 ? fmt(totalAdsSpend / adsConv) + 'đ' : '—'}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="text-xs text-emerald-600 font-semibold mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Organic
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-extrabold text-emerald-700">{orgCVR}%</div>
                    <div className="text-xs text-slate-500 mt-0.5">CVR</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-800">{orgConv} leads</div>
                    <div className="text-xs text-slate-500">{orgSessions.toLocaleString()} sessions</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-emerald-700">CPL: 0đ (không tốn ads)</div>
              </div>
            </div>
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              {adsCVR > orgCVR
                ? `Ads CVR cao hơn organic ${(adsCVR - orgCVR).toFixed(1)}% — traffic từ ads đúng target hơn.`
                : adsCVR < orgCVR
                  ? `Organic CVR cao hơn ads ${(orgCVR - adsCVR).toFixed(1)}% — community/word-of-mouth chất lượng hơn. Cân nhắc tăng ngân sách retargeting thay vì cold traffic.`
                  : 'Ads và organic CVR tương đương.'}
              {' '}Tổng CPL thực (all traffic): <strong>{totalPixelFS > 0 ? fmt(totalAdsSpend / totalPixelFS) + 'đ' : '—'}</strong>.
            </div>
          </div>
        );
      })()}

      {/* LPV vs Pixel mapping explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
        <strong>Mapping Ads ↔ Pixel:</strong> Ads Landing Page Views ({totalAdsLPV.toLocaleString()}) là số lần người dùng click ads và load trang thành công.
        Pixel PageView ({totalPixelPV.toLocaleString()}) là tổng sessions kể cả organic.
        {totalAdsLPV > 0 && totalPixelPV > 0 && (
          <> Phần traffic organic ước tính: <strong>{(totalPixelPV - Math.min(totalAdsLPV, totalPixelPV)).toLocaleString()} sessions ({100 - pct(Math.min(totalAdsLPV, totalPixelPV), totalPixelPV)}%)</strong>.</>
        )}
      </div>
    </div>
  );
}

function SessionQualityCard({ hourly }: { hourly: HourRow[] }) {
  const qualityHours = hourly.filter(h => {
    const pv = h.PageView ?? 0; const fs = h.FormSubmit ?? 0; const t30 = h.TimeOnSite30s ?? 0; const s25 = h.ViewContentScroll25 ?? 0;
    return fs > 0 && (t30 >= fs || s25 >= fs);
  });
  const suspectHours = hourly.filter(h => {
    const pv = h.PageView ?? 0; const fs = h.FormSubmit ?? 0; const t30 = h.TimeOnSite30s ?? 0; const s25 = h.ViewContentScroll25 ?? 0;
    return fs > 0 && t30 < fs && s25 < fs;
  });
  const qualitySubmits = qualityHours.reduce((s, h) => s + (h.FormSubmit ?? 0), 0);
  const suspectSubmits = suspectHours.reduce((s, h) => s + (h.FormSubmit ?? 0), 0);
  const total = qualitySubmits + suspectSubmits;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-sm font-bold text-slate-700 mb-1">Chất lượng phiên submit</div>
      <div className="text-xs text-slate-400 mb-4">Giờ có FormSubmit kèm engagement (Scroll25 hoặc Time30s) vs không có</div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-extrabold text-emerald-600">{qualitySubmits}</div>
          <div className="text-xs text-emerald-700 font-medium mt-0.5">Có engagement</div>
          <div className="text-xs text-slate-400">{pct(qualitySubmits, total)}% tổng leads</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-extrabold text-amber-600">{suspectSubmits}</div>
          <div className="text-xs text-amber-700 font-medium mt-0.5">Submit nhanh</div>
          <div className="text-xs text-slate-400">{pct(suspectSubmits, total)}% — vào thẳng form</div>
        </div>
      </div>
      <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
        <strong>Giải thích:</strong> "Submit nhanh" không phải fake — form nằm đầu trang nên user có intent cao submit ngay mà chưa kịp scroll. Cả 2 nhóm đều là lead thật.
      </div>
    </div>
  );
}

function toDateInput(d: Date) { return d.toISOString().slice(0, 10); }

function AnalyticsTab() {
  const [data, setData] = useState<PixelData | null>(null);
  const [adsData, setAdsData] = useState<AdsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const isCustom = from || to;

  const load = useCallback(async (d: number, f: string, t: string) => {
    setLoading(true); setError('');
    try {
      const params = f || t ? `from=${f || ''}&to=${t || ''}` : `days=${d}`;
      const [pixelRes, adsRes] = await Promise.all([
        fetch(`/api/analytics/pixel?${params}`),
        fetch(`/api/analytics/ads?${params}`),
      ]);
      if (!pixelRes.ok) throw new Error(await pixelRes.text());
      setData(await pixelRes.json());
      // Ads may fail if token lacks ads_read — don't throw, just store
      if (adsRes.ok) {
        const ads = await adsRes.json() as AdsData;
        setAdsData(ads.error ? null : ads);
      } else {
        setAdsData(null);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(days, from, to); }, [days, load]); // only auto-reload on days change

  function applyCustom() { load(days, from, to); }
  function clearCustom() { setFrom(''); setTo(''); load(days, '', ''); }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (error) return <div className="text-red-500 text-center py-10 text-sm">{error}</div>;
  if (!data) return null;

  const t = data.totals;
  const pv = t.PageView ?? 0;
  const fs = t.FormSubmit ?? 0;
  const cvr = pct(fs, pv);
  const engaged = t.TimeOnSite30s ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Pixel Analytics — Detec</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isCustom
              ? `Khoảng ngày tùy chọn${from ? ` từ ${from}` : ''}${to ? ` đến ${to}` : ''}`
              : `Dữ liệu từ Facebook Pixel · ${data.days} ngày gần nhất`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick selectors */}
          <div className="flex gap-1">
            {[7, 14, 30].map(d => (
              <button key={d} onClick={() => { clearCustom(); setDays(d); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${!isCustom && days === d ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {d}d
              </button>
            ))}
          </div>
          {/* Date range */}
          <div className="flex items-center gap-1.5">
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} max={to || toDateInput(new Date())}
              className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary" />
            <span className="text-xs text-slate-400">→</span>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} min={from} max={toDateInput(new Date())}
              className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary" />
            <button onClick={applyCustom} disabled={!from && !to}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white disabled:opacity-40 hover:bg-primary/90 transition">
              Lọc
            </button>
            {isCustom && (
              <button onClick={clearCustom} className="px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-100 transition">✕</button>
            )}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Sessions" value={pv.toLocaleString()} sub={`${data.days} ngày`} />
        <KpiCard label="Leads" value={fs.toLocaleString()} sub="FormSubmit" />
        <KpiCard label="CVR" value={`${cvr}%`} sub="Submit / PageView"
          status={<StatusBadge value={cvr} warn={8} bad={3} />} />
        <KpiCard label="Engaged (30s+)" value={`${pct(engaged, pv)}%`} sub={`${engaged.toLocaleString()} người`}
          status={<StatusBadge value={pct(engaged, pv)} warn={40} bad={20} />} />
      </div>

      {/* Funnel + Chart */}
      <div className="grid md:grid-cols-2 gap-4 items-start">
        {/* Funnel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm font-bold text-slate-700 mb-4">Engagement Funnel</div>
          <div className="flex flex-col gap-3">
            <FunnelBar label="PageView" count={pv} base={pv} color="bg-slate-400" />
            <FunnelBar label="Scroll 25%" count={t.ViewContentScroll25 ?? 0} base={pv} color="bg-blue-400" />
            <FunnelBar label="Scroll 50%" count={t.ViewContentScroll50 ?? 0} base={pv} color="bg-blue-500" />
            <FunnelBar label="Scroll 75%" count={t.ViewContentScroll75 ?? 0} base={pv} color="bg-indigo-500" />
            <FunnelBar label="Scroll 90%" count={t.ViewContentScroll90 ?? 0} base={pv} color="bg-violet-500" />
            <div className="border-t border-dashed border-slate-200 my-1" />
            <FunnelBar label="Time 30s+" count={t.TimeOnSite30s ?? 0} base={pv} color="bg-amber-400" />
            <FunnelBar label="Time 60s+" count={t.TimeOnSite60s ?? 0} base={pv} color="bg-orange-400" />
            <FunnelBar label="Time 120s+" count={t.TimeOnSite120s ?? 0} base={pv} color="bg-red-400" />
            <div className="border-t border-dashed border-slate-200 my-1" />
            <FunnelBar label="FormSubmit ✓" count={fs} base={pv} color="bg-emerald-500" />
          </div>
        </div>

        {/* Daily chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm font-bold text-slate-700 mb-1">Sessions theo ngày</div>
          <div className="text-xs text-slate-400 mb-4">Xanh = leads · Xám = sessions · % = CVR</div>
          <div>
            <MiniBarChart data={data.daily} />
          </div>
          <div className="mt-4 flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-slate-200 inline-block" />Volume</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary/60 inline-block" />CVR</span>
          </div>
        </div>
      </div>

      {/* Hourly + Source + Session quality */}
      <HourlyCVRChart data={data.hourly} />
      <div className="grid md:grid-cols-2 gap-4">
        <TrafficSourceCard daily={data.daily} adsData={adsData} />
        <SessionQualityCard hourly={data.hourly} />
      </div>

      {/* Ads Performance */}
      {adsData && adsData.campaigns?.length > 0 ? (
        <AdsPerformanceSection adsData={adsData} pixelData={data} />
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-5 text-center text-xs text-slate-400">
          Không có dữ liệu Ads — token cần quyền <code className="bg-slate-100 px-1 rounded">ads_read</code>
        </div>
      )}

    </div>
  );
}

// ─── Dashboard ───
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const getTabFromHash = (): Tab => {
    const h = window.location.hash.slice(1) as Tab;
    return ['users', 'submit-logs', 'analytics'].includes(h) ? h : 'users';
  };
  const [tab, setTab] = useState<Tab>(getTabFromHash);

  const switchTab = (t: Tab) => {
    setTab(t);
    window.location.hash = t === 'users' ? '' : t;
  };

  useEffect(() => {
    const onHash = () => setTab(getTabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-slate-900">DETEC Admin</h1>
            <nav className="flex gap-1">
              <button
                onClick={() => switchTab('users')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'users' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Học viên
              </button>
              <button
                onClick={() => switchTab('submit-logs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'submit-logs' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Lịch sử đăng ký
              </button>
              <button
                onClick={() => switchTab('analytics')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'analytics' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Analytics
              </button>
            </nav>
          </div>
          <button onClick={onLogout} className="text-sm text-slate-500 hover:text-red-500 font-medium transition">
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {tab === 'users' ? <UsersTab /> : tab === 'submit-logs' ? <SubmitLogsTab /> : <AnalyticsTab />}
      </main>
    </div>
  );
}

// ─── Admin App ───
export default function Admin() {
  const [authed, setAuthed] = useState(!!getToken());

  const handleLogout = () => {
    clearToken();
    setAuthed(false);
  };

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={handleLogout} />;
}
