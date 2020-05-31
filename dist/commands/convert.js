"use strict";
// Copyright(C) 2020 Tetsuki Syu
// See bot.ts for the full notice.
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const bot_1 = require("../bot");
const localizedStrings = require("../storage/localizedStrings.json");
const patterns_1 = require("../utility/patterns");
const command_1 = require("./base/command");
const lookupTables_1 = require("./lookupTables");
const LENGTHS = ['km', 'm', 'cm', 'in', 'ft', 'mi', 'au'];
const TEMPS = ['c', 'f', 'k'];
const VALID_UNITS = [...TEMPS, ...LENGTHS];
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class Convert extends command_1.default {
    constructor() {
        const cvtStrings = enStrings.texts.cvt;
        let usage = cvtStrings.usage.replace('{temps}', TEMPS.join(', '));
        usage = usage.replace('{heights}', LENGTHS.join(', '));
        super('cvt', 'util', cvtStrings.description, usage.trim(), ['convert']);
    }
    run(client, message, args) {
        const { channel } = message;
        const deleteOps = { timeout: 15 * 1000 };
        message.delete(deleteOps).catch(() => { });
        const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
        const cvtStrings = (config.lang === 'en') ? enStrings.texts.cvt : jpStrings.texts.cvt;
        const errorMsgs = cvtStrings.errors;
        const lengthTooShort = errorMsgs.length_too_short
            .replace('{temps}', TEMPS.join(', '))
            .replace('{heights}', LENGTHS.join(', '))
            .replace('{prefix}', bot_1.PREFIX);
        if (args.length < 2) {
            channel
                .send(lengthTooShort.trim())
                .then((m) => m.delete(deleteOps));
            return;
        }
        const targetUnit = args[0].toLowerCase();
        const invalidUnit = errorMsgs.invalid_unit
            .replace('{units}', VALID_UNITS.join(', '));
        if (!VALID_UNITS.includes(targetUnit)) {
            channel.send(invalidUnit)
                .then((m) => m.delete(deleteOps));
            return;
        }
        const input = args[1].toLowerCase();
        const wrongPattern = errorMsgs.wrong_pattern
            .replace('{input}', input);
        if (!patterns_1.CVT_PATTERN.test(input)) {
            channel.send(wrongPattern)
                .then((m) => m.delete(deleteOps));
            return;
        }
        channel.send(this.convert(targetUnit, input, message)).then((m) => m.delete(deleteOps));
    }
    convert(targetUnit, input, message) {
        const [, sourceValue, sourceUnit] = patterns_1.CVT_PATTERN.exec(input);
        const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
        const cvtStrings = (config.lang === 'en') ? enStrings.texts.cvt : jpStrings.texts.cvt;
        const errorMsgs = cvtStrings.errors;
        if (!this.areCompatible(targetUnit, sourceUnit)) {
            return errorMsgs.operation_not_possible;
        }
        const tables = [lookupTables_1.LOOKUP_LENGTH, lookupTables_1.LOOKUP_TEMPERATURE];
        let numberToConvert = Number.parseFloat(sourceValue);
        if (Number.isNaN(numberToConvert)) {
            return errorMsgs.is_nan;
        }
        for (const type of tables) {
            if (!type[targetUnit])
                continue;
            if (!type[targetUnit][sourceUnit])
                continue;
            let result;
            switch (targetUnit) {
                case 'c':
                    if (sourceUnit === 'f') {
                        numberToConvert -= 32;
                    }
                    else if (sourceUnit === 'k') {
                        numberToConvert -= 273.15;
                    }
                    result = type[targetUnit][sourceUnit] * numberToConvert;
                    break;
                case 'f':
                    result = type[targetUnit][sourceUnit] * numberToConvert;
                    if (sourceUnit === 'c') {
                        result += 32;
                    }
                    else if (sourceUnit === 'k') {
                        result -= 459.67;
                    }
                    break;
                case 'k':
                    if (sourceUnit === 'c') {
                        numberToConvert += 273.15;
                    }
                    else if (sourceUnit === 'f') {
                        numberToConvert += 459.67;
                    }
                    result = type[targetUnit][sourceUnit] * numberToConvert;
                    break;
                default:
                    result = type[targetUnit][sourceUnit] * numberToConvert;
                    break;
            }
            return util_1.format(cvtStrings.result, sourceValue + this.unitToDisplay(sourceUnit), Math.round(result * 100000) / 100000, this.unitToDisplay(targetUnit));
        }
        return errorMsgs.generic;
    }
    areCompatible(target, src) {
        return (TEMPS.includes(target) && TEMPS.includes(src))
            || (LENGTHS.includes(target) && LENGTHS.includes(src));
    }
    unitToDisplay(unit) {
        switch (unit) {
            case 'c':
                return '\u2103';
            case 'f':
                return '\u00B0\u0046';
            case 'k':
                return 'K';
            default:
                return unit;
        }
    }
}
exports.default = Convert;
//# sourceMappingURL=convert.js.map