import {LogLevel} from "./LogLevel";

export interface LoggerSettings {
    /**
     * @description Include full date on every log that the Logger produces
     * @default undefined
     */
    fullDateOnLogs?: boolean

    /**
     * @description Disable show time for every log that the Logger produces
     * @default undefined
     * */
    disableTimeOnLog?: boolean

    /**
     * @description Select what log levels are enabled
     * @default ALL_LEVELS <- constant readonly from LoggerClass
     * */
    allowedLevels: Array<LogLevel>
}
