import request from "supertest";
import express, {Express} from "express";
import {setupApp} from "../../../src/setup-app";
import {runDB, userCollection} from "../../../src/db/mongo.db";
import {SETTINGS} from "../../../src/core/settings/settings";
import {EmailAdapter} from "../../../src/adapters/email-adapter";



let app: Express;
const user1 = {
    "login": "ChiteS",
    "password": "ChiteS",
    "email": "totsamiyemail@gmail.com"
}

let token: string;


describe('AUTH', () => {
    beforeAll(async () => {
        app = express();
        setupApp(app);
        await runDB(SETTINGS.MONGO_URL);

        jest.spyOn(EmailAdapter, 'sendEmail').mockResolvedValue(true)
        await request(app).delete('/api/testing/all-data');
    })

    describe('registration', () => {
        it('should register user', async () => {
             await request(app)
                .post('/api/auth/registration')
                .send(user1)
                .expect(204)

        })
        it('shouldn`t creat user twice', async () => {
             await request(app)
                .post('/api/auth/registration')
                .send(user1)
                .expect(400)

        })
        it('shouldn`t creat user incorrect', async () => {
            await request(app)
                .post('/api/auth/registration')
                .send({
                    ...user1,
                    login: 'kek'
                })
                .expect(400)

            await request(app)
                .post('/api/auth/registration')
                .send({
                    ...user1,
                    email: 'kek'
                })
                .expect(400)

        })


    })

    describe('login', () => {
        it('should login user', async () => {
            const result = await request(app)
                .post('/api/auth/login')
                .send({
                    loginOrEmail: user1.login,
                    password: user1.password
                })
                .expect(200)
            expect(result.body.accessToken).toBeDefined()
            token = result.body.accessToken
        })

        it('shouldn`t login user', async () => {
             await request(app)
                .post('/api/auth/login')
                .send({
                    loginOrEmail: "kekw",
                    password: user1.password
                })
                .expect(401)

            await request(app)
                .post('/api/auth/login')
                .send({
                    loginOrEmail: user1.login,
                    password: '123456hgg'
                })
                .expect(401)


        })
    })

    describe('me', () => {
        it('Can`t get user if incorrect accesss token', async () => {
            await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}1`)
                .expect(401)

        })
        it('Can get user', async () => {
            const result = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
            expect(result.body).toEqual({
                email: user1.email,
                login: user1.login,
                userId: expect.any(String)
            })

        })

    })


    describe('confirming', () => {
        it('can`t confirm if code is not valid', async () => {
            await request(app)
                .post('/api/auth/registration-confirmation')
                .send({code: "dsadsad"})
                .expect(400)
        })
        it('confirm if code is valid', async () => {
            const user = await userCollection.findOne({login: user1.login})
            const code = user!.emailConfirmation.confirmationCode


            await request(app)
                .post('/api/auth/registration-confirmation')
                .send({code: code})
                .expect(204)
        })
        it('can`t confirm twice', async () => {
            const user = await userCollection.findOne({login: user1.login})
            const code = user!.emailConfirmation.confirmationCode


            await request(app)
                .post('/api/auth/registration-confirmation')
                .send({code: code})
                .expect(400)
        })

    })

    describe('resend', () => {
        it('delete all shit', async () => {
            await request(app).delete('/api/testing/all-data')
        })
        it('should register user', async () => {
             await request(app)
                .post('/api/auth/registration')
                .send(user1)
                .expect(204)

        })
        it('should resend email', async () => {
//жопа бобра

            await request(app)
                .post('/api/auth/registration-email-resending')
                .send({email: user1.email})
                .expect(204)
        })
        it('confirm if code is valid', async () => {
            const user = await userCollection.findOne({login: user1.login})
            const code = user!.emailConfirmation.confirmationCode


            await request(app)
                .post('/api/auth/registration-confirmation')
                .send({code: code})
                .expect(204)
        })
        it('shouldn`t resend email', async () => {

            await request(app)
                .post('/api/auth/registration-email-resending')
                .send({email: user1.email})
                .expect(400)
        })


    })


})

describe('USER', () => {
    beforeAll(async () => {
        app = express();
        setupApp(app);
        await runDB(SETTINGS.MONGO_URL);


        jest.spyOn(EmailAdapter, 'sendEmail').mockResolvedValue(true)
        await request(app).delete('/api/testing/all-data');
    })

    describe('Unauthorized', () => {
        it('should get err Unauthorized', async () => {
            await request(app)
                .post('/api/users')
                .send(user1)
                .set('Authorization', 'Basic' + Buffer.from('wrong: password').toString('base64'))
                .expect(401)
        })
    })

    describe('create', () => {

        it('should create user', async () => {

            await request(app)
                .post('/api/users')
                .send(user1)
                .expect(201)
        })
    })
    describe('shouldn`t create user', () => {
        it('shouldn`t create user if user is not unique', async () => {
            await request(app)
                .post('/api/users')
                .send(user1)
                .expect(400)
        })
    })

})