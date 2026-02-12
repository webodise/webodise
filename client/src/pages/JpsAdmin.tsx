import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Bell, Download, Eye, FileUp, ImageIcon, LogOut, MessageSquare, Shield, Trash2, Upload, UserPlus, Users2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const SESSION_STORAGE_KEY = 'jps_admin_session_v1';
const DEFAULT_ADMISSIONS_BADGE_TEXT = 'Admissions Open 2026-27';

const categories = ['Events', 'Activities', 'Campus'];
const subcategories: Record<string, string[]> = {
  Events: ['Republic Day', 'Independence Day', 'Annual Day', 'Prize Distribution', 'Sports Day'],
  Activities: ['Club Events', 'Workshops', 'Seminars', 'Competitions', 'Performances'],
  Campus: ['Infrastructure', 'Facilities', 'Students', 'Staff', 'Event Venues']
};

type AdminRole = 'admin' | 'superadmin';

type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
};

type ManagedAdminUser = {
  id: string;
  email: string;
  role: AdminRole;
  createdAt?: string;
  createdBy?: string | null;
};

type AdminSession = {
  token: string;
  user: AdminUser;
};

type AdmissionFormData = {
  id: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

type NoticeData = {
  id: string;
  text: string;
  noticeDate?: string;
  createdAt?: string;
};

type PopupVariant = 'success' | 'error' | 'info';

type PopupState = {
  isOpen: boolean;
  message: string;
  variant: PopupVariant;
};

type ConfirmDialogState = {
  isOpen: boolean;
  message: string;
  confirmLabel: string;
  isSubmitting: boolean;
};

function getAuthHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

function parseStoredSession(raw: string | null): AdminSession | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.token !== 'string' || !parsed.token) return null;
    if (!parsed.user || typeof parsed.user !== 'object') return null;
    if (typeof parsed.user.email !== 'string' || !parsed.user.email) return null;
    if (parsed.user.role !== 'admin' && parsed.user.role !== 'superadmin') return null;

    return {
      token: parsed.token,
      user: {
        id: String(parsed.user.id || ''),
        email: parsed.user.email,
        role: parsed.user.role
      }
    };
  } catch {
    return null;
  }
}

function resolveAssetUrl(assetPath: string): string {
  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }
  return `${API_BASE}${assetPath}`;
}

function resolveMomentImageUrl(imagePath: string): string {
  return resolveAssetUrl(imagePath);
}

function buildRoleDrafts(users: ManagedAdminUser[]): Record<string, AdminRole> {
  const nextDrafts: Record<string, AdminRole> = {};
  for (const user of users) {
    nextDrafts[user.id] = user.role;
  }
  return nextDrafts;
}

