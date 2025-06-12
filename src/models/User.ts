import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    handle: string;
    name: string;
    email: string;
    description: string;
    password: string;
    image: string;
    links: string;
}

const userSchema = new Schema({
    handle: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        default: ""
    },
    links:{
        type: String,
        default: '[]'
    }
})

const User = mongoose.model<IUser>("user", userSchema)


export default User;
