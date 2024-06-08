import {LogLevel} from "./LogLevel";

export const DEV_LEVELS = [LogLevel.Info, LogLevel.Warning, LogLevel.Error, LogLevel.Debug, LogLevel.TODO, LogLevel.Security, LogLevel.Cache, LogLevel.SessionStorage, LogLevel.DI, LogLevel.LLDI, LogLevel.GLDI, LogLevel.Metrics]
export const PROD_LEVELS = [LogLevel.Error, LogLevel.Warning, LogLevel.Info, LogLevel.DI]
export const ALL_LEVELS = [LogLevel.Info, LogLevel.Warning, LogLevel.Error, LogLevel.Debug, LogLevel.TODO, LogLevel.Security, LogLevel.Cache, LogLevel.SessionStorage, LogLevel.DI, LogLevel.LLDI, LogLevel.GLDI, LogLevel.Metrics]
