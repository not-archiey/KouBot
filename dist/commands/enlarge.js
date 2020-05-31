"use strict";
// Copyright(C) 2020 Tetsuki Syu
// See bot.ts for the full notice.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("../bot");
const localizedStrings = require("../storage/localizedStrings.json");
const patterns_1 = require("../utility/patterns");
const command_1 = require("./base/command");
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class Enlarge extends command_1.default {
    constructor() {
        super('enlarge', 'util', enStrings.texts.enlarge.description, enStrings.texts.enlarge.usage);
    }
    run(client, message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
            const enlargeStrings = (config.lang === 'en') ? enStrings.texts.enlarge : jpStrings.texts.enlarge;
            if (!patterns_1.EMOTE_ID_REGEX.test(args[0])) {
                message.channel.send(enlargeStrings.errors.no_emote);
                return;
            }
            const [emoteId] = patterns_1.EMOTE_ID_REGEX.exec(args[0]);
            const emoteFormat = patterns_1.EMOTE_IS_ANIMATED_REGEX.test(args[0]) ? '.gif' : '.png';
            const emoteLink = `https://cdn.discordapp.com/emojis/${emoteId}${emoteFormat}`;
            message.channel.send(emoteLink);
        });
    }
}
exports.default = Enlarge;
//# sourceMappingURL=enlarge.js.map