import { useState, useEffect, useCallback } from 'react';

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

type Tab = 'users' | 'submit-logs';

// ─── Auth helpers ───
function getToken() { return localStorage.getItem('detec_admin_token') || ''; }
function setToken(t: string) { localStorage.setItem('detec_admin_token', t); }
function clearToken() { localStorage.removeItem('detec_admin_token'); }

// ─── Export CSV (mở được bằng Excel) ───
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

async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...opts.headers,
    },
  });
  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin';
    throw new Error('Phiên đăng nhập hết hạn');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
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
          <button
            onClick={() => exportCSV(
              filtered.map(u => ({ ID: u.id, 'Họ tên': u.name, Email: u.email, 'SĐT': u.phone, 'Thành phố': u.city, 'Phòng khám': u.clinic_name, 'Ngày tạo': u.created_at ?? '' })),
              `hoc-vien-${new Date().toISOString().slice(0,10)}.csv`
            )}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-500 transition whitespace-nowrap"
          >
            ↓ Excel
          </button>
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
          <button
            onClick={() => exportCSV(
              filtered.map(l => ({ ID: l.id, 'Họ tên': l.name, Email: l.email, 'SĐT': l.phone, 'Thành phố': l.city, 'Phòng khám': l.clinic_name, 'Thời gian đăng ký': formatDate(l.submitted_at) })),
              `lich-su-dang-ky-${new Date().toISOString().slice(0,10)}.csv`
            )}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-500 transition whitespace-nowrap"
          >
            ↓ Excel
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

// ─── Dashboard ───
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('users');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-slate-900">DETEC Admin</h1>
            <nav className="flex gap-1">
              <button
                onClick={() => setTab('users')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'users' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Học viên
              </button>
              <button
                onClick={() => setTab('submit-logs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'submit-logs' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Lịch sử đăng ký
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
        {tab === 'users' ? <UsersTab /> : <SubmitLogsTab />}
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
