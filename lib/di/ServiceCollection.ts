import {Injectable} from "./Injectable";
import {LLServiceCollection} from "./LLServiceCollection";
import {Configuration} from "../config";

/**
 * Service collection give to the api user and through this the user can register dependencies
 */
export class ServiceCollection extends LLServiceCollection {
    configuration: Configuration = LLServiceCollection.Configuration;

    constructor() {
        super();
        super.registerInnerDependencies();
    }

    registerSingletonService<T extends Injectable>(value: T): ServiceCollection {
        super.registerService<T>(value)
        return this;
    }
}

/**
 * The end user will only have access to the public service collection other operation should be made in the startup folder's index.ts
 * @export init - function used to initialize the service collection (this is not needed anyhow because whenever a dependency starts to use it will be done automatically but after all, it's not a bad thing to have)
 */
export interface PublicServiceCollection {
    init(): void;
}
