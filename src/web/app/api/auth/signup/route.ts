import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { generateSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, publicKey, nodeId } = body; // Adicionados os novos campos
    const cookiesInstance = await cookies();

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário com os campos adicionais
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        publicKey: publicKey || null, // Adicionado publicKey
        nodeId: nodeId || null, // Adicionado nodeId
      },
    });

    // Verificação segura para criação de sessão
    if (prisma.session) {
      const sessionToken = generateSessionToken();
      
      try {
        await prisma.session.create({
          data: {
            userId: user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            sessionToken,
          }
        });

        // Definir cookie de sessão
        cookiesInstance.set('session_token', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 24 * 60 * 60, // 30 dias
          path: '/',
        });
      } catch (sessionError) {
        console.error('Session creation error:', sessionError);
        // Não interrompe o fluxo se houver erro na sessão
      }
    }

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      user: userWithoutPassword,
      message: 'User created successfully' 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}