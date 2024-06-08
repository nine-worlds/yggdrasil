import {LogLevel} from "./LogLevel";
import {ALL_LEVELS, DEV_LEVELS} from "./LogLevelPresets";
import {LoggerSettings} from "./LoggerSettings";

/**
 * @class Logger
 * Logger
 *
 * Provides you simple methods to log your activity, keep it organized and and hide from end user where the log come from
 *      - Error <- log error style message
 *      - Info <- log info style message
 *      - Warning <- log warning style message
 *      - Debug <- log debug style message
 *      - TODO <- log todo style message
 *      - Log <- create your custom log
 *
 * @example
 *      let logger = new Logger()
 *      logger.Warning("MESSAGE")
 *
 */
export class Logger {

    private readonly FullDateOnLog: boolean | undefined = false;
    private readonly DisableTimeOnLog: boolean | undefined = false;
    private readonly AllowedLevels: Array<LogLevel> | undefined = ALL_LEVELS;

    constructor(loggerSettings: LoggerSettings = {allowedLevels: DEV_LEVELS}) {
        this.AllowedLevels = loggerSettings.allowedLevels
        this.FullDateOnLog = loggerSettings.fullDateOnLogs
        this.DisableTimeOnLog = loggerSettings.disableTimeOnLog;
    }

    Group() {
        return console.group()
    }

    GroupEnd() {
        return console.groupEnd()
    }

    Error(message: any) {
        return this.Log(message, LogLevel.Error)
    }

    Warning(message: any) {
        return this.Log(message, LogLevel.Warning)
    }

    Info(message: any) {
        return this.Log(message, LogLevel.Info)
    }

    Debug(message: any) {
        return this.Log(message, LogLevel.Debug)
    }

    TODO(message: any) {
        return this.Log(message, LogLevel.TODO)
    }

    Security(message: any) {
        return this.Log(message, LogLevel.Security)
    }

    Cache(message: any) {
        return this.Log(message, LogLevel.Cache)
    }

    Metrics(message: any) {
        return this.Log(message, LogLevel.Metrics)
    }

    SessionStorage(message: any) {
        return this.Log(message, LogLevel.SessionStorage)
    }

    DI(message: any) {
        return this.Log(message, LogLevel.DI)
    }

    LLDI(message: any) {
        return this.Log(message, LogLevel.LLDI)
    }

    GLDI(message: any) {
        return this.Log(message, LogLevel.GLDI)
    }

    Log(message: any, level: LogLevel) {
        if (this.AllowedLevels!.includes(level))
            switch (level) {
                case LogLevel.Info:
                    return console.info.apply(console, this.GetInfoMessageWithColor(message))
                case LogLevel.Warning:
                    return console.warn.apply(console, this.GetWarningMessageWithColor(message))
                case LogLevel.Error:
                    return console.error.apply(console, this.GetErrorMessageWithColor(message))
                case LogLevel.Debug:
                    return console.debug.apply(console, this.GetDebugMessageWithColor(message))
                case LogLevel.TODO:
                    return console.warn.apply(console, this.GetTODOMessageWithColor(message))
                case LogLevel.Security:
                    return console.log.apply(console, this.GetSecurityMessageWithColor(message))
                case LogLevel.Cache:
                    return console.log.apply(console, this.GetCacheMessageWithColor(message))
                case LogLevel.SessionStorage:
                    return console.log.apply(console, this.GetSessionStorageMessageWithColor(message))
                case LogLevel.DI:
                    return console.info.apply(console, this.GetDIMessageWithColor(message))
                case LogLevel.LLDI:
                    return console.info.apply(console, this.GetLLDIMessageWithColor(message))
                case LogLevel.GLDI:
                    return console.info.apply(console, this.GetGLDIMessageWithColor(message))
                case LogLevel.Metrics:
                    return console.info.apply(console, this.GetMetricsMessageWithColor(message))
            }
    }

    private GetErrorMessageWithColor(message: any): Array<string> {
        return [this.GetTitle("ERROR"), Logger.GetColors({
            background: "#ab0000",
            color: "#000000"
        }), message]
    }

    private GetWarningMessageWithColor(message: any): Array<string> {
        return [this.GetTitle("WARNING"),
            Logger.GetColors({
                background: "#ea7929",
                color: "#000000"
            }), message]
    }

    private GetInfoMessageWithColor(message: any): Array<string> {
        return [this.GetTitle("INFO"), Logger.GetColors({
            background: "#98d6ff",
            color: "#000000"
        }), message]
    }

    private GetDebugMessageWithColor(message: any): Array<string> {
        return [this.GetTitle("DEBUG"), Logger.GetColors({
            background: "#a227c3",
            color: "#000000"
        }), message]
    }

    private GetTODOMessageWithColor(message: any): Array<string> {
        return [this.GetTitle("TODO"), Logger.GetColors({
            background: "#ffd000",
            color: "#000000",
        }), message]
    }

    private GetSecurityMessageWithColor(message: any) {
        return [this.GetTitle("SECURITY"), Logger.GetColors({
            background: "#ff9800",
            color: "#ffffff",
        }), message]
    }

    private GetCacheMessageWithColor(message: any) {
        return [this.GetTitle("CACHE"), Logger.GetColors({
            background: "#007257",
            color: "#ffffff",
        }), message]
    }

    private GetSessionStorageMessageWithColor(message: any) {
        return [this.GetTitle("SESSION-STORAGE"), Logger.GetColors({
            background: "#ffffff",
            color: "#3f3f3f",
        }), message]
    }

    private GetDIMessageWithColor(message: any) {
        return [this.GetTitle("DI"), Logger.GetColors({
            background: "#000000",
            color: "#00d734",
        }), message]
    }

    private GetLLDIMessageWithColor(message: any) {
        return [this.GetTitle("LLDI"), Logger.GetColors({
            background: "#000000",
            color: "#ff0038",
        }), message]
    }

    private GetGLDIMessageWithColor(message: any) {
        return [this.GetTitle("GLDI"), Logger.GetColors({
            background: "#000000",
            color: "#c25dff",
        }), message]
    }

    private GetMetricsMessageWithColor(message: any) {
        return [this.GetTitle("Metrics"), Logger.GetColors({
            background: "#abff1b",
            color: "#000000",
        }), message]
    }

    private GetTitle(title: string): string {
        let base = `%c[${title}]`;
        let time = `[${Logger.GetTime(this.FullDateOnLog)}]`
        return this.DisableTimeOnLog ? base : `${time} ${base}`
    }

    private static GetColors(scheme: { background: string, color: string }): string {
        return `background:${scheme.background}; color:${scheme.color}`
    }

    private static GetTime(fullDateOnLogs?: boolean): string {
        let Clock = new Date();
        return fullDateOnLogs ? Clock.toString() : Clock.toLocaleTimeString()
    }
}
