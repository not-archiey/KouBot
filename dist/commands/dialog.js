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
const axios_1 = require("axios");
const Discord = require("discord.js");
const bot_1 = require("../bot");
const localizedStrings = require("../storage/localizedStrings.json");
const patterns_1 = require("../utility/patterns");
const command_1 = require("./base/command");
const backgrounds = [
    'bath', 'beach', 'cabin', 'camp',
    'cave', 'forest', 'messhall',
];
const characters = [
    'aiden', 'avan', 'chiaki', 'connor', 'eduard', 'felix', 'goro', 'hiro',
    'hunter', 'jirou', 'keitaro', 'kieran', 'knox', 'lee', 'naoto', 'natsumi',
    'seto', 'taiga', 'yoichi', 'yoshi', 'yuri', 'yuuto',
];
const backgroundString = backgrounds.join('`, `');
const charactersString = characters.join('`, `');
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class Dialog extends command_1.default {
    constructor() {
        const usage = enStrings.texts.dialog.usage
            .replace('{backgrounds}', backgroundString)
            .replace('{characters}', charactersString);
        super('dialog', 'fun', enStrings.texts.dialog.description, usage);
    }
    run(client, message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel } = message;
            const now = Date.now();
            const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
            const dialogStrings = (config.lang === 'en') ? enStrings.texts.dialog : jpStrings.texts.dialog;
            const errorMsg = dialogStrings.errors;
            if (args.length < 2) {
                channel.send(errorMsg.length_too_short);
                return;
            }
            let character = args.shift().toLowerCase();
            let background;
            if (characters.includes(character)) {
                background = 'camp';
            }
            else {
                background = character;
                character = args.shift().toLowerCase();
            }
            if (!backgrounds.includes(background)) {
                const backgroundNotFound = errorMsg.background_not_found
                    .replace('{background}', background)
                    .replace('{backgrounds}', backgroundString);
                channel.send(backgroundNotFound);
                return;
            }
            if (!characters.includes(character)) {
                const characterNotFound = errorMsg.character_not_found
                    .replace('{character}', character)
                    .replace('{characters}', charactersString);
                channel.send(characterNotFound);
                return;
            }
            if (args.length <= 0) {
                channel.send(errorMsg.no_message);
                return;
            }
            // Gets the message by getting the rest of the args
            const text = args.join(' ');
            // Check if message is more than 120 chars
            if (text.length > 120) {
                channel.send(errorMsg.message_too_long);
                return;
            }
            // Tests if message includes emoji or emotes
            if (patterns_1.EMOJI_REGEX.test(text)
                || patterns_1.EMOTE_MENTIONS_REGEX.test(text)
                || patterns_1.NONASCII_REGEX.test(text)) {
                channel.send(errorMsg.wrong_character_set);
                return;
            }
            try {
                const response = yield axios_1.default.post('https://yuuto.dunctebot.com/dialog', { background, character, text }, {
                    responseType: 'arraybuffer',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                const attachment = new Discord.MessageAttachment(Buffer.from(response.data), 'result.png');
                console.debug(`Generated image for ${character} at ${background}, took ${Date.now() - now}ms`);
                message.reply(dialogStrings.result, attachment);
            }
            catch (e) {
                if (e.response.status === 429) {
                    channel.send(errorMsg.cooldown);
                    return;
                }
                const genericError = errorMsg.generic
                    .replace('{json}', JSON.parse(e.response.data).message);
                channel.send(genericError);
            }
        });
    }
}
exports.default = Dialog;
//# sourceMappingURL=dialog.js.map