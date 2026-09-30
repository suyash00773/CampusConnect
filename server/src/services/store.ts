import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin, IAdmin } from '../models/Admin.js';
import { Club, IClub } from '../models/Club.js';
import { Event, IEvent } from '../models/Event.js';
import { Registration, IRegistration } from '../models/Registration.js';
import { getSeedData } from '../seed/seedData.js';

class DataStore {
  private inMemoryAdmins: any[] = [];
  private inMemoryClubs: any[] = [];
  private inMemoryEvents: any[] = [];
  private inMemoryRegistrations: any[] = [];
  private initialized = false;

  private isMongoLive(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public async initialize() {
    if (this.initialized) return;

    const seed = await getSeedData();
    this.inMemoryAdmins = [seed.admin];
    this.inMemoryClubs = [...seed.clubs];
    this.inMemoryEvents = [...seed.events];
    this.inMemoryRegistrations = [...seed.registrations];
    this.initialized = true;

    // If MongoDB is connected, ensure seeded in MongoDB
    if (this.isMongoLive()) {
      try {
        const clubCount = await Club.countDocuments();
        if (clubCount === 0) {
          console.log('🌱 Seeding initial data into MongoDB Atlas...');
          await this.seedAllToMongo();
        }
      } catch (err) {
        console.error('Error checking/seeding MongoDB Atlas:', err);
      }
    }
  }

  public async seedAllToMongo() {
    const seed = await getSeedData();
    await Admin.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});

    await Admin.create(seed.admin);
    await Club.insertMany(seed.clubs);
    await Event.insertMany(seed.events);
    await Registration.insertMany(seed.registrations);

