import {GLDI} from "./GLDI";
import {Injectable} from "./index";
import {nameOf} from "./NameOf";

export class DI extends GLDI {
    protected registerService<T extends Injectable | object>(value: T) {
        const start = performance.now();
        super.register(value);
        const end = performance.now();
        DI.Logger.DI(`registered service [${this.nameOf(value)}] to [${GLDI.name}] - in (${end - start})`)
    }

    /**
     * Returns the service that is found under the serviceIdentifier
     * @param serviceIdentifier - the requested service that should be registered before requesting
     */
    static getService<T extends Injectable | object>(serviceIdentifier: string): T {
        const start = performance.now();
        const service = GLDI.get<T>(serviceIdentifier);
        const end = performance.now();
        DI.Logger.DI(`returned service [${service ? this.nameOf(service) : "no.service.presented"}](${serviceIdentifier}) in [${GLDI.name}] - in (${end - start})`)
        return service as T;
    }

    /**
     * Returns the service that is found under the serviceIdentifier
     * @param serviceIdentifier - the requested service that should be registered before requesting
     */
    static getServiceByFunction<T extends Injectable | object>(serviceIdentifier: Function): T {
        const start = performance.now();
        const service = GLDI.get<T>(nameOf(serviceIdentifier));
        const end = performance.now();
        DI.Logger.DI(`returned service [${service ? this.nameOf(service) : "No-service-presented"}] in [${GLDI.name}] - in (${end - start})`)
        return service as T;
    }
}

export const service = <T extends Injectable | object>(serviceIdentifier: Function): T => DI.getServiceByFunction<T>(serviceIdentifier);
