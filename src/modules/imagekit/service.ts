import { AbstractFileProviderService } from "@medusajs/framework/utils"
import { Logger, ProviderDeleteFileDTO, ProviderFileResultDTO, ProviderGetFileDTO, ProviderUploadFileDTO } from "@medusajs/types"
import ImageKit from "imagekit"
import { ImageKitOptions } from "imagekit/dist/libs/interfaces"

type InjectedDependencies = {
    logger: Logger
}

class ImagekitService extends AbstractFileProviderService {
    protected logger_: Logger
    protected options_: ImageKitOptions
    // assuming you're initializing a client
    protected imageKitClient: ImageKit

    static identifier = "imagekit"
    constructor(
        { logger }: InjectedDependencies,
        options: ImageKitOptions
    ) {
        super()

        this.logger_ = logger
        this.options_ = options

        // assuming you're initializing a client
        this.imageKitClient = new ImageKit(options)
    }



    async upload(
        file: ProviderUploadFileDTO
    ): Promise<ProviderFileResultDTO> {
        // Convert binary string to base64 if it's not already
        const base64Content = Buffer.from(file.content, 'binary').toString('base64')

        // Add data URI prefix for images
        const mimeType = file.mimeType || 'image/jpeg' // Default to jpeg if mime_type is not provided
        const base64FileContent = `data:${mimeType};base64,${base64Content}`

        const res = await this.imageKitClient.upload({
            file: base64FileContent,
            fileName: file.filename,

            isPrivateFile: file.access === "private",
        })
        return {
            url: res.url,
            key: res.fileId,
        }
    }

    async delete(file: ProviderDeleteFileDTO): Promise<void> {
        this.imageKitClient.deleteFile(file.fileKey)
    }
    async getPresignedDownloadUrl(
        fileData: ProviderGetFileDTO
    ): Promise<string> {
        const res = await this.imageKitClient.getFileDetails(fileData.fileKey)
        return res.filePath
    }
}

export default ImagekitService