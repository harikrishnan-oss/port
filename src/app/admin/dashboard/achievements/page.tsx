"use client";

import { Plus, Trash2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { addAchievementServer, updateAchievementServer, removeAchievementServer, getAchievementsServer } from "@/app/actions/achievements";

interface Achievement {
    id?: string;
    year: string;
    title: string;
    org: string;
    description: string;
    order?: number;
}

export default function ManageAchievementsPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [formData, setFormData] = useState<Achievement>({ year: "", title: "", org: "", description: "" });
    const [editId, setEditId] = useState<string | null>(null);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const fetchAchievements = async () => {
            const res = await getAchievementsServer();
            if (res.success && res.data) {
                const mapped = res.data.map((a: any) => ({
                    id: a.id,
                    year: a.date || "",
                    title: a.title || "",
                    org: a.icon || "",
                    description: a.description || "",
                    order: a.order || 0
                }));
                setAchievements(mapped);
            }
        };
        fetchAchievements();
    }, []);

    const handleSubmit = async () => {
        if (!formData.year || !formData.title) return;

        if (editId) {
            // Update existing
            const res = await updateAchievementServer(editId, {
                title: formData.title,
                description: formData.description,
                date: formData.year,
                icon: formData.org
            });

            if (res.success) {
                const updated = achievements.map(a => a.id === editId ? { ...formData, id: editId, order: a.order } : a);
                setAchievements(updated);
                setMsg("Achievement updated successfully");
            } else {
                console.error(res.error);
                setMsg("Failed to update achievement: " + String(res.error));
            }
            setEditId(null);
        } else {
            // Add new
            const newOrder = achievements.length > 0 ? Math.max(...achievements.map(a => a.order || 0)) + 1 : 0;
            const res = await addAchievementServer({
                title: formData.title,
                description: formData.description,
                date: formData.year,
                icon: formData.org,
                order: newOrder
            });

            if (res.success && res.data && res.data.length > 0) {
                const a = res.data[0];
                const newAchievement: Achievement = {
                    id: a.id,
                    year: a.date || "",
                    title: a.title || "",
                    org: a.icon || "",
                    description: a.description || "",
                    order: a.order || 0
                };
                setAchievements([newAchievement, ...achievements]);
                setMsg("Achievement added successfully");
            } else {
                console.error(res.error);
                setMsg("Failed to add achievement: " + String(res.error));
            }
        }

        setFormData({ year: "", title: "", org: "", description: "" });
        setTimeout(() => setMsg(""), 3000);
    };

    const handleEdit = (achievement: Achievement) => {
        setFormData(achievement);
        setEditId(achievement.id || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (confirm("Are you sure you want to delete this achievement?")) {
            const res = await removeAchievementServer(id);
            if (res.success) {
                setAchievements(achievements.filter(a => a.id !== id));
                if (editId === id) {
                    setEditId(null);
                    setFormData({ year: "", title: "", org: "", description: "" });
                }
                setMsg("Achievement deleted successfully");
                setTimeout(() => setMsg(""), 3000);
            } else {
                console.error(res.error);
                setMsg("Failed to delete: " + String(res.error));
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="section-title" style={{ marginBottom: 0 }}>Achievements</h1>
                {editId && (
                    <button
                        className="btn btn-outline"
                        onClick={() => {
                            setEditId(null);
                            setFormData({ year: "", title: "", org: "", description: "" });
                        }}
                    >
                        Cancel Edit
                    </button>
                )}
            </div>

            {msg && (
                <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid var(--success)',
                    color: 'var(--success)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                }}>
                    {msg}
                </div>
            )}

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                    {editId ? 'Edit Achievement' : 'Add New'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label className="label">Year</label>
                        <input
                            className="input"
                            placeholder="2024"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="label">Title</label>
                        <input
                            className="input"
                            placeholder="Award Name"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Organization / Event</label>
                    <input
                        className="input"
                        placeholder="Organization Name"
                        value={formData.org}
                        onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Description</label>
                    <textarea
                        className="input"
                        placeholder="Short description..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{ minHeight: '80px', resize: 'vertical' }}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleSubmit}>
                    {editId ? 'Update Achievement' : 'Add Achievement'}
                </button>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {achievements.map((item, index) => (
                    <div key={index} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', padding: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{item.year}</span>
                                <span style={{ fontSize: '1.1rem', color: 'var(--foreground)', fontWeight: 600 }}>{item.title}</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{item.org}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.description}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className="btn btn-outline"
                                style={{ padding: '0.4rem' }}
                                onClick={() => handleEdit(item)}
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ padding: '0.4rem', color: 'var(--danger)', borderColor: 'transparant' }}
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {achievements.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                        No achievements found. Add one above!
                    </div>
                )}
            </div>
        </div>
    );
}
