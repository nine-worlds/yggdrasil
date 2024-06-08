import {DI} from "./DI";
import {Logger} from "../log";
import {Configuration} from "../config";

/**
 * Low level service collection directly extends the DI and registers the inner dependencies in the DI for the API
 */
export class LLServiceCollection extends DI {
    protected registerInnerDependencies(): LLServiceCollection {
        this.registerService<Logger>(DI.Logger)
        this.registerService<Configuration>(DI.Configuration)
        return this;
    }
}
