import { DynamicModule, Module, Provider } from "@nestjs/common";

import { MINIO_CONFIG } from "./constants";
import { MinioService } from "./minio.service";

import type { MinioModuleOptions } from "./types";

@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {
  public static register(options: MinioModuleOptions): DynamicModule {
    return {
      module: MinioModule,
      providers: [MinioService, this.createOptionsProvider(options)],
      exports: [MinioService],
    };
  }

  private static createOptionsProvider(
    options: MinioModuleOptions
  ): Provider<MinioModuleOptions> {
    return {
      provide: MINIO_CONFIG,
      useValue: options,
    };
  }
}
