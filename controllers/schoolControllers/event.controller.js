import { Event } from "../../models/School/gbuEvents.model.js";

/* --------------------------- 1. Create Event --------------------------- */
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, imageUrl, tags } = req.body;

    if (!title || !description || !date || !venue) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Check for duplicate title
    const existing = await Event.findOne({ title: title.trim() });
    if (existing) {
      return res.status(409).json({ error: "Event title already exists" });
    }

    const newEvent = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date: new Date(date),
      venue: venue.trim(),
      imageUrl: imageUrl?.trim() || null,
      tags: Array.isArray(tags) ? tags.map((tag) => tag.trim()) : [],
    });

    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating event" });
  }
};

/* --------------------------- 2. List Events --------------------------- */
export const listEvents = async (_req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching events" });
  }
};

/* --------------------------- 3. Delete Event --------------------------- */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while deleting event" });
  }
};
