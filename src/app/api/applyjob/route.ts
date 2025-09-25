import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { Connectiondb } from '@/lib/dbconnect';
import applyjobmodel from '@/model/applyjob'; // ✅ Import corrected model
import ApplyJobModel from '@/model/applyjob';

interface RequestBody {
  studentname: string;
  degree: string;
  projectname:string;
  profemail:string;
  projectId:string;
  description: string;
  resume: string;
}

export async function POST(request: Request) {
  try {
    await Connectiondb();

    const session: any = await getServerSession(authOptions);

    //  Only verified students can apply
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
      'projectname',
      'profemail', 
      'projectId', 
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
        profemail: body.profemail,  
        projectname: body.projectname,
        projectId: body.projectId,
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

export async function GET(request: Request) {
  try {
    await Connectiondb();

    const session: any = await getServerSession(authOptions);
      console.log(session);
      
    // Only verified professors can access
    if (!session || session.user.role !== "prof" || session.user.isVerified !== true) {
      return NextResponse.json(
        { error: "Unauthorized. Only verified professors allowed." },
        { status: 401 }
      );
    }

    //  Extract projectId from query params
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId in query params" },
        { status: 400 }
      );
    }

    const profEmail = session.user.email;

    //  Find applications for this project and professor
    const applications = await ApplyJobModel.find({
      projectId,
      profemail: profEmail, // ensure it's tied to professor's email
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, applications }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await Connectiondb();

    const session: any = await getServerSession(authOptions);

    // ✅ Only verified professors can delete applications
    if (!session || session.user.role !== "prof" || session.user.isVerified !== true) {
      return NextResponse.json(
        { error: "Unauthorized. Only verified professors allowed." },
        { status: 401 }
      );
    }

    // ✅ Get _id from query params
    const url = new URL(request.url);
    const id = url.searchParams.get("_id");

    if (!id) {
      return NextResponse.json(
        { error: "Application ID (_id) is required" },
        { status: 400 }
      );
    }

    // ✅ Delete by _id AND professor's email
    const deletedApp = await ApplyJobModel.findOneAndDelete({
      _id: id,
      profemail: session.user.email,
    });

    if (!deletedApp) {
      return NextResponse.json(
        { error: "Application not found or not authorized to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Application deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application", message: error.message },
      { status: 500 }
    );
  }
}