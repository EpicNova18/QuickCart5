import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });


// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email_addresses: email_addresses[0].email_addresses,
            name: first_name + ' ' + last_name,
            image_Url: image_url
        }
        await connectDB()
        await User.create(userData)
    }
)

// Inngest Function to update user data to a database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email_addresses: email_addresses[0].email_addresses,
            name: first_name + ' ' + last_name,
            image_Url: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

// Inngest Function to delete user data from a database
export const syncUserDeletion = inngest.creatrFunction(
    {
        id: 'delete-user-with-clerk'
    },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        await connectDB()
        await User.findByIdAndDelete(id)
    }
)