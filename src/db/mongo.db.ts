import {Collection, MongoClient} from 'mongodb';
import {PostInDb} from "../posts/routes/posts.entity";
import {CommentInDb} from "../comments/routers/comments.entity";
import {BlogInDb} from "../blogs/routers/blogs.entity";
import {UserInDb} from "../users/routes/users.entity";
import {RecoveryPassInDb, RequestCounter} from "../auth/routers/auth.entity";
import {SessionInDb} from "../securityDevices/routes/sessions.entity";
import mongoose from "mongoose";



const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';
const USER_COLLECTION_NAME = 'users';
const COMMENTS_COLLECTION_NAME = 'comments';
const SESSIONS_COLLECTION_NAME = 'sessions';
const REQUEST_COLLECTION_NAME = 'requests';
const RECOVERY_COLLECTION_NAME = 'recovery';


export let client: MongoClient;
export let blogCollection: Collection<BlogInDb>;
export let postCollection: Collection<PostInDb>;
export let userCollection: Collection<UserInDb>
export let commentCollection: Collection<CommentInDb>;
export let sessionCollection: Collection<SessionInDb>
export let requestCounterCollection: Collection<RequestCounter>
export let recoveryPassCollection: Collection<RecoveryPassInDb>


export async function runDB(url: string): Promise<void> {
    // client = new MongoClient(url);
    // const db: Db = client.db(SETTINGS.DB_NAME);
    //
    //
    // blogCollection = db.collection<BlogInDb>(BLOG_COLLECTION_NAME);
    // postCollection = db.collection<PostInDb>(POST_COLLECTION_NAME);
    // userCollection = db.collection<UserInDb>(USER_COLLECTION_NAME);
    // commentCollection = db.collection<CommentInDb>(COMMENTS_COLLECTION_NAME);
    // sessionCollection = db.collection<SessionInDb>(SESSIONS_COLLECTION_NAME);
    // requestCounterCollection = db.collection<RequestCounter>(REQUEST_COLLECTION_NAME);
    // recoveryPassCollection = db.collection<RecoveryPassInDb>(RECOVERY_COLLECTION_NAME);


    try {
        // await client.connect();
        await mongoose.connect(url);
        // await db.command({ping: 1});
        console.log('✅ Connected to the database');
    } catch (e) {
        await mongoose.disconnect()
        // await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}











