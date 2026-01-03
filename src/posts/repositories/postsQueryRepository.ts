import {outPutPostMapper} from "../routes/mappers/outPutPostMapper";
import {outPutPaginationPostMapper} from "../routes/mappers/postFinalMapper";
import {PostOutPut} from "../types/postOutPut";
import {PaginationForRepo} from "../../common/types/paginationForRepo";
import {FinalWithPagination} from "../../common/types/finalWithPagination";
import {InPutPagination} from "../../common/types/inPutPagination";
import {valuesPaginationMaker} from "../../common/mapper/valuesPaginationMaker";
import {ObjectResult, ResultStatus} from "../../common/types/objectResultTypes";
import {LikeInDbForPost, LikeModelForPost, PostDocument, PostModel} from "../routes/posts.entity";
import "reflect-metadata"
import {injectable} from "inversify";


@injectable()
export class PostsQueryRepository {


    async findAll(query: InPutPagination): Promise<ObjectResult<FinalWithPagination<PostOutPut>>> {
        const pagination: PaginationForRepo = valuesPaginationMaker(query)
        const limit = pagination.pageSize
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize
        const sort = {[pagination.sortBy]: pagination.sortDirection}
        const foundedPosts: PostDocument[] = await PostModel.find().skip(skip).limit(limit).sort(sort)
        const mappedPostsPromises = foundedPosts.map((post) => {
            return this.findPostById(post._id.toString())
        })
        const mappedPosts = await Promise.all(mappedPostsPromises)
        const postsWithLikes = mappedPosts.map((post) => {
            return post.data!
        })

        const totalCount = await PostModel.countDocuments()
        const paginationForFront = {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }

        const postForFront: PostOutPut[] = foundedPosts.map(outPutPostMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutPaginationPostMapper(postsWithLikes, paginationForFront)
        }
    }

    async findPostById(postId: string): Promise<ObjectResult<PostOutPut | null>> {
        const totalCountLike = await LikeModelForPost.countDocuments({postId: postId, status: "Like"})
        const totalCountDislike = await LikeModelForPost.countDocuments({postId: postId, status: "Dislike"})
        let myStatus = "None"
        const counter = {totalCountLike, totalCountDislike, myStatus}
        const foundPost: PostDocument | null = await PostModel.findOne({_id: postId})
        if (!foundPost) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Post not found",
                extensions: [{
                    field: "postId",
                    message: " Post not found"
                }],
                data: null
            }
        }
        const newestLikesForPost = await LikeModelForPost
            .find({postId, status: "Like"})
            .sort({data: -1})
            .limit(3)


        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutMapperForPostWithNewestLikes(foundPost, counter, newestLikesForPost)
        }
    }

    async findPostsByBlogId(id: string, query: InPutPagination): Promise<ObjectResult<FinalWithPagination<PostOutPut>>> {
        const pagination: PaginationForRepo = valuesPaginationMaker(query)
        const limit = pagination.pageSize
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize;
        const sorting = {
            [pagination.sortBy]: pagination.sortDirection,
        }
        const posts: PostDocument[] = await PostModel.find({blogId: id}).skip(skip).limit(limit).sort(sorting);
        const totalCount = await PostModel.countDocuments({blogId: id})
        const addValuesForFront = {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }
        const postsForFront: PostOutPut[] = posts.map(outPutPostMapper)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutPaginationPostMapper(postsForFront, addValuesForFront)
        }
    }


}

export const outPutMapperForPostWithNewestLikes = (post: PostDocument, counter: any, newestLikesForPost: LikeInDbForPost[]): any => {

    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt.toISOString(),
        extendedLikesInfo: {
            likesCount: counter.totalCountLike,
            dislikesCount: counter.totalCountDislike,
            myStatus: counter.myStatus,

            newestLikes: newestLikesForPost.map(like => ({
                addedAt: like.data.toISOString(),
                userId: like.userId,
                login: like.login,
            }))
        }
    }
}