export default function JpsAdmin() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [moments, setMoments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [activeSection, setActiveSection] = useState<'home' | 'moments' | 'messages' | 'notices' | 'roles' | 'admissionForm'>('home');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Events');
  const [subcategory, setSubcategory] = useState('Republic Day');
  const [eventDate, setEventDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showCreateUserBox, setShowCreateUserBox] = useState(false);
  const [createUserEmail, setCreateUserEmail] = useState('');
  const [createUserPassword, setCreateUserPassword] = useState('');
  const [createUserRole, setCreateUserRole] = useState<AdminRole>('admin');
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [managedUsers, setManagedUsers] = useState<ManagedAdminUser[]>([]);
  const [managedUsersLoading, setManagedUsersLoading] = useState(false);
  const [deletingManagedUserId, setDeletingManagedUserId] = useState('');
  const [updatingManagedUserId, setUpdatingManagedUserId] = useState('');
  const [roleDrafts, setRoleDrafts] = useState<Record<string, AdminRole>>({});
  const [admissionFormLoading, setAdmissionFormLoading] = useState(false);
  const [admissionFormUploading, setAdmissionFormUploading] = useState(false);
  const [admissionFormDeleting, setAdmissionFormDeleting] = useState(false);
  const [admissionFormFile, setAdmissionFormFile] = useState<File | null>(null);
  const [admissionForm, setAdmissionForm] = useState<AdmissionFormData | null>(null);
  const [noticeText, setNoticeText] = useState('');
  const [noticeDate, setNoticeDate] = useState('');
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticePublishing, setNoticePublishing] = useState(false);
  const [noticeDeletingId, setNoticeDeletingId] = useState('');
  const [admissionsBadgeText, setAdmissionsBadgeText] = useState(DEFAULT_ADMISSIONS_BADGE_TEXT);
  const [admissionsBadgeSaving, setAdmissionsBadgeSaving] = useState(false);
  const [popup, setPopup] = useState<PopupState>({
    isOpen: false,
    message: '',
    variant: 'info'
  });
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    message: '',
    confirmLabel: 'Confirm',
    isSubmitting: false
  });
  const confirmActionRef = useRef<null | (() => Promise<void> | void)>(null);

  const authToken = session?.token || '';
  const isSuperAdmin = session?.user.role === 'superadmin';
  const unreadMessageCount = useMemo(
    () => messages.filter((message) => message.status === 'new').length,
    [messages]
  );

  function persistSession(nextSession: AdminSession | null) {
    if (nextSession) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setSession(nextSession);
  }

  function showPopup(message: string, variant: PopupVariant = 'info') {
    setPopup({
      isOpen: true,
      message,
      variant
    });
  }

  function closePopup() {
    setPopup((currentPopup) => ({ ...currentPopup, isOpen: false }));
  }

  function openConfirmDialog(message: string, onConfirm: () => Promise<void> | void, confirmLabel = 'Delete') {
    confirmActionRef.current = onConfirm;
    setConfirmDialog({
      isOpen: true,
      message,
      confirmLabel,
      isSubmitting: false
    });
  }

  function closeConfirmDialog() {
    setConfirmDialog((currentDialog) => {
      if (currentDialog.isSubmitting) return currentDialog;
      confirmActionRef.current = null;
      return {
        isOpen: false,
        message: '',
        confirmLabel: 'Confirm',
        isSubmitting: false
      };
    });
  }

  async function runConfirmDialogAction() {
    if (!confirmActionRef.current) {
      closeConfirmDialog();
      return;
    }

    setConfirmDialog((currentDialog) => ({
      ...currentDialog,
      isSubmitting: true
    }));

    try {
      await confirmActionRef.current();
    } finally {
      confirmActionRef.current = null;
      setConfirmDialog({
        isOpen: false,
        message: '',
        confirmLabel: 'Confirm',
        isSubmitting: false
      });
    }
  }

  async function loadMoments() {
    try {
      const res = await fetch(`${API_BASE}/api/moments`);
      if (!res.ok) throw new Error('Failed to load moments');
      const data = await res.json();
      setMoments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMessages(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        headers: getAuthHeaders(token)
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      if (!res.ok) throw new Error('Failed to load messages');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadManagedUsers(token: string) {
    setManagedUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin-auth/users`, {
        headers: getAuthHeaders(token)
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      if (!res.ok) throw new Error('Failed to load admin users');
      const data = await res.json();
      const nextUsers = Array.isArray(data) ? data : [];
      setManagedUsers(nextUsers);
      setRoleDrafts(buildRoleDrafts(nextUsers));
    } catch (error) {
      console.error(error);
    } finally {
      setManagedUsersLoading(false);
    }
  }

  async function loadAdmissionForm() {
    setAdmissionFormLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admission-form`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load admission form');
      }

      setAdmissionForm(data.form || null);
    } catch (error) {
      console.error(error);
      setAdmissionForm(null);
    } finally {
      setAdmissionFormLoading(false);
    }
  }

  async function loadNotices() {
    setNoticesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/notices`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load notices');
      }

      setNotices(Array.isArray(data.notices) ? data.notices : []);
    } catch (error) {
      console.error(error);
      setNotices([]);
    } finally {
      setNoticesLoading(false);
    }
  }

  async function loadAdmissionsBadgeText() {
    try {
      const res = await fetch(`${API_BASE}/api/site-settings/admissions-badge`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load admission badge text');
      }

      const badgeText = String(data.text || '').trim();
      setAdmissionsBadgeText(badgeText || DEFAULT_ADMISSIONS_BADGE_TEXT);
    } catch (error) {
      console.error(error);
      setAdmissionsBadgeText(DEFAULT_ADMISSIONS_BADGE_TEXT);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const stored = parseStoredSession(localStorage.getItem(SESSION_STORAGE_KEY));

      if (!stored) {
        if (!cancelled) setAuthLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/admin-auth/me`, {
          headers: getAuthHeaders(stored.token)
        });

        if (!res.ok) {
          throw new Error('Invalid session');
        }

        const data = await res.json();
        const validatedSession: AdminSession = {
          token: stored.token,
          user: data.user
        };

        if (!cancelled) {
          persistSession(validatedSession);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          persistSession(null);
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setMoments([]);
      setMessages([]);
      setNotices([]);
      setManagedUsers([]);
      setRoleDrafts({});
      setAdmissionForm(null);
      setAdmissionFormFile(null);
      setAdmissionFormDeleting(false);
      setNoticeText('');
      setNoticeDate('');
      setNoticeDeletingId('');
      setAdmissionsBadgeText(DEFAULT_ADMISSIONS_BADGE_TEXT);
      setAdmissionsBadgeSaving(false);
      return;
    }

    loadMoments();
    loadMessages(session.token);
    loadAdmissionForm();
    loadNotices();
    loadAdmissionsBadgeText();
    if (session.user.role === 'superadmin') {
      loadManagedUsers(session.token);
    } else {
      setManagedUsers([]);
      setRoleDrafts({});
    }
  }, [session]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    if (activeSection === 'roles' && !isSuperAdmin) {
      setActiveSection('home');
    }
  }, [activeSection, isSuperAdmin]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin-auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const nextSession: AdminSession = {
        token: data.token,
        user: data.user
      };

      persistSession(nextSession);
      setLoginPassword('');
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Login failed', 'error');
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    persistSession(null);
    setActiveSection('home');
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!authToken) return;

    setLoading(true);

    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('category', category);
      form.append('subcategory', subcategory);
      if (eventDate) form.append('eventDate', eventDate);
      form.append('isTop', 'false');
      if (file) form.append('image', file);

      const res = await fetch(`${API_BASE}/api/moments`, {
        method: 'POST',
        body: form,
        headers: getAuthHeaders(authToken)
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      setTitle('');
      setDescription('');
      setFile(null);
      setEventDate('');
      setCategory('Events');
      setSubcategory(subcategories.Events[0]);
      await loadMoments();
      showPopup('Moment uploaded successfully', 'success');
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!authToken) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/moments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(authToken)
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }

      await loadMoments();
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Delete failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function deleteMessage(id: string) {
    if (!authToken) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(authToken)
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }

      await loadMessages(authToken);
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Delete failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    if (!authToken) return;

    try {
      const res = await fetch(`${API_BASE}/api/messages/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(authToken)
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update message');
      }

      await loadMessages(authToken);
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Failed to update message', 'error');
    }
  }

  async function handleCreateDbAdmin(event: React.FormEvent) {
    event.preventDefault();
    if (!authToken || !isSuperAdmin) return;

    setCreateUserLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin-auth/users`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(authToken),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: createUserEmail,
          password: createUserPassword,
          role: createUserRole
        })
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setCreateUserEmail('');
      setCreateUserPassword('');
      setCreateUserRole('admin');
      await loadManagedUsers(authToken);
      showPopup(`${data.user.role} created for ${data.user.email}`, 'success');
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Failed to create user', 'error');
    } finally {
      setCreateUserLoading(false);
    }
  }

  async function handleDeleteManagedUser(user: ManagedAdminUser) {
    if (!authToken || !isSuperAdmin) return;

    setDeletingManagedUserId(user.id);

    try {
      const res = await fetch(`${API_BASE}/api/admin-auth/users/${user.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(authToken)
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to remove user');
      }

      setManagedUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== user.id));
      setRoleDrafts((currentDrafts) => {
        const nextDrafts = { ...currentDrafts };
        delete nextDrafts[user.id];
        return nextDrafts;
      });
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Failed to remove user', 'error');
    } finally {
      setDeletingManagedUserId('');
    }
  }

  async function handleUpdateManagedUserRole(user: ManagedAdminUser) {
    if (!authToken || !isSuperAdmin) return;

    const nextRole = roleDrafts[user.id] || user.role;
    if (nextRole === user.role) return;

    setUpdatingManagedUserId(user.id);

    try {
      const res = await fetch(`${API_BASE}/api/admin-auth/users/${user.id}/role`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(authToken),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: nextRole })
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update role');
      }

      const updatedRole: AdminRole = data?.user?.role === 'superadmin' ? 'superadmin' : 'admin';
      setManagedUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id ? { ...currentUser, role: updatedRole } : currentUser
        )
      );
      setRoleDrafts((currentDrafts) => ({ ...currentDrafts, [user.id]: updatedRole }));

      if (session && session.user.id === user.id) {
        persistSession({
          ...session,
          user: {
            ...session.user,
            role: updatedRole
          }
        });
      }
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Failed to update role', 'error');
    } finally {
      setUpdatingManagedUserId('');
    }
  }

  async function handleAdmissionFormUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!authToken) return;
    if (!admissionFormFile) {
      showPopup('Please select a PDF, DOC, or DOCX file');
      return;
    }

    setAdmissionFormUploading(true);

    try {
      const formData = new FormData();
      formData.append('formFile', admissionFormFile);

      const res = await fetch(`${API_BASE}/api/admission-form`, {
        method: 'POST',
        headers: getAuthHeaders(authToken),
        body: formData
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload admission form');
      }

      setAdmissionForm(data.form || null);
      setAdmissionFormFile(null);
      showPopup('Admission form uploaded successfully', 'success');
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Failed to upload admission form', 'error');
    } finally {
      setAdmissionFormUploading(false);
    }
  }

  async function handleAdmissionFormDelete() {
    if (!authToken || !admissionForm) return;

    setAdmissionFormDeleting(true);

    try {
      const res = await fetch(`${API_BASE}/api/admission-form/${admissionForm.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(authToken)
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete admission form');
      }

      await loadAdmissionForm();
      setAdmissionFormFile(null);
      showPopup('Admission form deleted successfully', 'success');
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Failed to delete admission form', 'error');
    } finally {
      setAdmissionFormDeleting(false);
    }
  }

  async function handleAdmissionsBadgeSave(event: React.FormEvent) {
    event.preventDefault();
    if (!authToken) return;

    const trimmedBadgeText = admissionsBadgeText.trim();
    if (!trimmedBadgeText) {
      showPopup('Please enter admission badge text');
      return;
    }

    setAdmissionsBadgeSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/site-settings/admissions-badge`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(authToken),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: trimmedBadgeText })
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update admission badge text');
      }

      const savedText = String(data.text || '').trim() || DEFAULT_ADMISSIONS_BADGE_TEXT;
      setAdmissionsBadgeText(savedText);
      showPopup('Admission badge text updated successfully', 'success');
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Failed to update admission badge text', 'error');
    } finally {
      setAdmissionsBadgeSaving(false);
    }
  }

  async function handleNoticePublish(event: React.FormEvent) {
    event.preventDefault();
    if (!authToken) return;

    const trimmedNoticeText = noticeText.trim();
    if (!trimmedNoticeText) {
      showPopup('Please enter notice text');
      return;
    }

    setNoticePublishing(true);

    try {
      const payload: { text: string; noticeDate?: string } = { text: trimmedNoticeText };
      if (noticeDate) {
        payload.noticeDate = noticeDate;
      }

      const res = await fetch(`${API_BASE}/api/notices`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(authToken),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish notice');
      }

      setNoticeText('');
      setNoticeDate('');
      await loadNotices();
      showPopup('Notice published successfully', 'success');
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Failed to publish notice', 'error');
    } finally {
      setNoticePublishing(false);
    }
  }

  async function handleNoticeDelete(id: string) {
    if (!authToken) return;

    setNoticeDeletingId(id);

    try {
      const res = await fetch(`${API_BASE}/api/notices/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(authToken)
      });

      if (res.status === 401) {
        persistSession(null);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete notice');
      }

      setNotices((currentNotices) => currentNotices.filter((notice) => notice.id !== id));
      showPopup('Notice deleted successfully', 'success');
    } catch (error) {
      console.error(error);
      showPopup((error as Error).message || 'Failed to delete notice', 'error');
    } finally {
      setNoticeDeletingId('');
    }
  }

  const popupTitle = popup.variant === 'success' ? 'Success' : popup.variant === 'error' ? 'Error' : 'Notice';
  const popupTitleClasses =
    popup.variant === 'success'
      ? 'bg-emerald-100 text-emerald-700'
      : popup.variant === 'error'
        ? 'bg-red-100 text-red-700'
        : 'bg-blue-100 text-blue-700';
  const confirmDialogModal = confirmDialog.isOpen ? (
    <div
      className="fixed inset-0 z-[121] flex items-center justify-center bg-slate-900/45 px-4"
      onClick={closeConfirmDialog}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Confirm</p>
        <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">{confirmDialog.message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeConfirmDialog}
            disabled={confirmDialog.isSubmitting}
            className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={runConfirmDialogAction}
            disabled={confirmDialog.isSubmitting}
            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {confirmDialog.isSubmitting ? 'Please wait...' : confirmDialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  ) : null;
  const popupModal = popup.isOpen ? (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/45 px-4"
      onClick={closePopup}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${popupTitleClasses}`}>{popupTitle}</p>
        <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">{popup.message}</p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={closePopup}
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  ) : null;

  if (authLoading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-20 px-4">
          <div className="max-w-md mx-auto bg-white shadow rounded-lg p-8 text-center">
            <p className="text-slate-600">Checking admin session...</p>
          </div>
        </div>
        {popupModal}
        {confirmDialogModal}
      </>
    );
  }

  if (!session) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-20 px-4">
          <div className="max-w-md mx-auto bg-white shadow-xl rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-7 h-7 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
                <p className="text-sm text-slate-600">Only admin and superadmin users are allowed.</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loginLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
        {popupModal}
        {confirmDialogModal}
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
              <p className="text-lg text-slate-600">Manage moments, messages, notices, roles, and admission form</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center justify-between gap-4">
              <div className="text-sm text-slate-700 min-w-0">
                <p className="font-semibold truncate">{session.user.email}</p>
                <p className="mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                  {session.user.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 shrink-0"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </header>

          {activeSection === 'roles' && isSuperAdmin && (
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-violet-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Superadmin Control</h2>
                  <p className="text-sm text-slate-600">Only superadmin can create admin or superadmin users.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateUserBox((value) => !value)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  {showCreateUserBox ? 'Hide Create Form' : 'Create Admin User'}
                </button>
              </div>

              {showCreateUserBox && (
                <form onSubmit={handleCreateDbAdmin} className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={createUserEmail}
                      onChange={(event) => setCreateUserEmail(event.target.value)}
                      placeholder="user@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={createUserPassword}
                      onChange={(event) => setCreateUserPassword(event.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <select
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={createUserRole}
                      onChange={(event) => setCreateUserRole(event.target.value as AdminRole)}
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={createUserLoading}
                      className="w-full px-4 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 disabled:opacity-50"
                    >
                      {createUserLoading ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-900">Admins and Superadmins</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Main account `webodise@gmail.com` is hidden here. You can remove anyone else.
                </p>

                {managedUsersLoading ? (
                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600">
                    Loading users...
                  </div>
                ) : managedUsers.length === 0 ? (
                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600">
                    No admin users found.
                  </div>
                ) : (
                  <div className="mt-4 overflow-x-auto border border-slate-200 rounded-xl bg-white">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Email</th>
                          <th className="text-left px-4 py-3 font-medium">Role</th>
                          <th className="text-left px-4 py-3 font-medium">Created</th>
                          <th className="text-right px-4 py-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {managedUsers.map((managedUser) => (
                          <tr key={managedUser.id} className="border-t border-slate-100">
                            <td className="px-4 py-3 text-slate-800">{managedUser.email}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <select
                                  value={roleDrafts[managedUser.id] || managedUser.role}
                                  onChange={(event) =>
                                    setRoleDrafts((currentDrafts) => ({
                                      ...currentDrafts,
                                      [managedUser.id]: event.target.value as AdminRole
                                    }))
                                  }
                                  className="border border-slate-300 rounded px-2 py-1"
                                  disabled={deletingManagedUserId === managedUser.id}
                                >
                                  <option value="admin">admin</option>
                                  <option value="superadmin">superadmin</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateManagedUserRole(managedUser)}
                                  disabled={
                                    deletingManagedUserId === managedUser.id ||
                                    updatingManagedUserId === managedUser.id ||
                                    (roleDrafts[managedUser.id] || managedUser.role) === managedUser.role
                                  }
                                  className="px-2 py-1 bg-slate-800 text-white rounded text-xs hover:bg-black disabled:opacity-50"
                                >
                                  {updatingManagedUserId === managedUser.id ? 'Saving...' : 'Save'}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {managedUser.createdAt ? new Date(managedUser.createdAt).toLocaleString('en-IN') : '-'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  openConfirmDialog(
                                    `Remove ${managedUser.email} (${managedUser.role})?`,
                                    () => handleDeleteManagedUser(managedUser),
                                    'Remove'
                                  )
                                }
                                disabled={deletingManagedUserId === managedUser.id}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                {deletingManagedUserId === managedUser.id ? 'Removing...' : 'Remove'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'home' ? (
            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Quick Controls</h2>
                <p className="text-xs sm:text-sm text-slate-500">Choose a card to manage that section.</p>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${isSuperAdmin ? 'xl:grid-cols-4' : 'xl:grid-cols-4'}`}>
                <button
                  type="button"
                  onClick={() => setActiveSection('moments')}
                  className="group relative overflow-hidden text-left rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-500" />
                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        <ImageIcon className="w-6 h-6" />
                      </span>
                      <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                        Gallery
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Moments Control</h2>
                    <p className="text-sm text-slate-600 mt-1">Upload, manage and delete gallery moments.</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                        {moments.length} total moments
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors group-hover:text-blue-700">
                        Open section
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('messages')}
                  className="group relative overflow-hidden text-left rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                        <MessageSquare className="w-6 h-6" />
                      </span>
                      <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        Inbox
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Message Control</h2>
                    <p className="text-sm text-slate-600 mt-1">View, mark and remove contact messages.</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        {unreadMessageCount} unread messages
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors group-hover:text-emerald-700">
                        Open section
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('admissionForm')}
                  className="group relative overflow-hidden text-left rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-amber-300"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                        <FileUp className="w-6 h-6" />
                      </span>
                      <span className="inline-flex items-center rounded-full border border-amber-100 bg-amber-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                        Admission
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Admission Form Control</h2>
                    <p className="text-sm text-slate-600 mt-1">Upload PDF or Word form for users to download.</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                        {admissionForm ? 'Latest form is active' : 'No form uploaded yet'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors group-hover:text-amber-700">
                        Open section
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('notices')}
                  className="group relative overflow-hidden text-left rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-300"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 to-sky-500" />
                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100">
                        <Bell className="w-6 h-6" />
                      </span>
                      <span className="inline-flex items-center rounded-full border border-cyan-100 bg-cyan-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-700">
                        Homepage
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Notice Control</h2>
                    <p className="text-sm text-slate-600 mt-1">Post and remove notices shown on homepage notice board.</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-100">
                        {notices.length} active notices
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors group-hover:text-cyan-700">
                        Open section
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </button>

                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => setActiveSection('roles')}
                    className="group relative overflow-hidden text-left rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-violet-300"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                    <div className="relative">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                          <Users2 className="w-6 h-6" />
                        </span>
                        <span className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700">
                          Superadmin
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-slate-900">Role Control</h2>
                      <p className="text-sm text-slate-600 mt-1">Create users, edit roles, and manage admin access.</p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">
                          {managedUsers.length} manageable users
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors group-hover:text-violet-700">
                          Open section
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-600 shadow-sm">
                Open any control card to view and manage that section in detail.
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setActiveSection('home')}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Controls
              </button>
            </div>
          )}

          {activeSection === 'notices' && (
            <div className="bg-white shadow-lg rounded-2xl p-6 md:p-7 mb-8 border border-cyan-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-1">Notice Board Control</h2>
                  <p className="text-sm text-slate-600">
                    Add latest school notices here. These notices are visible on the home page notice board.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-cyan-50 text-cyan-700 px-3 py-1 text-xs font-semibold border border-cyan-200">
                  <Bell className="w-3.5 h-3.5" />
                  Public Homepage
                </div>
              </div>

              <div className="mb-6 border border-cyan-200 rounded-xl p-5 bg-gradient-to-br from-cyan-50 via-white to-white">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-slate-800">Homepage Admission Badge</h3>
                  <span className="text-xs rounded-full bg-white border border-cyan-200 text-cyan-700 px-2 py-1">
                    Live Hero Label
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  This text appears at the top of homepage hero section (for example: Admissions Open 2026-27).
                </p>
                <form onSubmit={handleAdmissionsBadgeSave} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                    <div className="w-full sm:max-w-sm">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={admissionsBadgeText}
                        onChange={(event) => setAdmissionsBadgeText(event.target.value)}
                        maxLength={120}
                        className="w-full h-10 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Admissions Open 2026-27"
                        disabled={admissionsBadgeSaving}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={admissionsBadgeSaving || !admissionsBadgeText.trim()}
                      className="h-10 w-full sm:w-auto whitespace-nowrap inline-flex items-center justify-center gap-2 px-4 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {admissionsBadgeSaving ? 'Saving...' : 'Update Badge'}
                    </button>
                    <p className="text-xs text-slate-500 sm:pb-2 whitespace-nowrap">
                      Preview: {admissionsBadgeText || DEFAULT_ADMISSIONS_BADGE_TEXT}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">{admissionsBadgeText.length}/120 characters</p>
                </form>
              </div>

              <form onSubmit={handleNoticePublish} className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 rounded-xl p-4 bg-white">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notice Text</label>
                  <textarea
                    value={noticeText}
                    onChange={(event) => setNoticeText(event.target.value)}
                    maxLength={500}
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    placeholder="Write notice message..."
                    disabled={noticePublishing}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">{noticeText.length}/500 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notice Date (Optional)</label>
                  <input
                    type="date"
                    value={noticeDate}
                    onChange={(event) => setNoticeDate(event.target.value)}
                    className="w-full h-10 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={noticePublishing}
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={noticePublishing || !noticeText.trim()}
                    className="h-11 inline-flex items-center gap-2 px-5 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {noticePublishing ? 'Publishing...' : 'Publish to Notice Board'}
                  </button>
                </div>
              </form>

              <div className="mt-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">Current Notices</h3>
                {noticesLoading ? (
                  <p className="text-sm text-slate-600">Loading notices...</p>
                ) : notices.length === 0 ? (
                  <p className="text-sm text-slate-600">No notices yet.</p>
                ) : (
                  <div className="space-y-3">
                    {notices.map((notice) => (
                      <div
                        key={notice.id}
                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border border-slate-200 rounded-xl bg-white px-3 py-3"
                      >
                        <div>
                          <p className="text-xs text-slate-500">
                            {new Date(notice.noticeDate || notice.createdAt || Date.now()).toLocaleDateString('en-IN')}
                          </p>
                          <p className="text-sm text-slate-800 whitespace-pre-wrap">{notice.text}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            openConfirmDialog(
                              'Delete this notice?',
                              () => handleNoticeDelete(notice.id),
                              'Delete'
                            )
                          }
                          disabled={noticeDeletingId === notice.id}
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          {noticeDeletingId === notice.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'admissionForm' && (
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-amber-100">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Admission Form Control</h2>
              <p className="text-sm text-slate-600 mb-5">
                Upload latest admission form in PDF, DOC, or DOCX. Users will download this file from admissions page.
              </p>

              <form onSubmit={handleAdmissionFormUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Admission Form File</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) => setAdmissionFormFile(event.target.files?.[0] || null)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    disabled={admissionFormUploading || admissionFormDeleting}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Allowed: PDF, DOC, DOCX (Max 15 MB)</p>
                </div>

                <button
                  type="submit"
                  disabled={admissionFormUploading || admissionFormDeleting || !admissionFormFile}
                  className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                >
                  {admissionFormUploading ? 'Uploading...' : 'Upload Form'}
                </button>
              </form>

              <div className="mt-6 border border-slate-200 rounded-lg p-4 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">Current Download File</h3>
                {admissionFormLoading ? (
                  <p className="text-sm text-slate-600">Loading current form...</p>
                ) : admissionForm ? (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-700">
                      <strong>File:</strong> {admissionForm.fileName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Uploaded: {new Date(admissionForm.createdAt).toLocaleString('en-IN')}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={resolveAssetUrl(admissionForm.filePath)}
                        target="_blank"
                        rel="noreferrer"
                        download={admissionForm.fileName}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded hover:bg-black text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download Current Form
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          openConfirmDialog(
                            admissionForm ? `Delete ${admissionForm.fileName}?` : 'Delete current admission form?',
                            handleAdmissionFormDelete,
                            'Delete'
                          )
                        }
                        disabled={admissionFormDeleting || admissionFormUploading}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {admissionFormDeleting ? 'Deleting...' : 'Delete Current Form'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">No admission form uploaded yet.</p>
                )}
              </div>
            </div>
          )}

          {activeSection === 'moments' && (
            <>
              <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-slate-800">Upload New Moment</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Event or activity title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                      <textarea
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Add details or caption"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                        <select
                          value={category}
                          onChange={(event) => {
                            setCategory(event.target.value);
                            setSubcategory(subcategories[event.target.value]?.[0] || '');
                          }}
                          className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {categories.map((currentCategory) => (
                            <option key={currentCategory} value={currentCategory}>
                              {currentCategory}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subcategory *</label>
                        <select
                          value={subcategory}
                          onChange={(event) => setSubcategory(event.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {subcategories[category]?.map((subCategory) => (
                            <option key={subCategory} value={subCategory}>
                              {subCategory}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Event Date and Time</label>
                      <input
                        type="datetime-local"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={eventDate}
                        onChange={(event) => setEventDate(event.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Image *</label>
                      <label className="w-full border-2 border-dashed border-slate-300 rounded-lg px-4 py-6 flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 transition">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => setFile(event.target.files?.[0] || null)}
                          required
                        />
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-600 text-center">Click to upload image</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {preview && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Preview</p>
                        <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg border border-slate-300" />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !file}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {loading ? 'Uploading...' : 'Upload Moment'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTitle('');
                        setDescription('');
                        setFile(null);
                        setEventDate('');
                        setCategory('Events');
                        setSubcategory(subcategories.Events[0]);
                      }}
                      className="w-full px-6 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6 text-slate-800">All Moments</h2>
                {moments.length === 0 ? (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <p className="text-slate-600">No moments yet. Upload your first one.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {moments.map((moment) => (
                      <div key={moment._id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition">
                        <div className="relative">
                          {moment.imagePath ? (
                            <img
                              src={resolveMomentImageUrl(moment.imagePath)}
                              className="w-full h-56 object-cover"
                              alt={moment.title}
                            />
                          ) : (
                            <div className="w-full h-56 bg-slate-100 flex items-center justify-center text-slate-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-slate-800">{moment.title}</h3>
                          {moment.description && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{moment.description}</p>}
                          <div className="mt-3 flex flex-wrap gap-1">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{moment.category}</span>
                            {moment.subcategory && (
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                {moment.subcategory}
                              </span>
                            )}
                          </div>
                          {moment.eventDate && (
                            <p className="text-xs text-slate-500 mt-2">{new Date(moment.eventDate).toLocaleDateString('en-IN')}</p>
                          )}
                          <button
                            onClick={() => openConfirmDialog('Delete this moment?', () => handleDelete(moment._id), 'Delete')}
                            disabled={loading}
                            className="w-full mt-4 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeSection === 'messages' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-slate-800">Contact Messages</h2>
              {messages.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-slate-600">No messages yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`bg-white rounded-lg p-6 shadow transition ${message.status === 'new' ? 'border-l-4 border-blue-500' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-slate-900 text-lg">{message.subject}</h3>
                            {message.status === 'new' && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">
                            <strong>From:</strong> {message.name} ({message.email})
                          </p>
                          {message.phone && (
                            <p className="text-sm text-slate-600">
                              <strong>Phone:</strong> {message.phone}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 mt-1">{new Date(message.createdAt).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex gap-2">
                          {message.status === 'new' && (
                            <button
                              onClick={() => markAsRead(message._id)}
                              className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" /> Read
                            </button>
                          )}
                          <button
                            onClick={() => openConfirmDialog('Delete this message?', () => deleteMessage(message._id), 'Delete')}
                            disabled={loading}
                            className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50 transition flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded p-4 mt-4">
                        <p className="text-slate-700 whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {popupModal}
      {confirmDialogModal}
    </>
  );
}
