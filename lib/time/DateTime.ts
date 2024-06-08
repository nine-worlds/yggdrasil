import {DateTimeUnits} from "./DateTimeUnits";
import {HashCode} from "../collections";

export class DateTime {
    private date: Date;

    constructor(dateInput?: string | DateTime | Date) {
        if (typeof dateInput === 'string') {
            this.date = new Date(dateInput);
        } else if (dateInput instanceof DateTime) {
            this.date = new Date(dateInput.date);
        } else if (dateInput instanceof Date) {
            this.date = new Date(dateInput.getTime());
        } else {
            this.date = new Date();
        }
    }

    static now(): DateTime {
        return new DateTime();
    }

    static today(): DateTime {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set time to midnight
        return new DateTime(currentDate);
    }

    private add(value: number, unit: DateTimeUnits): DateTime {
        switch (unit) {
            case 'days':
                this.date.setDate(this.date.getDate() + value);
                break;
            case 'hours':
                this.date.setHours(this.date.getHours() + value);
                break;
            case 'minutes':
                this.date.setMinutes(this.date.getMinutes() + value);
                break;
            case 'seconds':
                this.date.setSeconds(this.date.getSeconds() + value);
                break;
            case 'milliseconds':
                this.date.setMilliseconds(this.date.getMilliseconds() + value);
                break;
            case 'months':
                this.date.setMonth(this.date.getMonth() + value);
                break;
            case 'years':
                this.date.setFullYear(this.date.getFullYear() + value);
                break;
        }
        return this;
    }

    addDays(days: number): DateTime {
        return this.add(days, 'days');
    }

    addHours(hours: number): DateTime {
        return this.add(hours, 'hours');
    }

    addMilliseconds(milliseconds: number): DateTime {
        return this.add(milliseconds, 'milliseconds');
    }

    addMinutes(minutes: number): DateTime {
        return this.add(minutes, 'minutes');
    }

    addMonths(months: number): DateTime {
        return this.add(months, 'months');
    }

    addSeconds(seconds: number): DateTime {
        return this.add(seconds, 'seconds');
    }

    addTicks(ticks: number): DateTime {
        // In JavaScript, 1 tick is equivalent to 1 millisecond
        return this.add(ticks / 10000, 'milliseconds');
    }

    addYears(years: number): DateTime {
        return this.add(years, 'years');
    }

    compareTo(other: DateTime): number {
        return DateTime.compare(this, other);
    }

    equals(other: DateTime): boolean {
        return this.date.getTime() === other.date.getTime();
    }

    getHashCode(): number {
        return HashCode(this);
    }

    isDaylightSavingTime(): boolean {
        return this.date.getTimezoneOffset() < new Date(this.date.getFullYear(), 0, 1).getTimezoneOffset();
    }


    subtract(value: DateTime): number {
        return this.date.getTime() - value.date.getTime();
    }

    toBinary(): number {
        return this.date.getTime();
    }

    toLongDateString(): string {
        return this.date.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
    }

    toLongTimeString(): string {
        return this.date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    toOADate(): number {
        const epoch = new Date(1899, 11, 30);
        return (this.date.getTime() - epoch.getTime()) / 86400000;
    }

    toShortDateString(): string {
        return this.date.toLocaleDateString('en-US');
    }

    toShortTimeString(): string {
        return this.date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
    }

    toString(format: string = 'yyyy-MM-dd HH:mm:ss'): string {
        const pad = (n: number, length: number = 2) => n.toString().padStart(length, '0');
        const padMilliseconds = (n: number, length: number) => n.toString().padStart(3, '0').substring(0, length);

        // Custom format implementation
        const formatMap: { [key: string]: () => string } = {
            'yyyy': () => this.date.getFullYear().toString(),
            'yy': () => this.date.getFullYear().toString().substr(2, 2),
            'MM': () => pad(this.date.getMonth() + 1),
            'M': () => (this.date.getMonth() + 1).toString(),
            'dd': () => pad(this.date.getDate()),
            'd': () => this.date.getDate().toString(),
            'HH': () => pad(this.date.getHours()),
            'H': () => this.date.getHours().toString(),
            'mm': () => pad(this.date.getMinutes()),
            'm': () => this.date.getMinutes().toString(),
            'ss': () => pad(this.date.getSeconds()),
            's': () => this.date.getSeconds().toString(),
            'fffffff': () => padMilliseconds(this.date.getMilliseconds(), 7),
            'FFFFFFF': () => padMilliseconds(this.date.getMilliseconds(), 7).trimEnd(),
            'tt': () => this.date.getHours() >= 12 ? 'PM' : 'AM',
            't': () => this.date.getHours() >= 12 ? 'P' : 'A',
            'K': () => {
                const offset = -this.date.getTimezoneOffset();
                const sign = offset >= 0 ? '+' : '-';
                const absOffset = Math.abs(offset);
                const hours = Math.floor(absOffset / 60);
                const minutes = absOffset % 60;
                return `${sign}${pad(hours)}:${pad(minutes)}`;
            }
        };

        let formattedDate = format;
        Object.keys(formatMap).forEach(key => {
            formattedDate = formattedDate.replace(new RegExp(key, 'g'), formatMap[key]());
        });

        return formattedDate;
    }

    toUniversalTime(): DateTime {
        const utcDate = new Date(this.date.getTime() + this.date.getTimezoneOffset() * 60000);
        return new DateTime(utcDate.toISOString());
    }

    static compare(a: DateTime, b: DateTime): number {
        return a.date.getTime() - b.date.getTime();
    }

    static daysInMonth(year: number, month: number): number {
        return new Date(year, month, 0).getDate();
    }

    static fromBinary(binary: number): DateTime {
        return new DateTime(new Date(binary).toISOString());
    }

    static fromFileTime(fileTime: number): DateTime {
        // File time is measured in 100-nanosecond units since January 1, 1601 (UTC)
        const msSince1601 = fileTime / 10000;
        const msSince1970 = msSince1601 - 11644473600000;
        return new DateTime(new Date(msSince1970).toISOString());
    }

    static fromFileTimeUtc(fileTime: number): DateTime {
        // Similar to fromFileTime, but returns UTC
        const msSince1601 = fileTime / 10000;
        const msSince1970 = msSince1601 - 11644473600000;
        return new DateTime(new Date(msSince1970).toISOString());
    }

    static fromOADate(d: number): DateTime {
        // OLE Automation Date is a floating point value with the decimal part representing the time
        const epoch = new Date(1899, 11, 30);
        return new DateTime(new Date(epoch.getTime() + d * 86400000).toISOString());
    }

    static isLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    static parse(s: string): DateTime {
        return new DateTime(new Date(s).toISOString());
    }

    static specifyKind(date: DateTime, kind: 'Local' | 'Utc'): DateTime {
        if (kind === 'Utc')
            return new DateTime(date.date.toUTCString());

        return new DateTime(date.date.toString());
    }

    static tryParse(s: string, result?: DateTime): boolean {
        try {
            const parsedDate = new Date(s);
            if (isNaN(parsedDate.getTime())) {
                return false;
            }
            if (result) {
                result.date = parsedDate;
            }
            return true;
        } catch (e) {
            return false;
        }
    }
}
