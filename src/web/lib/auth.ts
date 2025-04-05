import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import prisma from './prisma';

export function generateSessionToken() {
  return uuidv4();
}

export async function getSessionFromCookie() {
  const cookieStore = await cookies(); // Use 'await' para resolver a Promise
  const sessionToken = cookieStore.get('session_token')?.value;
  
  if (!sessionToken) {
    return null;
  }
  
  // Buscar sessão no banco de dados
  const session = await prisma.session.findUnique({
    where: { sessionToken }
  });
  
  // Verificar se a sessão existe e não expirou
  if (!session || new Date() > session.expires) {
    return null;
  }
  
  return session;
}

export async function getCurrentUser() {
  const session = await getSessionFromCookie();
  
  if (!session) {
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });
  
  if (!user) {
    return null;
  }
  
  // Retornar usuário sem senha
  const { password: _, ...userWithoutPassword } = user;
  
  return userWithoutPassword;
}