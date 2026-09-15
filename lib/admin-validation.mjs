export class AdminError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
export function isAdmin(userId, configuredId) {
  return typeof configuredId === 'string' && /^user_[A-Za-z0-9]+$/.test(configuredId) && userId === configuredId;
}
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function requireCampId(id) { if (!UUID.test(id || '')) throw new AdminError('Invalid camp ID.'); return id; }
export function londonInput(value) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23' }).formatToParts(new Date(value));
  const p = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
export function londonToISO(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new AdminError('Enter a valid date and time.');
  const base = Date.parse(`${value}:00Z`);
  if (!Number.isFinite(base)) throw new AdminError('Enter a valid date and time.');
  // London uses GMT or BST. Verify candidates rather than using the server's timezone.
  const candidates = [base, base - 3600000].filter(ms => londonInput(ms) === value);
  if (candidates.length !== 1) throw new AdminError('This time is missing or repeated when UK clocks change. Choose a different time.');
  return new Date(candidates[0]).toISOString();
}
function text(data, key, min, max) {
  const value = data[key];
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) throw new AdminError(`${key.replaceAll('_',' ')} must be ${min}–${max} characters.`);
  return value.trim();
}
function integer(data, key, min, max) {
  const value=data[key];
  if (!Number.isInteger(value) || value < min || value > max) throw new AdminError(`${key.replaceAll('_',' ')} must be a whole number between ${min} and ${max}.`);
  return value;
}
export function validateCampUpdate(data) {
  const allowed=['title','subtitle','tag','description','arrival_information','start_local','end_local','location','min_age','max_age','price_gbp','capacity','published','booking_open'];
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(k => !allowed.includes(k))) throw new AdminError('Unexpected camp fields.');
  const result={title:text(data,'title',2,100),subtitle:text(data,'subtitle',0,300),tag:text(data,'tag',0,40),description:text(data,'description',0,10000),arrival_information:text(data,'arrival_information',0,5000),location:text(data,'location',2,200),min_age:integer(data,'min_age',3,17),max_age:integer(data,'max_age',3,18),capacity:integer(data,'capacity',1,1000)};
  if (result.max_age < result.min_age) throw new AdminError('Maximum age must be at least the minimum age.');
  if (typeof data.price_gbp !== 'string' || !/^\d{1,6}(\.\d{1,2})?$/.test(data.price_gbp)) throw new AdminError('Enter a price in pounds with up to two decimal places.');
  result.price_pence=Math.round(Number(data.price_gbp)*100);
  result.starts_at=londonToISO(data.start_local); result.ends_at=londonToISO(data.end_local);
  if (Date.parse(result.ends_at) <= Date.parse(result.starts_at)) throw new AdminError('The end must be after the start.');
  for (const key of ['published','booking_open']) {
    if (typeof data[key] !== 'boolean') throw new AdminError('Invalid visibility or booking setting.');
    result[key]=data[key];
  }
  if (result.booking_open && !result.published) throw new AdminError('Publish the camp before opening bookings.');
  return result;
}
export function adminResponse(data,status=200) {
  return Response.json(data,{status,headers:{'Cache-Control':'private, no-store, max-age=0','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
}
// The same guard wraps every admin API handler. The operation (including any
// privileged database client) cannot run before Clerk authentication + ownership.
export async function runAdminRequest(request,{authenticate,adminId,operation}) {
  try {
    const {userId}=await authenticate();
    if (!userId) return adminResponse({error:'Please sign in.'},401);
    if (!isAdmin(userId,adminId)) return adminResponse({error:'Access restricted.'},403);
    if (!['GET','HEAD'].includes(request.method)) {
      if (request.headers.get('origin') !== new URL(request.url).origin) return adminResponse({error:'Invalid request origin.'},403);
      if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new AdminError('Send JSON data.',415);
    }
    return adminResponse(await operation());
  } catch(error) {
    if (error instanceof AdminError) return adminResponse({error:error.message},error.status);
    console.error('Admin request failed', {code:typeof error?.code==='string'?error.code:'INTERNAL_ERROR'});
    return adminResponse({error:'Admin data is unavailable. Please try again or check the server configuration.'},500);
  }
}
