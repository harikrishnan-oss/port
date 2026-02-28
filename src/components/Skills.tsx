"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_SKILLS = [
    "React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3",
    "Node.js", "Express", "PostgreSQL", "MongoDB",
    "Git", "Docker", "AWS", "Figma", "Tailwind CSS"
];

export default function Skills() {
    const [skills, setSkills] = useState(DEFAULT_SKILLS);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const fetchSkills = async () => {
            try {
                const { data, error } = await supabase
                    .from('skills')
                    .select('*')
                    .order('order', { ascending: true });

                if (data && data.length > 0) {
                    // Extracting names from structured return data assuming skill items have a 'name' property
                    setSkills(data.map((s: any) => s.name));
                }
            } catch (err) {
                console.error("Error fetching skills:", err);
            }
        };

        fetchSkills();
    }, []);

    return (
        <section id="skills" className="section">
            <div className="container">
                <h2 className="section-title">Skills & Technologies</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {(mounted ? skills : DEFAULT_SKILLS).map((skill) => (
                        <span key={skill} style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '9999px',
                            fontSize: '1rem',
                            color: 'var(--foreground)',
                            fontWeight: 500
                        }}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
