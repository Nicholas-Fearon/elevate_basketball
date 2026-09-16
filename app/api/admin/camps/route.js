import { validateCampUpdate } from '@/lib/admin-validation.mjs';
import { withAdmin, adminDatabase, readJSON } from '@/lib/admin-server';
export const dynamic='force-dynamic';
export async function GET(request) {
  return withAdmin(request,async()=>{
    const db=adminDatabase(); const camps=[];
    for(let offset=0;;offset+=500) {
      const {data,error}=await db.from('camps').select('*').order('starts_at',{ascending:false}).order('id').range(offset,offset+499);
      if(error)throw error;
      camps.push(...data); if(data.length<500)break;
    }
    return {camps};
  });
}

export async function POST(request) {
  return withAdmin(request, async () => {
    const details = validateCampUpdate(await readJSON(request));
    const {data,error} = await adminDatabase().from('camps').insert(details).select('*').single();
    if (error) throw error;
    return {camp:data};
  });
}
