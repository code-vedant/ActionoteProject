import mongoose, { Schema } from "mongoose";

const tagsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: String,
    color: {
        type: String,
        validate: {
            validator: function(v) {
                return /^#([0-9A-F]{3}){1,2}$/i.test(v);
            },
            message: props => `${props.value} is not a valid hex color!`
        }
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

tagsSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    }
    next();
});

tagsSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('Tag', tagsSchema);
