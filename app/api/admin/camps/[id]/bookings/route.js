import { withAdmin, adminDatabase } from '@/lib/admin-server';
import { AdminError, requireCampId } from '@/lib/admin-validation.mjs';
export const dynamic='force-dynamic';
export async function GET(request,{params}) {
  return withAdmin(request,async()=>{
    const id=requireCampId((await params).id);const db=adminDatabase();
    const camp=await db.from('camps').select('id,title,capacity').eq('id',id).maybeSingle();
    if(camp.error)throw camp.error;
    if(!camp.data)throw new AdminError('Camp not found.',404);
    const bookings=[];
    for(let offset=0;;offset+=500) {
      const {data,error}=await db.from('bookings').select('id,camp_id,participant_name,participant_age,guardian_name,contact_email,guardian_consent,price_pence,created_at').eq('camp_id',id).order('created_at',{ascending:false}).order('id').range(offset,offset+499);
      if(error)throw error;
      bookings.push(...data); if(data.length<500)break;
    }
    return {bookings,camp:camp.data};
  });
}
