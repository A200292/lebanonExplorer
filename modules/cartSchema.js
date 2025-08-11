const mongoose = require("mongoose");
const Schema= mongoose.Schema;


const cartSchema = new Schema({
     cartId:{
        type: Schema.Types.ObjectId,
     },
     buyerId:{
        type: Schema.Types.ObjectId,
        ref: "Person",

     },

     items:[{
        offeringId:{
            type: Schema.Types.ObjectId,
            ref: "offering",
        },
        quantity:{
            type: Number,
        },

        slotId:{
            type: Schema.Types.ObjectId,
            ref: "BookingSlot",
        }

     }],
     appliedDiscountId:{
        type: Schema.Types.ObjectId,
        ref: "Discount",
     },
     updatedAt: {
       type: Date,
      default: Date.now,
     },
    
     tenantId:{
        type:Schema.Types.ObjectId,
     },
     
     isDeleted:{
        type: Boolean,
        default: false,
     },

     
     deletedAt:{
        type: Date,
        default: Date.now,

     },
  
},
{
    timestamps: true
}

);

module.exports= mongoose.model("cart", cartSchema);


