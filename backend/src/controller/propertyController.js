// backend/src/controller/propertyController.js

import { Property } from "../model/property.Schema.js";

// GET /api/properties
// Query params: city, q, type, purpose, minPrice, maxPrice, bedrooms, page, limit
export const getProperties = async (req, res) => {
  try {
    const {
      city, q, type, purpose,
      minPrice, maxPrice, bedrooms,
      page = 1, limit = 12,
    } = req.query;

    const filter = { status: "available" };

    if (city)    filter["location.city"] = new RegExp(city, "i");
    if (type)    filter.type    = type;
    if (purpose) filter.purpose = purpose;
    if (bedrooms) filter.bedrooms = Number(bedrooms);

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (q) {
      filter.$or = [
        { title:              new RegExp(q, "i") },
        { description:        new RegExp(q, "i") },
        { "location.city":    new RegExp(q, "i") },
        { "location.address": new RegExp(q, "i") },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(filter);

    const properties = await Property.find(filter)
      .populate("owner", "name email image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      properties,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("getProperties error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/properties/:id
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "name email image phone");

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, property });
  } catch (error) {
    console.error("getPropertyById error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};