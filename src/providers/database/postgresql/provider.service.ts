import { Injectable } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { PostgreSQLConfigService } from '@app/configs/database/postgresql';

// private loadEntitiesFromDir(directory: string): any[] {
//   const entityFiles: string[] = [];

//   const readDirRecursively = (dir: string) => {
//     const files = fs.readdirSync(dir);
//     for (const file of files) {
//       const fullPath = path.join(dir, file);
//       if (fs.statSync(fullPath).isDirectory()) {
//         readDirRecursively(fullPath);
//       } else if (file.endsWith('.entity.js') || file.endsWith('.entity.ts')) {
//         entityFiles.push(fullPath);
//       }
//     }
//   };

//   readDirRecursively(directory);

//   const entities = entityFiles
//     .map((file) => {
//       // eslint-disable-next-line @typescript-eslint/no-var-requires
//       const module = require(file);
//       return Object.values(module);
//     })
//     .flat();

//   return entities;
// }

@Injectable()
export class PostgreSQLProviderService implements TypeOrmOptionsFactory {
  constructor(private postgreSQLConfigService: PostgreSQLConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions & DataSourceOptions {
    return {
      type: 'postgres',
      host: this.postgreSQLConfigService.host,
      port: this.postgreSQLConfigService.port,
      username: this.postgreSQLConfigService.user,
      password: this.postgreSQLConfigService.password,
      database: this.postgreSQLConfigService.database,
      autoLoadEntities: true,
      // synchronize: true,
      synchronize: false,
      logging: this.postgreSQLConfigService.logging,
      migrations: [`${__dirname}/./migrations/*{.ts,.js}`],
      migrationsRun: true,
      entities: [`${__dirname}/../../../modules/**/*.entity{.ts,.js}`],
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
