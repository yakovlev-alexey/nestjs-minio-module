import { Client } from "minio";
import { Inject } from "@nestjs/common";

import type { ClientOptions } from "minio";

import { MINIO_CONFIG } from "./constants";

export class MinioService<T extends ClientOptions> extends Client {
  constructor(@Inject(MINIO_CONFIG) protected readonly options: T) {
    super(options);
  }
}
