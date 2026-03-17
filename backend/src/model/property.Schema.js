const propertySchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        enum: ["apartment", "house", "villa", "plot", "commercial"],
        required: true
    },

    purpose: {
        type: String,
        enum: ["sale", "rent"],
        required: true
    },

    bedrooms: Number,
    bathrooms: Number,

    area: {
        value: Number,
        unit: {
            type: String,
            default: "sqft"
        }
    },

    location: {
        city: String,
        state: String,
        country: String,
        address: String,

        coordinates: {
            lat: Number,
            lng: Number
        }
    },

    amenities: [String],

    images: [String],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: ["available", "sold", "rented"],
        default: "available"
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);