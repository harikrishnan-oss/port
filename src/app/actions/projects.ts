"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function addProjectServer(data: { title: string, description: string, tech_stack: string[], live_url: string, github_url: string, order: number }) {
    try {
        const { data: resData, error } = await supabase
            .from('projects')
            .insert([data])
            .select();

        if (error) throw error;
        return { success: true, data: resData };
    } catch (e: any) {
        console.error("Server Action Error (Add Project):", e);
        return { success: false, error: e.message };
    }
}

export async function updateProjectServer(id: string, data: { title: string, description: string, tech_stack: string[], live_url: string, github_url: string }) {
    try {
        const { error } = await supabase
            .from('projects')
            .update(data)
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Server Action Error (Update Project):", e);
        return { success: false, error: e.message };
    }
}

export async function removeProjectServer(id: string) {
    try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Server Action Error (Remove Project):", e);
        return { success: false, error: e.message };
    }
}
