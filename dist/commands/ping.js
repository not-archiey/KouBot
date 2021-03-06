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
const command_1 = require("./base/command");
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class Ping extends command_1.default {
    constructor() {
        super('ping', 'info', enStrings.texts.ping.description, enStrings.texts.ping.usage);
    }
    run(client, message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
            const pingStrings = (config.lang === 'en') ? enStrings.texts.ping : jpStrings.texts.ping;
            const now = Date.now();
            const msg = yield message.channel.send(pingStrings.infos.pinging);
            const pingMsg = pingStrings.infos.responding
                .replace('{latency}', (Date.now() - now).toString())
                .replace('{apiLatency}', Math.round(client.ws.ping).toString());
            msg.edit(pingMsg);
        });
    }
}
exports.default = Ping;
//# sourceMappingURL=ping.js.map