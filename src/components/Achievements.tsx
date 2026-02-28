"use client";

import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const INITIAL_ACHIEVEMENTS = [
    { year: "2024", title: "Best Developer Award", org: "Tech Conference 2024", description: "Recognized for outstanding contribution to open source." },
    { year: "2023", title: "Senior Architect Promotion", org: "Global Tech Solutions", description: "Led the migration of legacy systems to microservices." },
    { year: "2022", title: "Hackathon Winner", org: "Global Hack 2022", description: "Built an AI-powered accessibility tool in 48 hours." },
];

export default function Achievements() {
    const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const { data, error } = await supabase
                    .from('achievements')
                    .select('*')
                    .order('order', { ascending: true });

                if (data && data.length > 0) {
                    const formatted = data.map((a: any) => ({
                        year: a.date || "",
                        title: a.title || "",
                        org: a.icon || "", // Re-using icon column for org info temporarily
                        description: a.description || ""
                    }));
                    setAchievements(formatted);
                }
            } catch (err) {
                console.error("Error fetching achievements:", err);
            }
        };

        fetchAchievements();
    }, []);

    return (
        <section id="achievements" className="section">
            <div className="container">
                <h2 className="section-title">Achievements</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
                    {achievements.map((item, index) => (
                        <div key={index} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                color: 'var(--primary)',
                                padding: '1rem',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Trophy size={24} />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>{item.year}</span>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>{item.org}</p>
                                <p style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
