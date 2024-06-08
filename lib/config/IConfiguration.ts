export interface IConfiguration {
    get(path: string): any

    getGeneric<T>(path: string): T

    addConfiguration(config: object): IConfiguration
}
