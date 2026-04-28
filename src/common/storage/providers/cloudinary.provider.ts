import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { IStorageProvider } from '../interfaces/storage-provider.interface';

@Injectable()
export class CloudinaryProvider implements IStorageProvider {
  private readonly logger = new Logger(CloudinaryProvider.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async upload(
    file: Buffer,
    mimetype: string,
    folder: string,
    options?: { isPrivate?: boolean },
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const resource_type = mimetype.startsWith('image/') ? 'image' : 'raw';
      const transformation = mimetype.startsWith('image/')
        ? [
            { width: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ]
        : undefined;

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type, type: options?.isPrivate ? 'private' : 'upload', transformation },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary upload error:', error);
            return reject(
              new BadRequestException(
                'File upload failed. Please check file type and try again.',
              ),
            );
          }

          if (!result?.secure_url) {
            this.logger.error('Cloudinary upload returned no URL:', result);
            return reject(
              new BadRequestException('Upload did not return a valid file URL.'),
            );
          }

          resolve(result.secure_url);
        },
      );

      uploadStream.end(file);
    });
  }

  async delete(publicId: string): Promise<void> {
    return cloudinary.uploader.destroy(publicId).catch((err) => {
      this.logger.error('Cloudinary delete error:', err);
      throw new BadRequestException('Failed to delete file.');
    });
  }

  async getSignedUrl(publicId: string): Promise<string> {
    try {
      return cloudinary.url(publicId, {
        sign_url: true,
        secure: true,
        type: 'private',
      });
    } catch (err) {
      this.logger.error('Cloudinary signed URL error:', err);
      throw new BadRequestException('Failed to generate signed URL.');
    }
  }
}