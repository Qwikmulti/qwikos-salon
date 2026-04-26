// Prisma types — available after `prisma generate`
// Using manual definitions so TS compiles before DB is connected

export type Role           = "CUSTOMER" | "STYLIST" | "ADMIN";
export type BookingStatus  = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
export type ServiceCategory= "HAIR_CUT"|"HAIR_COLOR"|"BRAIDING"|"NATURAL_HAIR"|"RELAXER"|"TREATMENT"|"STYLING"|"BEARD"|"KIDS"|"OTHER";

export interface Profile {
  id: string; email: string; fullName: string; phone?: string|null;
  avatarUrl?: string|null; role: Role; createdAt: Date; updatedAt: Date;
}
export interface Stylist {
  id: string; profileId: string; bio?: string|null; specialties: string[];
  yearsExperience: number; isActive: boolean; instagramHandle?: string|null;
  portfolioUrls: string[]; createdAt: Date; updatedAt: Date;
}
export interface Service {
  id: string; name: string; description?: string|null; category: ServiceCategory;
  durationMin: number; price: number; imageUrl?: string|null; isActive: boolean;
  createdAt: Date; updatedAt: Date;
}
export interface Booking {
  id: string; customerId: string; stylistId: string; serviceId: string;
  startAt: Date; endAt: Date; status: BookingStatus; notes?: string|null;
  cancelledAt?: Date|null; cancelReason?: string|null; createdAt: Date; updatedAt: Date;
}
export interface Review {
  id: string; bookingId: string; rating: number; comment?: string|null; createdAt: Date;
}

// Extended with relations
export type StylistWithProfile   = Stylist & { profile: Profile };
export type BookingWithRelations = Booking & { customer: Profile; stylist: StylistWithProfile; service: Service; review?: Review|null };
export type ServiceWithStylists  = Service & { stylists: Array<{ stylist: StylistWithProfile; priceOverride?: number|null; durationOverride?: number|null }> };

// UI types
export type NavItem      = { label: string; href: string; icon?: string };
export type DashboardStat= { label: string; value: string|number; change?: number; icon: string };
export type SlotStatus   = "available" | "booked" | "blocked" | "selected";
export type TimeSlot     = { time: string; status: SlotStatus };
