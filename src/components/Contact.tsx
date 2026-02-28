import { Mail, Linkedin, Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Contact() {
    return (
        <section id="contact" className="section" style={{ paddingBottom: '6rem' }}>
            <div className="container">
                <h2 className="section-title">Get In Touch</h2>
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        I'm currently open for new opportunities and collaborations.
                        Whether you have a question or just want to say hi, feel free to drop a message!
                    </p>

                    <a href="mailto:raha1.srinivasan@gmail.com" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.8rem 2rem', marginBottom: '3rem' }}>
                        <Mail size={20} /> raha1.srinivasan@gmail.com
                    </a>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                        <Link href="https://github.com/harikrishnan-oss" target="_blank" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-white">
                            <Github size={28} />
                        </Link>
                        <Link href="https://www.linkedin.com/in/hari-krishnan-s-v-3974b332a" target="_blank" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-white">
                            <Linkedin size={28} />
                        </Link>
                        <Link href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-white">
                            <Twitter size={28} />
                        </Link>
                    </div>
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        © {new Date().getFullYear()} Alex Designer. All rights reserved.
                    </p>
                    <div style={{ marginTop: '1rem' }}>
                        <Link href="/admin/login" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
