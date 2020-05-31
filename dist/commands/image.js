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
const helper_1 = require("../utility/helper");
const command_1 = require("./base/command");
const UNSPLASH_ITEM_PER_PAGE = 10;
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class Image extends command_1.default {
    constructor() {
        super('image', 'util', enStrings.texts.image.description, enStrings.texts.image.usage, ['img']);
    }
    run(client, message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel } = message;
            const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
            const imageStrings = (config.lang === 'en') ? enStrings.texts.image : jpStrings.texts.image;
            let keyword = '';
            if (args.length > 1) {
                channel.send(imageStrings.errors.length_too_long);
                return;
            }
            if (args.length <= 0) {
                channel.send(imageStrings.errors.length_too_short);
                keyword = 'hamburger';
            }
            else {
                keyword = args.shift().toLowerCase();
            }
            const attachment = yield Image.getImage(keyword, message);
            if (attachment) {
                if (attachment instanceof Discord.MessageAttachment) {
                    const resultMsg = imageStrings.result.replace('{keyword}', keyword);
                    message.reply(resultMsg, attachment);
                }
                else {
                    message.reply(attachment);
                }
            }
        });
    }
    static getImage(keyword, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
            const imageStrings = (config.lang === 'en') ? enStrings.texts.image : jpStrings.texts.image;
            const token = process.env.UNSPLASH_TOKEN;
            let attachment;
            if (token) {
                let link;
                let total = 0;
                let totalPages = 0;
                console.log(`Keyword: ${keyword}`);
                try {
                    let response = yield axios_1.default.get(`https://api.unsplash.com/search/photos?client_id=${token}&query=${keyword}&page=1`)
                        .then((res) => {
                        const data = res.data;
                        total = data.total;
                        totalPages = data.total_pages;
                    });
                    console.log(`Total: ${total}`);
                    if (!total) {
                        return imageStrings.errors.no_result;
                    }
                    // Limit to the first 25% pages.
                    const upperPageLimit = Math.ceil(totalPages * 0.25);
                    const randomPageNumber = helper_1.getRandomInt(0, upperPageLimit + 1);
                    response = yield axios_1.default.get(`https://api.unsplash.com/search/photos?client_id=${token}&query=${keyword}&page=${randomPageNumber}`)
                        .then((res) => {
                        const data = res.data;
                        const mod = data.total % UNSPLASH_ITEM_PER_PAGE;
                        const itemNo = (randomPageNumber == totalPages)
                            ? helper_1.getRandomInt(0, mod) : helper_1.getRandomInt(0, UNSPLASH_ITEM_PER_PAGE);
                        link = data.results[itemNo].urls.regular;
                    });
                    const photo = yield axios_1.default.get(`${link}`, {
                        headers: {
                            Accept: 'image/jpeg',
                            'Content-Type': 'image/jpeg',
                        },
                        responseType: 'arraybuffer',
                    });
                    attachment = new Discord.MessageAttachment(Buffer.from(photo.data), 'image.jpg');
                    return attachment;
                }
                catch (e) {
                    const genericError = imageStrings.errors.generic
                        .replace('{json}', JSON.parse(e.response.data).message);
                    return genericError;
                }
            }
            else {
                return null;
            }
        });
    }
}
exports.default = Image;
//# sourceMappingURL=image.js.map