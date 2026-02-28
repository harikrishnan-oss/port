"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function addSkillServer(name: string, order: number) {
    try {
        const { data, error } = await supabase
            .from('skills')
            .insert([{ name, order }])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (e: any) {
        console.error("Server Action Error:", e);
        return { success: false, error: e.message };
    }
}

export async function removeSkillServer(id: string) {
    try {
        const { error } = await supabase.from('skills').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