    console.log('✅ MongoDB Atlas seeded with initial clubs, events, and admin.');
  }

  public async resetAndSeed() {
    const seed = await getSeedData();
    this.inMemoryAdmins = [seed.admin];
    this.inMemoryClubs = [...seed.clubs];
    this.inMemoryEvents = [...seed.events];
    this.inMemoryRegistrations = [...seed.registrations];

    if (this.isMongoLive()) {
      await this.seedAllToMongo();
    }
    return { success: true, message: 'Database reset and seeded with rich sample data.' };
  }

  // --- ADMIN AUTH METHODS ---
  public async findAdminByEmail(email: string) {
    if (this.isMongoLive()) {
      return await Admin.findOne({ email: email.toLowerCase() });
    }
    return this.inMemoryAdmins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
  }

  public async findAdminById(id: string) {
    if (this.isMongoLive()) {
      return await Admin.findById(id).select('-password');
    }
    const admin = this.inMemoryAdmins.find((a) => String(a._id) === String(id));
    if (!admin) return null;
    const { password, ...safeAdmin } = admin;
    return safeAdmin;
  }

  // --- CLUBS METHODS ---
  public async getClubs() {
    if (this.isMongoLive()) {
      const clubs = await Club.find().sort({ isFeatured: -1, name: 1 }).lean();
      // compute event count for each club
      const clubsWithCounts = await Promise.all(
        clubs.map(async (c: any) => {
          const eventCount = await Event.countDocuments({ club: c._id });
          return { ...c, eventCount };
        })
      );
      return clubsWithCounts;
    }

    return this.inMemoryClubs.map((club) => {
      const eventCount = this.inMemoryEvents.filter(
        (e) => String(e.club) === String(club._id)
      ).length;
      return { ...club, eventCount };
    });
  }

  public async getClubByIdOrSlug(idOrSlug: string) {
    if (this.isMongoLive()) {
      let club = null;
      if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        club = await Club.findById(idOrSlug).lean();
      }
      if (!club) {
        club = await Club.findOne({ slug: idOrSlug.toLowerCase() }).lean();
      }
      if (!club) return null;

      const events = await Event.find({ club: (club as any)._id })
        .sort({ date: 1 })
        .lean();
      return { ...(club as any), events };
    }

    const club = this.inMemoryClubs.find(
      (c) =>
        String(c._id) === idOrSlug ||
        c.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!club) return null;

    const events = this.inMemoryEvents.filter(
      (e) => String(e.club) === String(club._id)
    );
    return { ...club, events };
  }

  public async createClub(data: any) {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    if (this.isMongoLive()) {
      const newClub = await Club.create({ ...data, slug });
      return newClub;
    }

    const newClub = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...data,
      slug,
      memberCount: data.memberCount || 0,
      isFeatured: !!data.isFeatured,
      socialLinks: data.socialLinks || { instagram: '', linkedin: '', github: '', website: '' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inMemoryClubs.push(newClub);
    return newClub;
  }

  public async updateClub(id: string, data: any) {
    if (this.isMongoLive()) {
      return await Club.findByIdAndUpdate(id, data, { new: true });
    }

    const index = this.inMemoryClubs.findIndex((c) => String(c._id) === id);
    if (index === -1) return null;

    this.inMemoryClubs[index] = {
      ...this.inMemoryClubs[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.inMemoryClubs[index];
  }

  public async deleteClub(id: string) {
    if (this.isMongoLive()) {
      return await Club.findByIdAndDelete(id);
    }
    const index = this.inMemoryClubs.findIndex((c) => String(c._id) === id);
    if (index === -1) return null;
    const removed = this.inMemoryClubs.splice(index, 1);
    return removed[0];
  }

  // --- EVENTS METHODS ---
  public async getEvents(query: {
    search?: string;
    category?: string;
    club?: string;
    timeframe?: 'upcoming' | 'past' | 'all';
    status?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      search = '',
      category,
      club,
      timeframe = 'all',
      status,
      sort = 'date-asc',
      page = 1,
      limit = 20,
    } = query;

    const todayStr = new Date().toISOString().split('T')[0];

    if (this.isMongoLive()) {
      const filter: any = {};

      if (category && category !== 'All') {
        filter.category = category;
      }
      if (club && club !== 'All') {
        if (mongoose.Types.ObjectId.isValid(club)) {
          filter.club = club;
        } else {
          const clubDoc = await Club.findOne({ slug: club });
          if (clubDoc) filter.club = clubDoc._id;
        }
      }
      if (status) {
        filter.status = status;
      }
      if (timeframe === 'upcoming') {
        filter.date = { $gte: todayStr };
      } else if (timeframe === 'past') {
        filter.date = { $lt: todayStr };
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { title: regex },
          { description: regex },
          { venue: regex },
          { tags: regex },
        ];
      }

      let sortOption: any = { date: 1 };
      if (sort === 'date-desc') sortOption = { date: -1 };
      if (sort === 'popular') sortOption = { registeredCount: -1 };
      if (sort === 'capacity') sortOption = { capacity: -1 };

      const total = await Event.countDocuments(filter);
      const events = await Event.find(filter)
        .populate('club', 'name slug category logoUrl bannerUrl leadName')
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return {
        events,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }

    // In-Memory Implementation
    let filtered = [...this.inMemoryEvents];

    if (status) {
      filtered = filtered.filter((e) => e.status === status);
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(
        (e) => e.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (club && club !== 'All') {
      filtered = filtered.filter(
        (e) =>
          String(e.club) === club ||
          this.inMemoryClubs.find((c) => c.slug === club && String(e.club) === String(c._id))
      );
    }
    if (timeframe === 'upcoming') {
      filtered = filtered.filter((e) => e.date >= todayStr);
    } else if (timeframe === 'past') {
      filtered = filtered.filter((e) => e.date < todayStr);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          (e.tags && e.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sort === 'date-desc') return b.date.localeCompare(a.date);
      if (sort === 'popular') return (b.registeredCount || 0) - (a.registeredCount || 0);
      if (sort === 'capacity') return (b.capacity || 0) - (a.capacity || 0);
      return a.date.localeCompare(b.date);
    });

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    // Populate club
    const populated = paginated.map((e) => {
      const clubDoc = this.inMemoryClubs.find((c) => String(c._id) === String(e.club));
      return {
        ...e,
        club: clubDoc || { name: 'Campus Club', slug: 'campus-club', logoUrl: '' },
      };
    });

    return {
      events: populated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public async getFeaturedEvents() {
    const query = { timeframe: 'upcoming' as const, sort: 'popular', limit: 4 };
    const { events } = await this.getEvents(query);
    const heroFeatured = events.find((e: any) => e.featured) || events[0] || null;
    const upcomingHighlights = events.filter(
      (e: any) => heroFeatured && String(e._id) !== String(heroFeatured._id)
    ).slice(0, 3);

    return {
      featured: heroFeatured,
      upcoming: upcomingHighlights,
    };
  }

  public async getEventByIdOrSlug(idOrSlug: string) {
    if (this.isMongoLive()) {
      let event = null;
      if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        event = await Event.findById(idOrSlug)
          .populate('club', 'name slug category logoUrl bannerUrl leadName leadEmail memberCount socialLinks')
          .lean();
      }
      if (!event) {
        event = await Event.findOne({ slug: idOrSlug.toLowerCase() })
          .populate('club', 'name slug category logoUrl bannerUrl leadName leadEmail memberCount socialLinks')
          .lean();
      }
      return event;
    }

    const event = this.inMemoryEvents.find(
      (e) =>
        String(e._id) === idOrSlug ||
        e.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!event) return null;

    const club = this.inMemoryClubs.find((c) => String(c._id) === String(event.club));
    return {
      ...event,
      club: club || { name: 'Campus Club', slug: 'campus-club' },
    };
  }

  public async createEvent(data: any) {
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Math.random().toString(36).substring(2, 6);

    if (this.isMongoLive()) {
      return await Event.create({ ...data, slug });
    }

    const newEvent = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...data,
      slug,
      registeredCount: 0,
      status: data.status || 'published',
      featured: !!data.featured,
      tags: data.tags || [],
      requirements: data.requirements || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inMemoryEvents.push(newEvent);
    return newEvent;
  }

  public async updateEvent(id: string, data: any) {
    if (this.isMongoLive()) {
      return await Event.findByIdAndUpdate(id, data, { new: true }).populate(
        'club',
        'name slug category logoUrl'
      );
    }

    const index = this.inMemoryEvents.findIndex((e) => String(e._id) === id);
    if (index === -1) return null;

    this.inMemoryEvents[index] = {
      ...this.inMemoryEvents[index],
      ...data,
      updatedAt: new Date(),
    };
    const club = this.inMemoryClubs.find(
      (c) => String(c._id) === String(this.inMemoryEvents[index].club)
    );
    return { ...this.inMemoryEvents[index], club };
  }

  public async deleteEvent(id: string) {
    if (this.isMongoLive()) {
      await Registration.deleteMany({ event: id });
      return await Event.findByIdAndDelete(id);
    }

    const index = this.inMemoryEvents.findIndex((e) => String(e._id) === id);
    if (index === -1) return null;
    const removed = this.inMemoryEvents.splice(index, 1);
    this.inMemoryRegistrations = this.inMemoryRegistrations.filter(
      (r) => String(r.event) !== id
    );
    return removed[0];
  }

  // --- REGISTRATIONS METHODS ---
  public async registerStudent(data: {
    eventId: string;
    fullName: string;
    email: string;
    college: string;
    academicYear: any;
    phone: string;
    notes?: string;
  }) {
    const normalizedEmail = data.email.trim().toLowerCase();

    // Check event exists
    const event = await this.getEventByIdOrSlug(data.eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const eventId = String(event._id);

    // Duplicate Check: has this email already registered for this event?
    if (this.isMongoLive()) {
      const existing = await Registration.findOne({
        event: eventId,
        email: normalizedEmail,
      });
      if (existing) {
        throw new Error(
          `This email (${normalizedEmail}) is already registered for "${event.title}". Duplicate registrations are not permitted.`
        );
      }

      // Check capacity
      if (event.registeredCount >= event.capacity) {
        throw new Error('Sorry, this event has reached full capacity. Registrations are closed.');
      }

      // Unique Registration ID: CC-2026-XXXXX
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const registrationId = `CC-2026-${randomCode}`;

      const newRegistration = await Registration.create({
        registrationId,
        event: eventId,
        fullName: data.fullName.trim(),
        email: normalizedEmail,
        college: data.college.trim(),
        academicYear: data.academicYear,
        phone: data.phone.trim(),
        notes: data.notes || '',
        status: 'Confirmed',
        registeredAt: new Date(),
      });

      // Increment registeredCount atomically
      await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

      return {
        registration: newRegistration,
        event: {
          title: event.title,
          date: event.date,
          startTime: event.startTime,
          venue: event.venue,
          bannerUrl: event.bannerUrl,
        },
      };
    }

    // In-memory duplicate check
    const existingMem = this.inMemoryRegistrations.find(
      (r) =>
        String(r.event) === eventId &&
        r.email.toLowerCase() === normalizedEmail
    );
    if (existingMem) {
      throw new Error(
        `This email (${normalizedEmail}) is already registered for "${event.title}". Duplicate registrations are not permitted.`
      );
    }

    if ((event.registeredCount || 0) >= event.capacity) {
      throw new Error('Sorry, this event has reached full capacity. Registrations are closed.');
    }

    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const registrationId = `CC-2026-${randomCode}`;

    const newReg = {
      _id: new mongoose.Types.ObjectId().toString(),
      registrationId,
      event: eventId,
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      college: data.college.trim(),
      academicYear: data.academicYear,
      phone: data.phone.trim(),
      notes: data.notes || '',
      status: 'Confirmed',
      registeredAt: new Date(),
    };

    this.inMemoryRegistrations.push(newReg);

    // update event registeredCount
    const evIndex = this.inMemoryEvents.findIndex((e) => String(e._id) === eventId);
    if (evIndex !== -1) {
      this.inMemoryEvents[evIndex].registeredCount =
        (this.inMemoryEvents[evIndex].registeredCount || 0) + 1;
    }

    return {
      registration: newReg,
      event: {
        title: event.title,
        date: event.date,
        startTime: event.startTime,
        venue: event.venue,
        bannerUrl: event.bannerUrl,
      },
    };
  }

  public async getRegistrations(query: {
    eventId?: string;
    search?: string;
    academicYear?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { eventId, search = '', academicYear, status, page = 1, limit = 50 } = query;

    if (this.isMongoLive()) {
      const filter: any = {};
      if (eventId && eventId !== 'All') {
        filter.event = eventId;
      }
      if (academicYear && academicYear !== 'All') {
        filter.academicYear = academicYear;
      }
      if (status && status !== 'All') {
        filter.status = status;
      }
      if (search.trim()) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { fullName: regex },
          { email: regex },
          { college: regex },
          { registrationId: regex },
          { phone: regex },
        ];
      }

      const total = await Registration.countDocuments(filter);
      const registrations = await Registration.find(filter)
        .populate('event', 'title category date startTime venue')
        .sort({ registeredAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return {
        registrations,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }

    // In-memory
    let filtered = [...this.inMemoryRegistrations];

    if (eventId && eventId !== 'All') {
      filtered = filtered.filter((r) => String(r.event) === eventId);
    }
    if (academicYear && academicYear !== 'All') {
      filtered = filtered.filter((r) => r.academicYear === academicYear);
    }
    if (status && status !== 'All') {
      filtered = filtered.filter((r) => r.status === status);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.college.toLowerCase().includes(q) ||
          r.registrationId.toLowerCase().includes(q) ||
          r.phone.includes(q)
      );
    }

    filtered.sort(
      (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    );

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    const populated = paginated.map((r) => {
      const ev = this.inMemoryEvents.find((e) => String(e._id) === String(r.event));
      return {
        ...r,
        event: ev
          ? {
              _id: ev._id,
              title: ev.title,
              category: ev.category,
              date: ev.date,
              startTime: ev.startTime,
              venue: ev.venue,
            }
          : { title: 'Unknown Event', category: 'General' },
      };
    });

    return {
      registrations: populated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public async getRegistrationsForExport(eventId?: string) {
    const query = { eventId, limit: 10000 };
    const { registrations } = await this.getRegistrations(query);

    return registrations.map((r: any) => ({
      registrationId: r.registrationId,
      eventTitle: r.event?.title || 'Unknown Event',
      eventCategory: r.event?.category || 'N/A',
      eventDate: r.event?.date || 'N/A',
      fullName: r.fullName,
      email: r.email,
      college: r.college,
      academicYear: r.academicYear,
      phone: r.phone,
      status: r.status,
      notes: r.notes || '',
      registeredAt: new Date(r.registeredAt).toLocaleString(),
    }));
  }

  public async deleteRegistration(id: string) {
    if (this.isMongoLive()) {
      const reg = await Registration.findById(id);
      if (!reg) return null;
      await Event.findByIdAndUpdate(reg.event, { $inc: { registeredCount: -1 } });
      return await Registration.findByIdAndDelete(id);
    }

    const index = this.inMemoryRegistrations.findIndex((r) => String(r._id) === id);
    if (index === -1) return null;
    const [removed] = this.inMemoryRegistrations.splice(index, 1);
    // decrement event count
    const evIndex = this.inMemoryEvents.findIndex((e) => String(e._id) === String(removed.event));
    if (evIndex !== -1 && this.inMemoryEvents[evIndex].registeredCount > 0) {
      this.inMemoryEvents[evIndex].registeredCount--;
    }
    return removed;
  }

  // --- STATS OVERVIEW ---
  public async getDashboardStats() {
    const todayStr = new Date().toISOString().split('T')[0];

    if (this.isMongoLive()) {
      const totalEvents = await Event.countDocuments();
      const upcomingEvents = await Event.countDocuments({ date: { $gte: todayStr } });
      const totalRegistrations = await Registration.countDocuments();
      const activeClubs = await Club.countDocuments();

      // Recent 5 registrations
      const recentRegistrations = await Registration.find()
        .populate('event', 'title category date')
        .sort({ registeredAt: -1 })
        .limit(5)
        .lean();

      // Registrations per category
      const events = await Event.find().select('category registeredCount').lean();
      const categoryMap: Record<string, number> = {};
      events.forEach((ev: any) => {
        categoryMap[ev.category] = (categoryMap[ev.category] || 0) + (ev.registeredCount || 0);
      });

      return {
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        activeClubs,
        recentRegistrations,
        categoryBreakdown: categoryMap,
      };
    }

    const totalEvents = this.inMemoryEvents.length;
    const upcomingEvents = this.inMemoryEvents.filter((e) => e.date >= todayStr).length;
    const totalRegistrations = this.inMemoryRegistrations.length;
    const activeClubs = this.inMemoryClubs.length;

    const recentRegistrations = this.inMemoryRegistrations
      .slice(-5)
      .reverse()
      .map((r) => {
        const ev = this.inMemoryEvents.find((e) => String(e._id) === String(r.event));
        return {
          ...r,
          event: ev ? { title: ev.title, category: ev.category, date: ev.date } : null,
        };
      });

    const categoryMap: Record<string, number> = {};
    this.inMemoryEvents.forEach((ev) => {
      categoryMap[ev.category] = (categoryMap[ev.category] || 0) + (ev.registeredCount || 0);
    });

    return {
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      activeClubs,
      recentRegistrations,
      categoryBreakdown: categoryMap,
    };
  }
}

export const store = new DataStore();
