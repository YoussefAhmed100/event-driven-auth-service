import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';

import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';

import { StorageModule } from './common/storage/storage.module';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.getOrThrow<number>('rateLimit.ttl'),
            limit: config.getOrThrow<number>('rateLimit.limit'),
          },
        ],
      }),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('database.uri'),
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      }),
    }),

    CacheModule.register({
      ttl: 60,
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),

    AuthModule,
    UserModule,
    StorageModule,
 
    NotificationModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
