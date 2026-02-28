"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

const DEFAULT_BIO = `Computer Science & Business Systems student • Web Developer
Studying at Rajalakshmi Institute of Technology (2nd year)`;

const DEFAULT_ABOUT = `Hello! I'm a dedicated software engineer with a passion for building beautiful and functional web applications.
My journey in web development started back in 2020, and I've since had the privilege of working on a diverse range of projects.

My main focus these days is building accessible, inclusive products and digital experiences for a variety of clients.
I enjoy bridging the gap between design and engineering, ensuring that the end product not only looks great but performs flawlessly.`;

export default function EditAboutPage() {
    const [bio, setBio] = useState("");
    const [aboutContent, setAboutContent] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const fetchContent = async () => {
            const { data, error } = await supabase.from('portfolio_content').select('*').eq('id', 1).single();
            if (data) {
                setBio(data.bio_text || DEFAULT_BIO);
                setAboutContent(data.about_content || DEFAULT_ABOUT);
            } else {
                setBio(DEFAULT_BIO);
                setAboutContent(DEFAULT_ABOUT);
            }
        };
        fetchContent();
    }, []);

    const handleSave = async () => {
        const { error } = await supabase
            .from('portfolio_content')
            .upsert({ id: 1, bio_text: bio, about_content: aboutContent });

        if (!error) {
            setMsg("About Me updated successfully!");
        } else {
            console.error(error);
            setMsg("Failed to update.");
        }
        setTimeout(() => setMsg(""), 3000);
    };

    return (
        <div>
            <h1 className="section-title">Edit About Me</h1>

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

            <div className="card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <label className="label">Short Bio (Hero Section)</label>
                    <textarea
                        className="textarea"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Short introduction for component..."
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">About Me Content (Full Description)</label>
                    <textarea
                        className="textarea"
                        rows={8}
                        value={aboutContent}
                        onChange={(e) => setAboutContent(e.target.value)}
                        placeholder="Detailed about me text..."
                    />
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSave} className="btn btn-primary">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
