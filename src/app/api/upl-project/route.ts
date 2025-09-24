import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { Connectiondb } from '@/lib/dbconnect';
import projectmodel from '@/model/project';

interface RequestBody {
  projectname: string;
  description: string;
  deadline: string;
  publicId: string;
  profname: string; // Professor's display name
}

export async function POST(request: Request) {
  try {
    await Connectiondb();

    const session: any = await getServerSession(authOptions);

    // ✅ role must be "prof" and account must be verified
    if (!session || session.user.role !== 'prof' || session.user.isVerified !== true) {
      return NextResponse.json(
        { error: 'Unauthorized. Only verified professors can create projects.' },
        { status: 401 }
      );
    }

    const body: RequestBody = await request.json();

    const requiredFields: (keyof RequestBody)[] = [
      'projectname',
      'description',
      'publicId',
      
      'profname',
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', missingFields },
        { status: 400 }
      );
    }

    // ✅ Create project
    const project = await projectmodel.create({
      projectname: body.projectname,
      postedby: body.profname, // Display name
      ownerEmail: session.user?.email, // Used for ownership checks
      description: body.description,
      email: session.user?.email,
      deadline: body.deadline || null,
      image: body.publicId,
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await Connectiondb();
    const projects = await projectmodel.find().sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    // ✅ Only verified professors can delete
    if (!session || session.user.role !== 'prof' || session.user.isVerified !== true) {
      return NextResponse.json(
        { error: 'Unauthorized. Only verified professors can delete projects.' },
        { status: 401 }
      );
    }

    await Connectiondb();
    const { id } = await request.json();

    const project = await projectmodel.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Ownership check using email
    if (project.ownerEmail !== session.user?.email) {
      return NextResponse.json(
        { error: 'You can delete only your own projects' },
        { status: 403 }
      );
    }

    await projectmodel.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project', message: error.message },
      { status: 500 }
    );
  }
}
