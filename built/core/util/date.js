"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.timespan = exports.highResTimestamp = exports.getDSTInfo = exports.getDefaultDSTInfo = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
/**
 * Returns a fallback DSTInfo in case we cannot determine the correct one.
 * This fallback has no additional DST shift.
 * The dummy DST starts on March 31st and ends on October 31st, both times at 01:00 UTC.
 * @param defaultOffset - The offset to use for both standardOffset and dstOffset
 */
function getDefaultDSTInfo(defaultOffset) {
    const thisYear = new Date().getUTCFullYear();
    if (defaultOffset == undefined)
        defaultOffset = -new Date().getTimezoneOffset();
    return {
        startDate: new Date(Date.UTC(thisYear, 2, 31, 1)),
        endDate: new Date(Date.UTC(thisYear, 9, 31, 1)),
        standardOffset: defaultOffset,
        dstOffset: defaultOffset,
    };
}
exports.getDefaultDSTInfo = getDefaultDSTInfo;
/**
 * Finds the first date on which the given timezone offset is in effect.
 * date1 must be the smaller one of the two dates
 */
function findSwitchDate(date1, date2, offset) {
    const stepSize = 60000; // 1 minute
    function middleDate(date1, date2) {
        const middleTime = Math.floor((date1.getTime() + date2.getTime()) / 2 / stepSize) *
            stepSize;
        return new Date(middleTime);
    }
    while (date1 < date2) {
        const mid = middleDate(date1, date2);
        if (mid.getTimezoneOffset() === offset) {
            date2 = mid;
        }
        else {
            date1 = new Date(mid.getTime() + stepSize);
        }
    }
    if (date1.getTimezoneOffset() !== offset)
        return undefined;
    return date1;
}
/** Returns the current system's daylight savings time information if possible */
function getDSTInfo(now = new Date()) {
    const halfAYearAgo = (0, dayjs_1.default)(now).subtract(6, "months").toDate();
    const inAHalfYear = (0, dayjs_1.default)(now).add(6, "months").toDate();
    if (now.getTimezoneOffset() === halfAYearAgo.getTimezoneOffset() ||
        now.getTimezoneOffset() === inAHalfYear.getTimezoneOffset()) {
        // There is no DST in this timezone
        return getDefaultDSTInfo();
    }
    // Javascript has the offsets inverted, we use the normal interpretation
    const offsets = [
        -now.getTimezoneOffset(),
        -inAHalfYear.getTimezoneOffset(),
    ];
    const dates = [
        findSwitchDate(halfAYearAgo, now, -offsets[0]),
        findSwitchDate(now, inAHalfYear, -offsets[1]),
    ];
    if (dates[0] == undefined || dates[1] == undefined) {
        // This shouldn't happen, but better be sure
        return getDefaultDSTInfo();
    }
    if (offsets[0] > offsets[1]) {
        // DST is always the higher offset
        return {
            startDate: dates[0],
            endDate: dates[1],
            dstOffset: offsets[0],
            standardOffset: offsets[1],
        };
    }
    else {
        return {
            // We don't have DST now, this is the next start date
            startDate: dates[1],
            endDate: dates[0],
            dstOffset: offsets[1],
            standardOffset: offsets[0],
        };
    }
}
exports.getDSTInfo = getDSTInfo;
/** Returns a timestamp with nano-second precision */
function highResTimestamp() {
    const [s, ns] = process.hrtime();
    return s * 1e9 + ns;
}
exports.highResTimestamp = highResTimestamp;
exports.timespan = Object.freeze({
    seconds: (num) => Math.round(num * 1000),
    minutes: (num) => exports.timespan.seconds(num * 60),
    hours: (num) => exports.timespan.minutes(num * 60),
    days: (num) => exports.timespan.hours(num * 24),
});
function formatDate(date, format) {
    return (0, dayjs_1.default)(date).format(format);
}
exports.formatDate = formatDate;
//# sourceMappingURL=date.js.map