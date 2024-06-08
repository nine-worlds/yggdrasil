import {IConfiguration} from "./index";

export class Configuration implements IConfiguration {
    private config: any | undefined;

    static getConfiguration(config: {}): Configuration {
        const configuration = new Configuration();
        configuration.setupConfigurationFile(config);
        return configuration;
    }

    private setupConfigurationFile(config: {}): Configuration {
        if (this.config) {
            this.config = {...this.config, ...config}
        } else {
            this.config = config;
        }

        return this;
    }

    private checkConfig() {
        if (this.config)
            return;
        else
            throw Error("Configuration was not set correctly or not defined!")
    }

    addConfiguration(config: {}): Configuration {
        return this.setupConfigurationFile(config)
    }

    getGeneric<T>(path: string): T {
        return this.get(path) as unknown as T;
    }

    get(path: string): any {
        this.checkConfig()
        const derivePath = path.split(/[:.]/);
        let object: any = this.config;
        for (let string of derivePath) {
            object = object[string]
        }
        return object;
    }
}
