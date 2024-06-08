import {Configuration} from "../config";
import {Logger} from "../log";
import {Injectable} from "./Injectable";

/**
 * LLDI - Low Level DI
 * All the services that is part of the api should be initialized from here
 * if the user want he can create her own di implementation by extending the GLDI (Great Level DI)
 */
export class LLDI {
    public static Configuration: Configuration = Configuration.getConfiguration({});
    public static Logger: Logger = new Logger(this.Configuration.get("logger"));

    protected nameOf<T extends object>(value: T): string {
        return value.constructor.name;
    }

    protected static nameOf<T extends Injectable | object>(value: T): string {
        const baseName = value.constructor.name;
        return value.hasOwnProperty("name") ? (value as Injectable).name ?? baseName : baseName;
    }
}

LLDI.Logger.LLDI("Setup was successfully");

/*export class TestInjection extends Injectable {
    static sample: string = "Sample";
}

export class TestInjection2 extends Injectable {
    static sample: string = "Sample2";
}

export class TestInjection3 extends Injectable {
    static sample: string = "Sample3";
}*/

// DI.registerService<EventRegistry>(EventRegistry.getEventRegistry(Events))
// DI.registerService<EventHandler>(EventHandler.getEventHandler())
//
// setTimeout(() => {
//     console.log(DI.getService<TestInjection>("es"))
//     console.log(DI.getService<EventRegistry>("EventRegistry"))
//     console.log(DI.getService<EventHandler>("EventHandler"))
// }, 3000)

