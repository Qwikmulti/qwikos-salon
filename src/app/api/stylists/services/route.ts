import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

const updateSchema = z.object({
  services: z.array(z.object({
    id: z.string().optional(),
    serviceId: z.string().optional(),
    customName: z.string().optional(),
    customDescription: z.string().optional(),
    category: z.string().optional(),
    priceOverride: z.number().min(0).optional(),
    durationOverride: z.number().min(15).optional(),
    isOffered: z.boolean(),
    isCustom: z.boolean().optional(),
  })).optional(),
});

/**
 * GET /api/stylists/services
 * Returns all available salon services + current stylist's offerings
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stylist = await prisma.stylist.findUnique({
    where: { profileId: user.id },
    include: {
      services: {
        include: { service: true },
      },
    },
  });

  if (!stylist) {
    return NextResponse.json({ error: "Stylist not found" }, { status: 404 });
  }

  // Fetch all active salon services (global ones)
  const allServices = await prisma.service.findMany({
    where: { 
      isActive: true,
      isCustom: false,
    } as any,
    orderBy: [
      { category: "asc" },
      { name: "asc" },
    ],
  });

  // Transform stylist's offerings into a map for quick lookup
  const offeredMap = new Map(
    stylist.services.map((ss) => [
      ss.serviceId,
      {
        id: ss.id,
        priceOverride: ss.priceOverride ? Number(ss.priceOverride) : null,
        durationOverride: ss.durationOverride,
        isOffered: true,
      },
    ])
  );

  // Combine salon services with stylist offerings
  const services = allServices.map((service) => {
    const offering = offeredMap.get(service.id);
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,
      durationMin: service.durationMin,
      price: Number(service.price),
      isOffered: offering?.isOffered ?? false,
      priceOverride: offering?.priceOverride ?? null,
      durationOverride: offering?.durationOverride ?? null,
      isCustom: false,
    };
  });

  // Add custom services (stylist-created)
  const customServices = stylist.services
    .filter((ss) => (ss.service as any).isCustom)
    .map((ss) => {
      const customData = ss.service as unknown as {
        name: string;
        description: string | null;
        category: string;
        durationMin: number;
        price: number;
      };
      return {
        id: ss.id,
        name: customData?.name || "Custom Service",
        description: customData?.description || null,
        category: customData?.category || "OTHER",
        durationMin: customData?.durationMin || 60,
        price: customData?.price || 0,
        isOffered: true,
        priceOverride: ss.priceOverride ? Number(ss.priceOverride) : null,
        durationOverride: ss.durationOverride,
        isCustom: true,
      };
    });

  return NextResponse.json({
    services: [...services, ...customServices],
  });
}

/**
 * PATCH /api/stylists/services
 * Update stylist's service offerings
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stylist = await prisma.stylist.findUnique({
    where: { profileId: user.id },
  });

  if (!stylist) {
    return NextResponse.json({ error: "Stylist not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { services } = parsed.data;

  if (!services) {
    return NextResponse.json({ error: "No services provided" }, { status: 400 });
  }

  // Get current offerings to determine what to create/update/delete
  const currentOfferings = await prisma.stylistService.findMany({
    where: { stylistId: stylist.id },
    include: { service: true },
  });

  const currentServiceIds = new Set(currentOfferings.map((o) => o.serviceId || o.id));

  // Process each service
  const results = await Promise.all(
    services.map(async (serviceData) => {
      const { id, serviceId, customName, customDescription, category, priceOverride, durationOverride, isOffered, isCustom } = serviceData;

      if (isCustom) {
          // Handle custom services (stylist-created)
        if (isOffered) {
          // Create or update custom service
          const existingCustom = id && !id.startsWith("custom-") 
            ? currentOfferings.find((o) => o.id === id)
            : currentOfferings.find((o) => (o.service as any).isCustom && o.service.name === customName);
          
          if (existingCustom) {
            // Update existing custom service
            return prisma.stylistService.update({
              where: { id: existingCustom.id },
              data: {
                priceOverride: priceOverride ? priceOverride * 100 : null,
                durationOverride: durationOverride ?? null,
                service: {
                  update: {
                    name: customName,
                    description: customDescription,
                    category: category as any,
                  },
                },
              },
            });
          } else {
            // Create new custom service
            return prisma.stylistService.create({
              data: {
                stylist: { connect: { id: stylist.id } },
                priceOverride: priceOverride ? priceOverride * 100 : null,
                durationOverride: durationOverride ?? null,
                service: {
                  create: {
                    name: customName || "Custom Service",
                    description: customDescription,
                    category: (category as any) || "OTHER",
                    durationMin: durationOverride || 60,
                    price: priceOverride ? priceOverride * 100 : 0,
                    isActive: true,
                    isCustom: true,
                  } as any,
                },
              },
            });
          }
        } else {
          // Remove custom service
          const existingCustom = id && !id.startsWith("custom-")
            ? currentOfferings.find((o) => o.id === id)
            : currentOfferings.find((o) => (o.service as any).isCustom && o.service.name === customName);
          if (existingCustom) {
            await prisma.stylistService.delete({
              where: { id: existingCustom.id },
            });
          }
          return null;
        }
      } else if (serviceId) {
        // Handle salon services
        if (isOffered) {
          const existing = currentOfferings.find((o) => o.serviceId === serviceId);
          
          if (existing) {
            // Update existing offering
            return prisma.stylistService.update({
              where: { id: existing.id },
              data: {
                priceOverride: priceOverride ? priceOverride * 100 : null,
                durationOverride: durationOverride ?? null,
              },
            });
          } else {
            // Create new offering
            return prisma.stylistService.create({
              data: {
                stylistId: stylist.id,
                serviceId: serviceId,
                priceOverride: priceOverride ? priceOverride * 100 : null,
                durationOverride: durationOverride ?? null,
              },
            });
          }
        } else {
          // Remove offering
          const existing = currentOfferings.find((o) => o.serviceId === serviceId);
          if (existing) {
            await prisma.stylistService.delete({
              where: { id: existing.id },
            });
          }
          return null;
        }
      }
      return null;
    })
  );

  // Fetch updated data
  const updatedStylist = await prisma.stylist.findUnique({
    where: { profileId: user.id },
    include: {
      services: {
        include: { service: true },
      },
    },
  });

  return NextResponse.json({
    success: true,
    services: updatedStylist?.services,
  });
}