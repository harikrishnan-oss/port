"use client";

import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

interface Project {
    id: string | number;
    title: string;
    description: string;
    tags: string[];
    link: string;
    github: string;
}

const DEFAULT_PROJECTS: Project[] = [
    {
        id: 1,
        title: "E-Commerce Platform",
        description: "A full-featured online store with cart functionality, payment processing, and admin dashboard.",
        tags: ["Next.js", "Stripe", "Prisma"],
        link: "#",
        github: "#"
    },
    {
        id: 2,
        title: "Task Management App",
        description: "Real-time collaboration tool for teams to organize and track projects efficiently.",
        tags: ["React", "Firebase", "Tailwind"],
        link: "#",
        github: "#"
    },
    {
        id: 3,
        title: "Weather Dashboard",
        description: "Visualizes weather data from global APIs with interactive charts and maps.",
        tags: ["TypeScript", "Chart.js", "OpenWeatherMap"],
        link: "#",
        github: "#"
    }
];

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('order', { ascending: true });

                if (data && data.length > 0) {
                    const formatted = data.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        description: p.description,
                        tags: p.tech_stack || [],
                        link: p.live_url || "",
                        github: p.github_url || ""
                    }));
                    setProjects(formatted);
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
            }
        };

        fetchProjects();
    }, []);

    if (!mounted) {
        return (
            <section id="projects" className="section">
                <div className="container">
                    <h2 className="section-title">Featured Projects</h2>
                    <p>Loading projects...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="section">
            <div className="container">
                <h2 className="section-title">Featured Projects</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {projects.map((project) => (
                        <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>{project.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{project.description}</p>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {project.tags.map((tag, i) => (
                                    <span key={i} style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--primary)',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '4px'
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
