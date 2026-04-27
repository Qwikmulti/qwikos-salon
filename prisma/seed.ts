import { createClient } from "@supabase/supabase-js";
import { prisma } from "../src/lib/prisma/client";

const ADMIN_ID = "00000000-0000-0000-0000-000000000001";
const STYLIST_1_ID = "00000000-0000-0000-0000-000000000002";
const STYLIST_2_ID = "00000000-0000-0000-0000-000000000003";
const STYLIST_3_ID = "00000000-0000-0000-0000-000000000004";
const SEED_PASSWORD = "Password123!";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log("🌱 Seeding database...");

  // Create users in Supabase Auth if they don't exist
  const authUsers = [
    { id: ADMIN_ID, email: "admin@salonos.com" },
    { id: STYLIST_1_ID, email: "fatima@salonos.com" },
    { id: STYLIST_2_ID, email: "emeka@salonos.com" },
    { id: STYLIST_3_ID, email: "amara@salonos.com" },
  ];

  console.log("Creating auth users...");
  for (const user of authUsers) {
    const { error } = await supabase.auth.admin.createUser({
      id: user.id,
      email: user.email,
      password: SEED_PASSWORD,
      email_confirm: true,
    });
    
    if (error) {
      if (error.message.includes("already exists")) {
        // Update password if user already exists to ensure login works
        await supabase.auth.admin.updateUserById(user.id, { password: SEED_PASSWORD });
      } else {
        console.warn(`⚠️ Could not create auth user ${user.email}:`, error.message);
      }
    }
  }

  // Clean up previous bad seed data where IDs were mismatched
  await prisma.recurringHours.deleteMany();
  await prisma.stylistService.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.profile.deleteMany();

  await prisma.profile.upsert({
    where: { id: ADMIN_ID },
    update: {},
    create: {
      id: ADMIN_ID,
      email: "admin@salonos.com",
      fullName: "Salon Admin",
      role: "ADMIN",
      phone: "+44 7700 900000",
    },
  });

  // Seed Blog Posts
  await prisma.blogPost.upsert({
    where: { slug: "mastering-natural-hair-care" },
    update: {},
    create: {
      title: "Mastering Natural Hair Care: A Guide",
      slug: "mastering-natural-hair-care",
      excerpt: "Learn the secrets to maintaining healthy, vibrant natural hair with our expert tips.",
      content: "Full content about natural hair care goes here...",
      published: true,
      publishedAt: new Date(),
      authorId: ADMIN_ID,
      tags: ["Natural Hair", "Hair Care"],
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "summer-braid-trends-2024" },
    update: {},
    create: {
      title: "Summer Braid Trends 2024",
      slug: "summer-braid-trends-2024",
      excerpt: "From knotless to boho, discover the hottest braid styles for the summer season.",
      content: "Full content about summer braid trends...",
      published: true,
      publishedAt: new Date(),
      authorId: ADMIN_ID,
      tags: ["Braiding", "Trends"],
    },
  });

  const profiles = await Promise.all([
    prisma.profile.upsert({
      where: { id: STYLIST_1_ID },
      update: {},
      create: {
        id: STYLIST_1_ID,
        email: "fatima@salonos.com",
        fullName: "Fatima Hassan",
        role: "STYLIST",
        phone: "+44 7700 900111",
      },
    }),
    prisma.profile.upsert({
      where: { id: STYLIST_2_ID },
      update: {},
      create: {
        id: STYLIST_2_ID,
        email: "emeka@salonos.com",
        fullName: "Emeka Nwachukwu",
        role: "STYLIST",
        phone: "+44 7700 900222",
      },
    }),
    prisma.profile.upsert({
      where: { id: STYLIST_3_ID },
      update: {},
      create: {
        id: STYLIST_3_ID,
        email: "amara@salonos.com",
        fullName: "Amara Diallo",
        role: "STYLIST",
        phone: "+44 7700 900333",
      },
    }),
  ]);

  await prisma.stylist.upsert({
    where: { profileId: STYLIST_1_ID },
    update: {},
    create: {
      id: STYLIST_1_ID,
      profileId: STYLIST_1_ID,
      bio: "Specialist in all protective styles with 7 years of dedicated craft.",
      specialties: ["Braiding", "Natural Hair", "Locs"],
      yearsExperience: 7,
      isActive: true,
      instagramHandle: "@fatimahassan",
    },
  });

  await prisma.stylist.upsert({
    where: { profileId: STYLIST_2_ID },
    update: {},
    create: {
      id: STYLIST_2_ID,
      profileId: STYLIST_2_ID,
      bio: "Master barber and colorist — from skin fades to vibrant color transformations.",
      specialties: ["Fades", "Beard", "Locs", "Color"],
      yearsExperience: 5,
      isActive: true,
      instagramHandle: "@emekaStyles",
    },
  });

  await prisma.stylist.upsert({
    where: { profileId: STYLIST_3_ID },
    update: {},
    create: {
      id: STYLIST_3_ID,
      profileId: STYLIST_3_ID,
      bio: "Award-winning colorist and treatment specialist with a gentle, meticulous approach.",
      specialties: ["Balayage", "Keratin", "Treatments"],
      yearsExperience: 9,
      isActive: true,
      instagramHandle: "@amaradiallo",
    },
  });

  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: "svc-box-braids" },
      update: {},
      create: {
        id: "svc-box-braids",
        name: "Box Braids",
        description: "Classic box braids - medium size, shoulder length",
        category: "BRAIDING",
        durationMin: 180,
        price: 30000,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-knotless" },
      update: {},
      create: {
        id: "svc-knotless",
        name: "Knotless Braids",
        description: "Seamless knotless braids with added volume",
        category: "BRAIDING",
        durationMin: 240,
        price: 35000,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-cornrows" },
      update: {},
      create: {
        id: "svc-cornrows",
        name: "Cornrows",
        description: "Custom cornrow patterns to suit your style",
        category: "BRAIDING",
        durationMin: 60,
        price: 12000,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-loc-retwist" },
      update: {},
      create: {
        id: "svc-loc-retwist",
        name: "Loc Retwist",
        description: "Professional loc retwisting and maintenance",
        category: "NATURAL_HAIR",
        durationMin: 90,
        price: 12000,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-deep-condition" },
      update: {},
      create: {
        id: "svc-deep-condition",
        name: "Deep Conditioning",
        description: "Intensive moisture treatment for dry, damaged hair",
        category: "TREATMENT",
        durationMin: 60,
        price: 8000,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-keratin" },
      update: {},
      create: {
        id: "svc-keratin",
        name: "Keratin Treatment",
        description: "Smoothing keratin treatment for frizz control",
        category: "TREATMENT",
        durationMin: 120,
        price: 25000,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-balayage" },
      update: {},
      create: {
        id: "svc-balayage",
        name: "Balayage",
        description: "Hand-painted highlights for a natural, sun-kissed look",
        category: "HAIR_COLOR",
        durationMin: 180,
        price: 35000,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-precision-cut" },
      update: {},
      create: {
        id: "svc-precision-cut",
        name: "Precision Cut",
        description: "Custom cut tailored to your face shape and style",
        category: "HAIR_CUT",
        durationMin: 60,
        price: 8000,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-wash-style" },
      update: {},
      create: {
        id: "svc-wash-style",
        name: "Wash & Style",
        description: "Professional wash, condition and style",
        category: "STYLING",
        durationMin: 45,
        price: 6000,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "svc-beard-shape" },
      update: {},
      create: {
        id: "svc-beard-shape",
        name: "Beard Shaping",
        description: "Professional beard trim and shape-up",
        category: "BEARD",
        durationMin: 30,
        price: 5000,
        isActive: true,
      },
    }),
  ]);

  for (const s of services) {
    const stylistServices = [
      { serviceId: s.id, stylistId: STYLIST_1_ID },
      { serviceId: s.id, stylistId: STYLIST_2_ID },
      { serviceId: s.id, stylistId: STYLIST_3_ID },
    ];
    for (const ss of stylistServices) {
      await prisma.stylistService.upsert({
        where: { stylistId_serviceId: ss },
        update: {},
        create: ss,
      }).catch(() => {});
    }
  }

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;
  const hours = [
    { start: "09:00", end: "17:00" },
    { start: "10:00", end: "18:00" },
    { start: "09:00", end: "17:00" },
    { start: "10:00", end: "19:00" },
    { start: "09:00", end: "18:00" },
    { start: "09:00", end: "16:00" },
  ];

  const recurringHoursData = [
    ...days.map((day, i) => ({
      stylistId: STYLIST_1_ID,
      dayOfWeek: day,
      startTime: hours[i].start,
      endTime: hours[i].end,
      isActive: true,
    })),
    ...days.map((day, i) => ({
      stylistId: STYLIST_2_ID,
      dayOfWeek: day,
      startTime: hours[i].start,
      endTime: hours[i].end,
      isActive: true,
    })),
    ...days.map((day, i) => ({
      stylistId: STYLIST_3_ID,
      dayOfWeek: day,
      startTime: hours[i].start,
      endTime: hours[i].end,
      isActive: true,
    })),
  ];

  for (const rh of recurringHoursData) {
    await prisma.recurringHours.upsert({
      where: { stylistId_dayOfWeek: { stylistId: rh.stylistId, dayOfWeek: rh.dayOfWeek } },
      update: rh,
      create: rh,
    });
  }

  await prisma.salonSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      salonName: "SalonOS",
      tagline: "Premium Hair & Beauty",
      address: "123 High Street, London",
      phone: "+44 7700 900000",
      email: "hello@salonos.com",
      bookingLeadTime: 60,
      bookingWindow: 30,
    },
  });

  console.log("✅ Seed complete!");
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });