import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getSessionFromCookie } from '@/lib/auth';

export async function POST() {
  try {
    const cookiesInstance = await cookies(); // Use 'await' para resolver a Promise
    const sessionToken = cookiesInstance.get('session_token')?.value;
    
    if (sessionToken) {
      // Remover sessão do banco de dados
      await prisma.session.deleteMany({
        where: { sessionToken }
      });
      
      // Limpar cookie
      cookiesInstance.delete('session_token'); // Use o objeto resolvido para deletar o cookie
    }
    
    return NextResponse.json({ message: 'Logged out successfully' });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
