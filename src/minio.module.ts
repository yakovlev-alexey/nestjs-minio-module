import { DynamicModule, Module, Provider } from "@nestjs/common";

import { MINIO_CONFIG } from "./constants";
import { MinioService } from "./minio.service";

import type { MinioModuleAsyncOptions, MinioModuleOptions } from "./types";

@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {
  public static register(options: MinioModuleOptions): DynamicModule {
    const optionsProvider = this.createOptionsProvider(options);
    return {
      module: MinioModule,
      providers: [MinioService, optionsProvider],
      exports: [MinioService, optionsProvider],
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

  public static registerAsync(options: MinioModuleAsyncOptions): DynamicModule {
    const optionsProvider = this.createAsyncOptionsProvider(options);
    return {
      module: MinioModule,
      imports: options.imports || [],
      providers: [MinioService, optionsProvider],
      exports: [MinioService, optionsProvider],
    };
  }

  private static createAsyncOptionsProvider(
    options: MinioModuleAsyncOptions
  ): Provider<MinioModuleOptions> {
    if (!options.useFactory && !options.useExisting && !options.useValue) {
      throw new Error("MinioModule registerAsync options require a provider");
    }

    return {
      provide: MINIO_CONFIG,
      ...options,
    } as Provider<MinioModuleOptions>;
  }
}
