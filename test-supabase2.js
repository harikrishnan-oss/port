const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://cyucegkisezfpsjgjsdb.supabase.co";
const supabaseKey = "sb_publishable__7C-Lvr9jKp6IEA7fIpXeA_AQmUs-Js";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log("Testing new Supabase insertion...");
    const { data, error } = await supabase
        .from('skills')
        .insert([{ name: 'TestSkill_DeleteMe', order: 99 }])
        .select();

    if (error) {
        console.error("FAILED TO INSERT:", error.message);
    } else {
        console.log("SUCCESSFULLY INSERTED:", data);
        await supabase.from('skills').delete().eq('id', data[0].id);
        console.log("Cleaned up test skill.");
    }
}

testInsert();
