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

const listSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    storedEmail: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    listAuthor: {
        type: String,
        required: true,
        trim: true,
    },
    listName: {
        type: String,
        required: true,
        trim: true,
    },
    items: [itemSchema],
});

const List = mongoose.model('List', listSchema);

module.exports = List;