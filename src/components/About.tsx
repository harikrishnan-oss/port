import { supabase } from "@/lib/supabase";

const DEFAULT_ABOUT = `Hello! I'm a dedicated software engineer with a passion for building beautiful and functional web applications.
My journey in web development started back in 2020, and I've since had the privilege of working on a diverse range of projects.

My main focus these days is building accessible, inclusive products and digital experiences for a variety of clients.
I enjoy bridging the gap between design and engineering, ensuring that the end product not only looks great but performs flawlessly.`;

export default async function About() {
    let aboutContent = DEFAULT_ABOUT;

    try {
        const { data, error } = await supabase
            .from('portfolio_content')
            .select('about_content')
            .eq('id', 1)
            .single();

        if (data?.about_content) {
            aboutContent = data.about_content;
        }
    } catch (err) {
        console.error("Error fetching about content:", err);
    }

    return (
        <section id="about" className="section">
            <div className="container">
                <h2 className="section-title">About Me</h2>
                <div className="card" style={{ maxWidth: '900px' }}>
                    {aboutContent.split('\n\n').map((paragraph, index) => (
                        <p key={index} style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: index === aboutContent.split('\n\n').length - 1 ? 0 : '1.5rem', whiteSpace: 'pre-line' }}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
