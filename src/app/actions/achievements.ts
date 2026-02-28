"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function addAchievementServer(data: { title: string, description: string, date: string, icon: string, order: number }) {
    try {
        const { data: resData, error } = await supabase
            .from('achievements')
            .insert([data])
            .select();

        if (error) throw error;
        return { success: true, data: resData };
    } catch (e: any) {
        console.error("Server Action Error (Add Achievement):", e);
        return { success: false, error: e.message };
    }
}

export async function updateAchievementServer(id: string, data: { title: string, description: string, date: string, icon: string }) {
    try {
        const { error } = await supabase
            .from('achievements')
            .update(data)
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Server Action Error (Update Achievement):", e);
        return { success: false, error: e.message };
    }
}

export async function removeAchievementServer(id: string) {
    try {
        const { error } = await supabase.from('achievements').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Server Action Error (Remove Achievement):", e);
        return { success: false, error: e.message };
    }
}
