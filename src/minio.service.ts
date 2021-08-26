import { Client } from "minio";
import { Inject } from "@nestjs/common";

import type { ClientOptions } from "minio";

import { MINIO_OPTIONS } from "./constants";

export class MinioService<
    T extends ClientOptions = ClientOptions,
> extends Client {
    constructor(@Inject(MINIO_OPTIONS) protected readonly options: T) {
        super(options);
    }
}
