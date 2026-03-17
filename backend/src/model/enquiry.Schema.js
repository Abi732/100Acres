const enquirySchema = new mongoose.Schema(
{
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    message: {
        type: String
    },

    phone: String,

    status: {
        type: String,
        enum: ["pending", "contacted", "closed"],
        default: "pending"
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);