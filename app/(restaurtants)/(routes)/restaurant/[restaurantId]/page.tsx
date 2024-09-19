import React from "react";
import type { Metadata, ResolvingMetadata } from "next";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prismadb";
import RestaurantDetail from "@/app/(restaurtants)/(routes)/restaurant/[restaurantId]/components/RestaurantDetail";

interface ReviewDetailProps {
  params: {
    restaurantId: string;
  };
}

export async function generateMetadata(
  { params }: ReviewDetailProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.restaurantId;

  // fetch data
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: params.restaurantId,
    },
  });

  return {
    title: restaurant?.name || id,
  };
}

export default async function RestaurantDetailPage({ params }: ReviewDetailProps) {
  const { userId } = auth();
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: params.restaurantId,
    },
    include: {
      reviews: {
        include: {
          votes: true,
        },
      },
    },
  });
  
  if (!restaurant) {
    // Handle the case where the restaurant is not found
    return <div>Restaurant not found</div>;
  }

  return <RestaurantDetail userId={userId || null} restaurant={restaurant} />;
}