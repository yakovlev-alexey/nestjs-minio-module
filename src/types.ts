import type {
    ExistingProvider,
    FactoryProvider,
    ModuleMetadata,
    ValueProvider,
} from "@nestjs/common";
import type { ClientOptions } from "minio";

export type MinioModuleOptions = ClientOptions;

type Provider<T> = {
    provide: ValueProvider<T>["provide"];
    useValue?: ValueProvider<T>["useValue"];
    useFactory?: FactoryProvider<T>["useFactory"];
    inject?: FactoryProvider<T>["inject"];
    scope?: FactoryProvider<T>["scope"];
    useExisting?: ExistingProvider<T>["useExisting"];
};

export type MinioOptionsProvider = Provider<MinioModuleOptions>;

export type MinioModuleAsyncOptions = Omit<MinioOptionsProvider, "provide"> & {
    imports?: ModuleMetadata["imports"];
};
