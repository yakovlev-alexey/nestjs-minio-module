import type { ModuleMetadata, Provider } from "@nestjs/common";
import type { ClientOptions } from "minio";

export type MinioModuleOptions = ClientOptions;

export type MinioModuleAsyncOptions = Omit<
  Provider<ClientOptions>,
  "provide"
> & { imports: ModuleMetadata["imports"] };
