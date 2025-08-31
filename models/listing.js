


const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");



const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
       url: String,
       filename: String,
    },

    price: Number,

    location: String,

    country: String,

    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner: 
        {
        type: Schema.Types.ObjectId,
        ref: "user",
        },
});

// Add a virtual property for average rating
listingSchema.virtual('avgRating').get(function() {
    if (this.review.length === 0) {
        return 0;
    }
    
    // If reviews are populated, calculate average
    if (this.review.length > 0 && typeof this.review[0] === 'object' && this.review[0].rating) {
        let sum = 0;
        for (let review of this.review) {
            sum += review.rating;
        }
        return (sum / this.review.length).toFixed(1);
    }
    
    return 0;
});

// Ensure virtuals are included when converting to JSON
listingSchema.set('toJSON', { virtuals: true });
listingSchema.set('toObject', { virtuals: true });

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.review}});
  }
});

//CREATING MODULE
const Listing = mongoose.model("Listing", listingSchema) ;

//and exporting this model to app.js with
module.exports = Listing;