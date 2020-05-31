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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _riggedPairs;
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Discord = require("discord.js");
const fs = require("fs");
const localizedStrings = require("../storage/localizedStrings.json");
const messages = require("../storage/shipMessages.json");
const helper_1 = require("../utility/helper");
const command_1 = require("./base/command");
const bot_1 = require("../bot");
const filePath = './storage/riggedShips.json';
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class Ship extends command_1.default {
    constructor() {
        super('ship', 'fun', enStrings.texts.ship.description, enStrings.texts.ship.usage);
        _riggedPairs.set(this, void 0);
        if (fs.existsSync(filePath)) {
            const rawData = fs.readFileSync(filePath, 'utf8');
            __classPrivateFieldSet(this, _riggedPairs, JSON.parse(rawData));
        }
        else {
            __classPrivateFieldSet(this, _riggedPairs, new Array());
        }
    }
    run(client, message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel, guild } = message;
            const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
            const shipStrings = (config.lang === 'en') ? enStrings.texts.ship : jpStrings.texts.ship;
            if (args.length < 2) {
                channel.send(shipStrings.errors.length_too_short);
                return;
            }
            const [target1] = helper_1.findMembers(args[0], guild);
            if (!target1) {
                channel.send(shipStrings.errors.user_not_found.replace('{user}', args[0]));
                return;
            }
            const seconds = helper_1.findMembers(args[1], guild);
            const target2 = this.findNextUserIfSame(target1, seconds);
            if (!target2) {
                channel.send(shipStrings.errors.user_not_found.replace('{user}', args[1]));
                return;
            }
            let data;
            if (target1.id === target2.id) {
                data = { score: 100, scoreMessage: shipStrings.errors.self_match };
            }
            else {
                data = this.calcScore(target1, target2);
            }
            const { score, scoreMessage } = data;
            const img1 = this.getAvatarUrl(target1);
            const img2 = this.getAvatarUrl(target2);
            const { data: image } = yield axios_1.default
                .get(`https://api.alexflipnote.dev/ship?user=${img1}&user2=${img2}`, {
                responseType: 'arraybuffer',
            });
            const name1 = helper_1.escapeUsername(target1);
            const name2 = helper_1.escapeUsername(target2);
            const attachment = new Discord.MessageAttachment(Buffer.from(image), 'love.png');
            const embed = new Discord.MessageEmbed()
                .setTitle(shipStrings.infos.title.replace('{user1}', name1).replace('{user2}', name2))
                .addField(shipStrings.infos.score.replace('{score}', score.toString()), scoreMessage.replace('{name}', name1).replace('{name2}', name2), false)
                .setImage('attachment://love.png');
            channel.send(embed).then((msg) => {
                channel.send(attachment);
            });
        });
    }
    getAvatarUrl(entity) {
        return entity.user.displayAvatarURL({
            format: 'png',
            size: 128,
        });
    }
    findNextUserIfSame(firstUser, listOfSeconds) {
        if (!listOfSeconds.length)
            return null;
        if (listOfSeconds.length === 1)
            return listOfSeconds[0];
        for (const user of listOfSeconds) {
            if (user.id === firstUser.id)
                continue;
            return user;
        }
        return null;
    }
    shouldBeRigged(target1, target2) {
        const id1 = target1.id;
        const id2 = target2.id;
        return __classPrivateFieldGet(this, _riggedPairs).some((ids) => (ids[0] === id1 && ids[1] === id2)
            || (ids[0] === id2 && ids[1] === id1));
    }
    findMessage(score) {
        return messages.find((obj) => score <= obj.max_score).message;
    }
    calcScore(user1, user2) {
        let score;
        if (this.shouldBeRigged(user1, user2)) {
            score = 100;
        }
        else {
            score = ((parseInt(user1.id, 10) + parseInt(user2.id, 10)) / 7) % 100;
        }
        return { score, scoreMessage: this.findMessage(score) };
    }
}
exports.default = Ship;
_riggedPairs = new WeakMap();
//# sourceMappingURL=ship.js.map