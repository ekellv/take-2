const { Schema, model } = mongoose;

const noteSchema = new Schema({
    noteText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
})

const itemSchema = new Schema({
    list: {
        type: Schema.Types.ObjectId,
        ref: 'list',
    },
    itemText:{
        type: String,
        required: 'You forget to add your item!',
        minlength: 1,
        maxlength: 280,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        },
    quantity: {
        type: Number,
    },
    notes: [noteSchema],
});

const Item = mongoose.model('Item', itemSchema);

module.exports Item;