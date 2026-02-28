"use client";

import { Plus, Trash2, Link as LinkIcon, Github, Pencil, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    link: string;
    github: string;
    order: number;
}

export default function ManageProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [msg, setMsg] = useState("");

    // Edit State
    const [editId, setEditId] = useState<string | null>(null);

    // Form States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [link, setLink] = useState("");
    const [github, setGithub] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase.from('projects').select('*').order('order', { ascending: true });
            if (data) {
                const mapped = data.map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    tags: p.tech_stack || [],
                    link: p.live_url || "",
                    github: p.github_url || "",
                    order: p.order || 0
                }));
                setProjects(mapped);
            }
        };
        fetchProjects();
    }, []);

    const showSuccess = (message: string) => {
        setMsg(message);
        setTimeout(() => setMsg(""), 3000);
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (!error) {
                setProjects(projects.filter(p => p.id !== id));
                showSuccess("Project deleted successfully");
            } else {
                console.error(error);
                showSuccess("Failed to delete project");
            }
        }
    };

    const handleEdit = (project: Project) => {
        setEditId(project.id);
        setTitle(project.title);
        setDescription(project.description);
        setTags(project.tags.join(", "));
        setLink(project.link);
        setGithub(project.github);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
        setTitle("");
        setDescription("");
        setTags("");
        setLink("");
        setGithub("");
        setEditId(null);
        setIsFormOpen(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editId) {
            // Update Logic
            const techStack = tags.split(',').map(t => t.trim()).filter(Boolean);
            const { error } = await supabase.from('projects').update({
                title,
                description,
                tech_stack: techStack,
                live_url: link,
                github_url: github
            }).eq('id', editId);

            if (!error) {
                const updatedProjects = projects.map(p => {
                    if (p.id === editId) {
                        return { ...p, title, description, tags: techStack, link, github };
                    }
                    return p;
                });
                setProjects(updatedProjects);
                showSuccess("Project updated successfully!");
            } else {
                console.error(error);
                showSuccess("Failed to update project.");
            }
        } else {
            // Add Logic
            const newOrder = projects.length > 0 ? Math.max(...projects.map(p => p.order)) + 1 : 0;
            const techStack = tags.split(',').map(t => t.trim()).filter(Boolean);
            const { data, error } = await supabase.from('projects').insert([{
                title,
                description,
                tech_stack: techStack,
                live_url: link,
                github_url: github,
                order: newOrder
            }]).select();

            if (data && data.length > 0) {
                const p = data[0];
                const newProject: Project = {
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    tags: p.tech_stack || [],
                    link: p.live_url || "",
                    github: p.github_url || "",
                    order: p.order || 0
                };
                setProjects([newProject, ...projects]);
                showSuccess("Project added successfully!");
            } else {
                console.error(error);
                showSuccess("Failed to add project.");
            }
        }

        handleReset();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="section-title" style={{ marginBottom: 0 }}>Manage Projects</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (isFormOpen) handleReset();
                        else setIsFormOpen(true);
                    }}
                >
                    {isFormOpen ? "Close Form" : <><Plus size={18} /> Add Project</>}
                </button>
            </div>

            {msg && (
                <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid var(--success)',
                    color: 'var(--success)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Check size={18} /> {msg}
                </div>
            )}

            {isFormOpen && (
                <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                        {editId ? "Edit Project" : "Add New Project"}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label className="label">Project Title</label>
                            <input required className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. AI Chatbot" />
                        </div>

                        <div>
                            <label className="label">Description</label>
                            <textarea required className="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description..." />
                        </div>

                        <div>
                            <label className="label">Tech Stack (comma separated)</label>
                            <input required className="input" value={tags} onChange={e => setTags(e.target.value)} placeholder="React, Node.js, OpenAI" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="label">Live Demo URL</label>
                                <input className="input" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
                            </div>
                            <div>
                                <label className="label">GitHub URL</label>
                                <input className="input" value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/..." />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                {editId ? "Update Project" : "Save Project"}
                            </button>
                            {editId && (
                                <button type="button" onClick={handleReset} className="btn btn-outline">
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No projects found. Add one!</p>}

                {projects.map(project => (
                    <div key={project.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                        <div style={{ maxWidth: '65%' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>{project.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.8rem' }}>{project.description}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {project.tags.map((tag, i) => (
                                    <span key={i} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                {project.link && <a href={project.link} target="_blank" style={{ color: 'var(--primary)' }}><LinkIcon size={16} /></a>}
                                {project.github && <a href={project.github} target="_blank" style={{ color: 'var(--text-secondary)' }}><Github size={16} /></a>}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="btn btn-outline"
                                    style={{ padding: '0.5rem' }}
                                    title="Edit Project"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="btn btn-outline"
                                    style={{ padding: '0.5rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                    title="Delete Project"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
