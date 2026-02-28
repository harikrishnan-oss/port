"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, User, Code, Folder, Trophy, LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
        if (!isLoggedIn) {
            router.push("/admin/login");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("isAdminLoggedIn");
        router.push("/");
    };

    if (!isAuthorized) {
        return null; // Prevent flash of protected content
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                borderRight: '1px solid var(--border)',
                background: 'var(--card-bg)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                top: 0,
                left: 0
            }}>
                <div style={{ marginBottom: '3rem', fontSize: '1.2rem', fontWeight: 700, color: 'var(--foreground)' }}>
                    Admin Panel
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <SidebarLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <SidebarLink href="/admin/dashboard/about" icon={<User size={20} />} label="Edit About" />
                    <SidebarLink href="/admin/dashboard/skills" icon={<Code size={20} />} label="Manage Skills" />
                    <SidebarLink href="/admin/dashboard/projects" icon={<Folder size={20} />} label="Manage Projects" />
                    <SidebarLink href="/admin/dashboard/achievements" icon={<Trophy size={20} />} label="Achievements" />
                </nav>

                <div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <Link href={href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s',
        }} className="hover:bg-zinc-800 hover:text-white">
            {icon}
            <span style={{ fontSize: '0.95rem' }}>{label}</span>
        </Link>
    );
}
