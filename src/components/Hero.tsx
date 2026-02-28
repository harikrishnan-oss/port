import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const DEFAULT_BIO_HTML = (
    <>
        Computer Science & Business Systems student • Web Developer <br />
        <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Studying at Rajalakshmi Institute of Technology (2nd year)
        </span>
    </>
);

export default async function Hero() {
    let bioContent: React.ReactNode = DEFAULT_BIO_HTML;

    try {
        const { data, error } = await supabase
            .from('portfolio_content')
            .select('bio_text')
            .eq('id', 1)
            .single();

        if (data?.bio_text) {
            const savedBio = data.bio_text;
            bioContent = (
                <>
                    {savedBio.split('\n').map((line: string, i: number) => (
                        <span key={i}>
                            {line}
                            {i < savedBio.split('\n').length - 1 && <br />}
                        </span>
                    ))}
                </>
            );
        }
    } catch (err) {
        console.error("Error fetching bio:", err);
    }

    return (
        <section className="section hero-bg" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
            {/* Decorative particles */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                <div className="particle" style={{ left: '10%', animationDelay: '0s' }}></div>
                <div className="particle" style={{ left: '30%', animationDelay: '4s' }}></div>
                <div className="particle" style={{ left: '70%', animationDelay: '2s' }}></div>
                <div className="particle" style={{ left: '90%', animationDelay: '6s' }}></div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 style={{
                        color: 'var(--primary)',
                        fontWeight: 500,
                        marginBottom: '1rem',
                        fontSize: '1.2rem',
                        letterSpacing: '0.05em',
                        opacity: 0.9
                    }}>
                        Hi <span style={{ fontSize: '1.4rem' }}>🤚</span>, I am
                    </h2>

                    <h1 className="neon-text" style={{
                        fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '2.5rem',
                        letterSpacing: '-0.03em',
                    }}>
                        Hari Krishnan S V
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '3.5rem',
                        maxWidth: '700px',
                        lineHeight: 1.9,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontWeight: 400
                    }}>
                        {bioContent}
                    </p>

                    <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="#projects" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem', borderRadius: '10px' }}>
                            View Projects <ArrowRight size={18} />
                        </Link>
                        <Link href="#contact" className="btn btn-outline" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem', borderRadius: '10px' }}>
                            Contact Me <Mail size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
