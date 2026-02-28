"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        achievements: 0,
        messages: 12
    });

    useEffect(() => {
        const fetchStats = async () => {
            const [projectsRes, skillsRes, achievementsRes] = await Promise.all([
                supabase.from('projects').select('id', { count: 'exact' }),
                supabase.from('skills').select('id', { count: 'exact' }),
                supabase.from('achievements').select('id', { count: 'exact' })
            ]);

            setStats({
                projects: projectsRes.data ? projectsRes.data.length : 0,
                skills: skillsRes.data ? skillsRes.data.length : 0,
                achievements: achievementsRes.data ? achievementsRes.data.length : 0,
                messages: 12 // Placeholder
            });
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="section-title">Dashboard Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Total Projects" value={stats.projects.toString()} />
                <StatCard title="Skills Listed" value={stats.skills.toString()} />
                <StatCard title="Achievements" value={stats.achievements.toString()} />
                <StatCard title="Messages" value={stats.messages.toString()} />
            </div>
        </div>
    );
}

function StatCard({ title, value }: { title: string, value: string }) {
    return (
        <div className="card" style={{ padding: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--foreground)' }}>{value}</div>
        </div>
    );
}
