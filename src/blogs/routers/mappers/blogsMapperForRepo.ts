import {BlogInputDto} from "../../types/blogInPutDto";
import {BlogInDb} from "../../types/blogInDb";

export const blogsValueMaker = (dto: BlogInputDto): BlogInDb => {
    return {
        name: dto.name,
        description: dto.description,
        websiteUrl: dto.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false
    }
}