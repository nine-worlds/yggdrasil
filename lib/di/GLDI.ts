import {Injectable} from "./index";
import {ValuePair} from "../index";
import {LLDI} from "./LLDI";

/**
 * GLDI - Great Level DI
 * All the top services should come here (all sub di's of the application and also this DI will be accessible for the user)
 */
export class GLDI extends LLDI {
    private static injected: Array<ValuePair<string, Injectable | object>> = [];

    private static findByServiceName(name: string) {
        return (pair: ValuePair<string, Injectable | object>) => pair.key === name;
    }

    protected register<T extends Injectable | object>(value: T) {
        const nameOfService = GLDI.nameOf(value);
        const isInjectedAlready = GLDI.injected.some(GLDI.findByServiceName(nameOfService))
        if (!isInjectedAlready) {
            GLDI.injected.push({
                key: nameOfService,
                value: value
            })
            GLDI.Logger.GLDI(`injected service ${nameOfService}`)
        } else {
            GLDI.Logger.GLDI(`tried to inject already injected service ${nameOfService}`)
        }
    }

    protected static get<T extends Injectable | object>(serviceIdentifier: string): T | null {
        const isInjectedAlready = this.injected.some(GLDI.findByServiceName(serviceIdentifier));
        if (!isInjectedAlready) {
            GLDI.Logger.GLDI(`You cannot get a not implemented service - you tried to get ${serviceIdentifier} but there is no service registered under this name`)
            return null;
        } else {
            const injectable = GLDI.injected.find(GLDI.findByServiceName(serviceIdentifier))!.value as T;
            GLDI.Logger.GLDI(`Returned ${serviceIdentifier}'s service from the injected services ${GLDI.getInjectedServicesString()}`)
            return injectable
        }
    }

    private static getInjectedServicesString(): string {
        return GLDI.injected.map(a => a.key).join(" * ")
    }
}

GLDI.Logger.GLDI("Setup was successfully");
