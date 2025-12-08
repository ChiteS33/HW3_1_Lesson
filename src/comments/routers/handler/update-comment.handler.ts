import {Request, Response} from 'express';
import {HttpStatus} from "../../../core/types/http-statuses";
import {commentsServices} from "../../application/comments.service";
import {commentsRepository} from "../../repositories/comments.repository";
import {WithId} from "mongodb";
import {CommentInDb} from "../../types/commentInDb";


export async function updateComment(req: Request, res: Response) {

    const commentId = req.params.id;
    const body = req.body;
    const userLogin = req.user!.login;


    const comment: WithId<CommentInDb> | null = await commentsRepository.findById(commentId);


    if (!comment) return res.sendStatus(HttpStatus.NotFound)
    if (userLogin !== comment.commentatorInfo.userLogin) return res.sendStatus(HttpStatus.Forbidden);

     await commentsServices.update(commentId, body)


    return res.sendStatus(HttpStatus.NoContent)
}


// {
//     "title": "Serafimus",
//     "shortDescription": "Kakaha",
//     "content": "HehEH",
//     "blogId": "691a0ea16842609569e5fd68"
// }
// "id": "691a18570758d2c1a0701c32",
//     "content": "asdadasdasDSAdADSADdasDASDASDASD",
//     "commentatorInfo": {
//     "userId": "691a17dc0758d2c1a0701c2f",
//         "userLogin": "TESTOVIY"
// },
// "createdAt": "2025-11-16T18:30:47.388Z"
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTFhMTdkYzA3NThkMmMxYTA3MDFjMmYiLCJpYXQiOjE3NjMzMTc3NDUsImV4cCI6MTc2MzMyMTM0NX0.DHPvWojNAgPBXRuBIRp6SVfabvvtIhI_SmRwKhbeo0g


// {
//     "login": "Vraki11",
//     "password": "Vraki11",
//     "email": "totsm1iyGrek@gmail.com"
// }
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTFhMTkxNGNjY2M2NzBjYWU5NDBlY2EiLCJpYXQiOjE3NjMzMTgwNzksImV4cCI6MTc2MzMyMTY3OX0.m1KuguGJq4vWQDORb_6V8rUesKSzaHeqW0phaPIPkII
