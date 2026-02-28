"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { addSkillServer, removeSkillServer, getSkillsServer } from "@/app/actions/skills";

interface Skill {
    id: string;
    name: string;
    order: number;
}

export default function ManageSkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [newSkill, setNewSkill] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const fetchSkills = async () => {
            const res = await getSkillsServer();

            if (res.success && res.data) {
                setSkills(res.data);
            }
        };
        fetchSkills();
    }, []);

    const addSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newSkill.trim();
        if (trimmed && !skills.some(s => s.name === trimmed)) {
            const newOrder = skills.length > 0 ? Math.max(...skills.map(s => s.order || 0)) + 1 : 0;

            const res = await addSkillServer(trimmed, newOrder);

            if (res.success && res.data && res.data.length > 0) {
                setSkills([...skills, res.data[0]]);
                setNewSkill("");
                setMsg("Skill added successfully!");
                setTimeout(() => setMsg(""), 3000);
            } else {
                console.error("Error adding skill", res.error);
                setMsg("Failed to add skill: " + String(res.error));
            }
        }
    };

    const removeSkill = async (id: string) => {
        const res = await removeSkillServer(id);
        if (res.success) {
            setSkills(skills.filter(s => s.id !== id));
            setMsg("Skill removed successfully!");
            setTimeout(() => setMsg(""), 3000);
        } else {
            console.error("Error removing skill", res.error);
            setMsg("Failed to remove skill: " + String(res.error));
        }
    };

    return (
        <div>
            <h1 className="section-title">Manage Skills</h1>

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
                <form onSubmit={addSkill} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        className="input"
                        placeholder="Add a new skill (e.g. GraphQL)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        <Plus size={18} /> Add
                    </button>
                </form>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--foreground)' }}>Current Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                    {skills.map(skill => (
                        <div key={skill.id} style={{
                            background: 'var(--background)',
                            border: '1px solid var(--border)',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem'
                        }}>
                            {skill.name}
                            <button
                                onClick={() => removeSkill(skill.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                                className="hover:text-red-500"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
