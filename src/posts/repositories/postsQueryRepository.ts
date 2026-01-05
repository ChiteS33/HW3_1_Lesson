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


    async findAll(query: InPutPagination, userId?: string): Promise<ObjectResult<FinalWithPagination<PostOutPut>>> {

        const pagination: PaginationForRepo = valuesPaginationMaker(query)
        const limit = pagination.pageSize
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize
        const sort = {[pagination.sortBy]: pagination.sortDirection}
        const foundedPosts: PostDocument[] = await PostModel.find().skip(skip).limit(limit).sort(sort)
        const mappedPostsPromises = foundedPosts.map((post) => {
            return this.findPostById(post._id.toString(), userId)
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

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutPaginationPostMapper(postsWithLikes, paginationForFront)
        }
    }

    async findPostById(postId: string, userId?: string): Promise<ObjectResult<PostOutPut | null>> {
        const totalCountLike = await LikeModelForPost.countDocuments({postId: postId, status: "Like"})
        const totalCountDislike = await LikeModelForPost.countDocuments({postId: postId, status: "Dislike"})
        let myStatus = "None"
        const foundPost: PostDocument | null = await PostModel.findOne({_id: postId})
        const newestLikesForPost = await LikeModelForPost
            .find({postId, status: "Like"})
            .sort({data: -1})
            .limit(3)

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
        if (userId === null) {
            return {
                status: ResultStatus.Success,
                extensions: [],
                data: outPutMapperForPostWithNewestLikes(foundPost, totalCountLike, totalCountDislike, myStatus, newestLikesForPost)
            }
        }
        const foundLikeForPost = await LikeModelForPost.findOne({postId, userId})
        if (!foundLikeForPost) {
            return {
                status: ResultStatus.Success,
                errorMessage: "Like not found",
                extensions: [{
                    field: "postId",
                    message: "Like not found"
                }],
                data: outPutMapperForPostWithNewestLikes(foundPost, totalCountLike, totalCountDislike, myStatus, newestLikesForPost)
            }
        }
        myStatus = foundLikeForPost.status
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutMapperForPostWithNewestLikes(foundPost, totalCountLike, totalCountDislike, myStatus, newestLikesForPost)
        }
    }

    async findPostsByBlogId(id: string, query: InPutPagination, userId?: string): Promise<ObjectResult<FinalWithPagination<PostOutPut>>> {

        const pagination: PaginationForRepo = valuesPaginationMaker(query)
        const limit = pagination.pageSize
        const skip = (pagination.pageSize * pagination.pageNumber) - pagination.pageSize;
        const sorting = {
            [pagination.sortBy]: pagination.sortDirection,
        }
        const foundPosts: PostDocument[] = await PostModel.find({blogId: id}).skip(skip).limit(limit).sort(sorting);

        const mappedPostsPromises = foundPosts.map((post) => {
            return this.findPostById(post._id.toString(), userId)
        })
        const mappedPosts = await Promise.all(mappedPostsPromises)
        const postsWithLikes = mappedPosts.map((post) => {
            return post.data!
        })

        const totalCount = await PostModel.countDocuments({blogId: id})
        const paginationForFront = {
            pagesCount: Math.ceil(totalCount / pagination.pageSize),
            page: pagination.pageNumber,
            pageSize: limit,
            totalCount: totalCount,
        }
        console.log(postsWithLikes)
        // const postsForFront: PostOutPut[] = foundPosts.map(outPutPostMapper
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: outPutPaginationPostMapper(postsWithLikes, paginationForFront)
        }
    }


}

export const outPutMapperForPostWithNewestLikes = (post: PostDocument, totalCountLike: any, totalCountDislike: any, status: string, newestLikesForPost: LikeInDbForPost[]): any => {

    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt.toISOString(),
        extendedLikesInfo: {
            likesCount: totalCountLike,
            dislikesCount: totalCountDislike,
            myStatus: status,

            newestLikes: newestLikesForPost.map(like => ({
                addedAt: like.data.toISOString(),
                userId: like.userId,
                login: like.login,
            }))
        }
    }
}

