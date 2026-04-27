import { prisma } from '@/lib/prisma';
export default async function UsersAdmin(){ const users=await prisma.user.findMany({orderBy:{createdAt:'desc'}}); return <div><h1 className="text-2xl font-bold">Users</h1><div className="space-y-2">{users.map(u=><div key={u.id} className="rounded border p-3">{u.name} - {u.email} - {u.role}</div>)}</div></div>;}
