const mongoose = require('mongoose');


const trackingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foods',
        required: true
    },
    details:{
        protiens: {
            type: Number,
            required: true
        },
        carbohydrates: {
            type: Number,
            required: true
        },
        fat: {
            type: Number,
            required: true
        },
        fiber: {
            type: Number,
            required: true
        },
        calories: {
            type: Number,
            required: true
        }
 
    },
    eatenDate:{
          type:String,
          default:new Date().toLocaleDateString()
    },
    quantity: {
        type: Number,
        min: 1,
        required: true
    }
}, { timestamps: true });

const trackingModel = mongoose.model("tracking", trackingSchema);

module.exports = trackingModel;
