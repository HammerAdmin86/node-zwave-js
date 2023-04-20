import type { ZWaveLogInfo } from "@zwave-js/core";
import type { ExecutionContext } from "ava";
import sinon from "sinon";
import Transport from "winston-transport";
/** Log to a Sinon spy in order to perform assertions during unit tests */
export declare class SpyTransport extends Transport {
    constructor();
    private _spy;
    get spy(): sinon.SinonSpy;
    log(info: any, next: () => void): any;
}
/** Tests a printed log message */
export declare function assertMessage(t: ExecutionContext, transport: SpyTransport, options: Partial<{
    message: string;
    predicate: (msg: string) => boolean;
    /** Default: true */
    ignoreColor: boolean;
    /** Default: true */
    ignoreTimestamp: boolean;
    /** Default: true */
    ignoreChannel: boolean;
    callNumber: number;
}>): void;
export declare function assertLogInfo(t: ExecutionContext, transport: SpyTransport, options: Partial<{
    level: string;
    predicate: (info: ZWaveLogInfo) => boolean;
    callNumber: number;
}>): void;
//# sourceMappingURL=SpyTransport.d.ts.map