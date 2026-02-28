"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function updateAboutServer(bioText: string, aboutContent: string) {
    try {
        const { error } = await supabase
            .from('portfolio_content')
            .upsert({ id: 1, bio_text: bioText, about_content: aboutContent });

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Server Action Error (About):", e);
        return { success: false, error: e.message };
    }
}
