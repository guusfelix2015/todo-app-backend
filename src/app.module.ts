import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './app/todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('BD_HOST', 'localhost'),
        port: Number(configService.get('BD_PORT', 3306)),
        username: configService.get('BD_USERNAME', 'root'),
        password: configService.get('BD_PASSWORD', '123'),
        database: configService.get('BD_DATABASE', 'todo'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    TodoModule,
  ],
})
export class AppModule {}
