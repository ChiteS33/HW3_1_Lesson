import {Collection, Db, MongoClient} from 'mongodb';
import {SETTINGS} from '../core/settings/settings';
import {BlogInDb} from "../blogs/types/blogInDb";
import {PostInDb} from "../posts/types/postInDb";
import {UserInDb} from "../users/types/userInDb";
import {CommentInDb} from "../comments/types/commentInDb";
import {RefreshTokenInDb} from "../common/types/blackListType";
import {DeviceInDb} from "../securityDevices/types/deviceInDb";

const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';
const USER_COLLECTION_NAME = 'users';
const COMMENTS_COLLECTION_NAME = 'comments';
const BLACK_LIST_NAME = 'blackList'
const DEVICES_COLLECTION_NAME = 'devices';


export let client: MongoClient;
export let blogCollection: Collection<BlogInDb>;
export let postCollection: Collection<PostInDb>;
export let userCollection: Collection<UserInDb>
export let commentCollection: Collection<CommentInDb>;
export let blackListCollection: Collection<RefreshTokenInDb>
export let devicesCollection: Collection<DeviceInDb>


export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);


    blogCollection = db.collection<BlogInDb>(BLOG_COLLECTION_NAME);
    postCollection = db.collection<PostInDb>(POST_COLLECTION_NAME);
    userCollection = db.collection<UserInDb>(USER_COLLECTION_NAME);
    commentCollection = db.collection<CommentInDb>(COMMENTS_COLLECTION_NAME);
    blackListCollection = db.collection<RefreshTokenInDb>(BLACK_LIST_NAME)
    devicesCollection = db.collection<DeviceInDb>(DEVICES_COLLECTION_NAME);


    try {
        await client.connect();
        await db.command({ping: 1});
        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}

