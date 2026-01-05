import {MongoClient} from 'mongodb';

import mongoose from "mongoose";




export let client: MongoClient;


export async function runDB(url: string): Promise<void> {



    try {

        await mongoose.connect(url);

        console.log('✅ Connected to the database');
    } catch (e) {
        await mongoose.disconnect()

        throw new Error(`❌ Database not connected: ${e}`);
    }
}











