import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { Connectiondb } from '@/lib/dbconnect';
import applyjobmodel from '@/model/applyjob'; // ✅ Import corrected model

interface RequestBody {
  studentname: string;
  degree: string;
  description: string;
  resume: string;
}

export async function POST(request: Request) {
  try {
    await Connectiondb();

    const session: any = await getServerSession(authOptions);

    // ✅ Only verified students can apply
    if (!session || session.user.role !== 'student' || session.user.isVerified !== true) {
      return NextResponse.json(
        { error: 'Unauthorized. Only verified students can apply.' },
        { status: 401 }
      );
    }

    const body: RequestBody = await request.json();

    // Validate required fields
    const requiredFields: (keyof RequestBody)[] = [
      'studentname',
      'degree',
      'description',
      'resume',
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', missingFields },
        { status: 400 }
      );
    }

    // ✅ Save application
    const application = await applyjobmodel.create({
      studentname: body.studentname,
      email: session.user?.email, // Use session email
      degree: body.degree,
      description: body.description,
      resume: body.resume,
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
