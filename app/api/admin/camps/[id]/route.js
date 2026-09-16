import { withAdmin, adminDatabase, readJSON } from '@/lib/admin-server';
import { AdminError, requireCampId, validateCampUpdate } from '@/lib/admin-validation.mjs';
export const dynamic='force-dynamic';
export async function PATCH(request,{params}) {
  return withAdmin(request,async()=>{
    const id=requireCampId((await params).id);
    const details=validateCampUpdate(await readJSON(request));
    const {data,error}=await adminDatabase().rpc('admin_update_camp',{p_camp_id:id,p_details:details});
    if(error) {
      const messages={CAMP_NOT_FOUND:['Camp not found.',404],CAPACITY_BELOW_BOOKINGS:['Capacity cannot be lower than the number of existing bookings.',409],AGE_EXCLUDES_BOOKINGS:['This age range excludes an existing participant. Keep an age range that includes everyone booked.',409]};
      if(messages[error.message])throw new AdminError(...messages[error.message]);
      if(error.code==='PGRST202')throw new AdminError('Run the admin SQL migration in Supabase before saving camps.',503);
      throw error;
    }
    return {camp:data};
  });
}

export async function DELETE(request, {params}) {
  return withAdmin(request, async () => {
    const id = requireCampId((await params).id);
    const {error} = await adminDatabase().rpc('admin_delete_camp', {p_camp_id:id});
    if (error) {
      if (error.message === 'CAMP_NOT_FOUND') throw new AdminError('Camp not found. Refresh the camp list.',404);
      if (error.message === 'CAMP_HAS_BOOKINGS' || error.code === '23503') throw new AdminError('This camp has bookings and cannot be deleted. Hide it and close bookings instead.',409);
      if (error.code === 'PGRST202') throw new AdminError('Run the create/delete admin migration in Supabase before deleting camps.',503);
      throw error;
    }
    return {deleted:true};
  });
}
