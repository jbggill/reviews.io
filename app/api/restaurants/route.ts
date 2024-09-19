import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, location, tags } = body;

    if (!name || !description || !location) {
      return new NextResponse("Required fields are missing", { status: 400 });
    }

    const { label } = location;

    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        name: name,
      },
    });

    if (existingRestaurant) {
      return new NextResponse("Restaurant already exists!", { status: 400 });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        location: label,
        tags,
        userId: userId,
        // If you want to include the user's name, you might need to fetch more details about the user if not available in getAuth
        userName: "", // Update this if you need more user information
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
