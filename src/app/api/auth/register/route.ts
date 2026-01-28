import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedFields = registerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedFields.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name, slug } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { slug }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
      if (existingUser.slug === slug) {
        return NextResponse.json({ error: 'Slug already taken' }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        slug,
      },
      select: {
        id: true,
        email: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
