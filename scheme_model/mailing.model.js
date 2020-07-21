const mongoose = require("mongoose");

const MailingSchema = mongoose.Schema({
    id_receiver:  {
        type: mongoose.Schema.Types.ObjectId,
    },
    type: String,
    status_mail: {
        type: Number,
        default: 0,
    },
    token_email: String,
}, {
    timestamps: true,
});

const Mailing = mongoose.model("Mailing", MailingSchema);
module.exports = Mailing;