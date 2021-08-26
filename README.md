# Nest.js MinIO Module

A tiny package to make a bridge between [Nest.js](https://nestjs.com) DI system and [MinIO](https://docs.min.io/docs/javascript-client-api-reference.html) client instance.

![](https://img.shields.io/bundlephobia/minzip/nestjs-minio-module?style=social)

## Table of Contents

- [Nest.js MinIO Module](#nestjs-minio-module)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Extending MinioService](#extending-minioservice)
- [Comparison to other implementations](#comparison-to-other-implementations)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install `nestjs-minio-module` using npm or yarn:

```bash
npm i nestjs-minio-module minio --save
# or
yarn add nestjs-minio-module minio
```

> The package also requires it's peer dependencies to be installed. Likely you already have `@nestjs/common` installed - that is the reason why it is not specified in the snippet above.

## Usage

You may register `MinioModule` synchronously as follows.

```typescript
import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-module';

@Module({
imports: [
    MinioModule.register({
      endPoint: '127.0.0.1',
      port: 1337,
      useSSL: true,
      accessKey: 'minio_access_key',
      secretKey: 'minio_secret_key'
    })
})
export class AppModule {}
```

`MinioModule` may also be registered asynchronously with a factory or a value. Let's imagine we are using a `ConfigService` and want to get MinIO options from it. We may do it as follows:

```typescript
import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-module';
import { ConfigModule, ConfigService } from '<config_module>';

@Module({
imports: [
    MinioModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => configService.get('minio'),
    }),
})
export class AppModule {}
```

When registered, `MinioService` may be injected into Nest.js injectables as usual:

```typescript
import { Injectable } from "@nestjs/common";
import { MinioService } from "nestjs-minio-module";

@Injectable()
export class SomeService {
  constructor(private readonly minioService: MinioService) {}

  async listAllBuckets() {
    return this.minioService.listBuckets();
  }
}
```

`MinioService` instance exposes all JavaScript MinIO Client methods as it's own. You may find SDK specification [here](https://docs.min.io/docs/javascript-client-api-reference.html).

## Extending MinioService

You may create your own services extending from `MinioService`. It is a generic class so you may specify your own options type.

```typescript
import { Injectable } from "@nestjs/common";
import { MinioService } from "nestjs-minio-module";

import type { MinioModuleOptions } from "nestjs-minio-module";

type S3Options = {
  publicEndPoint?: string;
} & MinioModuleOptions;

@Injectable()
export class S3Service extends MinioService<S3Options> {
  public constructUrl(bucket: string, usePublicUrl: boolean): string {
    const protocol = this.options.useSSL ? "https:" : "http:";

    return usePublicUrl && this.options.publicEndPoint
      ? `${protocol}//${bucket}.${this.options.publicEndPoint}/`
      : `${protocol}//${this.options.endPoint}/${bucket}/`;
  }
}
```

In case if you need to create a custom constructor you should not forget to pass options to the superclass. You may inject options using `MINIO_CONFIG` symbol provided and exported from the module.

```typescript
import { Injectable, Inject } from "@nestjs/common";
import { MinioService, MINIO_CONFIG } from "nestjs-minio-module";

import type { MinioModuleOptions } from "nestjs-minio-module";

type S3Options = {
  publicEndPoint?: string;
} & MinioModuleOptions;

@Injectable()
export class S3Service extends MinioService<S3Options> {
  constructor(
    @Inject(MINIO_CONFIG) options: S3Options /*, additional dependencies */
  ) {
    super(options);
  }
}
```

## Comparison to other implementations

You may ask: how is this package different from a few other implementations of MinIO client in Nest.js?

Firstly, this package properly specifies it's peer dependencies. This means you don't get duplicate packages in your `node_modules` making the package smaller and as a bonus have support for a greater variety of versions.

Secondly, `nestjs-minio-module` properly exposes MinIO interface through a service, rather than a service field or a separate injectable.

Thirdly, this package allows you to create multiple instances of `MinioModule` in different scopes. You may have a module dedicated to accessing a MinIO instance in the same kubernetes container and another module accessing a remote S3 object storage.

And adjacent to the last point - this package is very easy to extend. It provides both generic types for its service and a symbol for accessing exported options provider.

## Contributing

Feel free to send any suggestions in [GitHub issues](https://github.com/yakovlev-alexey/nestjs-minio-module/issues) or open a Pull Request with your feature.

## License

[MIT](/LICENSE)
