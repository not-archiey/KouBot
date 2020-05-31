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
const image_1 = require("../commands/image");
const localizedStrings = require("../storage/localizedStrings.json");
const randomMessages = require("../storage/randomMessages.json");
const helper_1 = require("./helper");
const patterns_1 = require("./patterns");
const SPECIALIZED_CHANCE = 50;
const REACTION_CHANCE = 33;
const USER_REACTION_CHANCE = 5;
const MENTION_REACTION_CHANCE = 25;
const EDIT_CHANCE = 10;
const BACKGROUNDS = [
    'bath', 'beach', 'cabin', 'camp',
    'cave', 'forest', 'messhall',
];
const KACHI_REACTIONS = [
    // `Restrain Rhakon, will you, Kachi?`,
    // `You know Rhakon won't do his job if you're not around.`,
    '*Looking at Rhakon\'s draft works* Ugh, what a cringe test.',
    'Could you make more commissions of my Keitaro and me, instead of that stinky Yoichi?',
    'I will kick out Yoichi and Yuki if they continue bothering my Keitaro time.',
];
const RHAKON_REACTIONS = [
    'Stop fooling around, Rhakon. Where\'s my next chapter?! <:TaigaAngry:699705315519889479>',
    'LMFAO',
    'Smh.',
    'Tell Keitaro to move into my apartment asap.',
    'No objection accepted.',
    'You should listen to Kachi.',
    'AND WHERE IS MY FUCKING CLAY',
    'I swear I will kick Eduard\'s ass if he doesn\'t give me my clay.',
    'And here I thought Lee will be more *understandable* right now.',
    'Midoriai should be an attribute or a property of mine character.',
];
const MAGIC_REACTIONS = [
    'You\'re the best!!! <:TaigaHappy:703785346621505537>',
];
const BRANDON_REACTIONS = [
    'Thank you for making a server for me! <:TaigaHappy:703785346621505537> I totally have no idea how this Dicksword works.',
    'Could you let me top Keitaro sometimes? <:TaigaAnnoyed:702646568146436187>',
    'Only the best like myself can be my sidekicks in this server.',
    'I will kick out anyone who threatens Keitaro, like Hiro maybe.',
    'If Yuri joins, she will be kicked on sight. I don\'t want her bugging me when I\'m having my Keitaro time.',
];
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class ClientUtility {
    static randomMsgHandler(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            const content = message.content.toLowerCase();
            const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
            const responseStrings = (config.lang === 'en') ? enStrings : jpStrings;
            if (this.isSpecialized()) {
                if (content.includes('hiro')) {
                    const background = BACKGROUNDS[helper_1.getRandomInt(0, BACKGROUNDS.length)];
                    const response = yield axios_1.default.post('https://yuuto.dunctebot.com/dialog', {
                        background,
                        character: 'taiga',
                        text: 'Hiro will be terribly wrong if he thinks he can steal Keitaro from me!',
                    }, {
                        responseType: 'arraybuffer',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    });
                    const attachment = new Discord.MessageAttachment(Buffer.from(response.data), 'result.png');
                    message.channel.send(attachment);
                }
                else if (content.includes('aiden')) {
                    const attachment = image_1.default.getImage('hamburger', message);
                    message.channel.send('Three orders of double-quarter-pounder cheeseburgers! Two large fries and one large soda!\n'
                        + 'Burger patties well-done, three slices of pickles for each! No mayonnaise! Just ketchup and mustard!')
                        .then((msg) => {
                        if (attachment) {
                            message.channel.send(attachment);
                        }
                    });
                }
                else {
                    for (const target of randomMessages) {
                        if (message.content.includes(target.keyword)
                            && (target.messages.en.length > 0 || target.messages.jp.length > 0)) {
                            const targetMessage = (config.lang === 'en') ? target.messages.en : target.messages.jp;
                            message.channel.send(targetMessage[helper_1.getRandomInt(0, targetMessage.length)]);
                            break;
                        }
                    }
                }
            }
            else {
                const response = responseStrings.texts
                    .random_responses[helper_1.getRandomInt(0, responseStrings.texts.random_responses.length)];
                message.channel.send(response);
            }
        });
    }
    static randomReactionHandler(message) {
        if (message.author.bot)
            return;
        const hitMiss = helper_1.getRandomInt(0, 100) < REACTION_CHANCE;
        if (hitMiss) {
            for (const target of randomMessages) {
                if (message.content.toLowerCase().includes(target.keyword)) {
                    const reaction = target.reactions[helper_1.getRandomInt(0, target.reactions.length)];
                    if (/\d+/g.test(reaction)) {
                        message.react(message.guild.emojis.cache.get(reaction))
                            .catch(console.error);
                    }
                    else {
                        message.react(reaction).catch(console.error);
                    }
                    break;
                }
            }
        }
    }
    static randomUserReactionHandler(message) {
        const hitMiss = helper_1.getRandomInt(0, 100) < USER_REACTION_CHANCE;
        if (hitMiss) {
            if (message.author.id === '180740743852326912') {
                message.reply(RHAKON_REACTIONS[helper_1.getRandomInt(0, RHAKON_REACTIONS.length)]);
            }
            else if (message.author.id === '215526684797960192') {
                message.reply(KACHI_REACTIONS[helper_1.getRandomInt(0, KACHI_REACTIONS.length)]);
            }
            else if (message.author.id === '169936831373115393') {
                message.reply(MAGIC_REACTIONS[helper_1.getRandomInt(0, MAGIC_REACTIONS.length)]);
            }
            else if (message.author.id === '263348633280315395') {
                message.reply(BRANDON_REACTIONS[helper_1.getRandomInt(0, BRANDON_REACTIONS.length)]);
            }
        }
    }
    static mentionHandler(message) {
        const hitMiss = helper_1.getRandomInt(0, 100) < MENTION_REACTION_CHANCE;
        if (hitMiss) {
            if (message.mentions.users.get('697727604366639136')) {
                const msgs = randomMessages.find((val) => val.keyword === 'taiga');
                const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
                if (msgs) {
                    const responses = (config.lang === 'en') ? msgs.messages.en : msgs.messages.jp;
                    message.reply(responses[helper_1.getRandomInt(0, responses.length)]);
                }
            }
        }
    }
    static randomEditHandler(message) {
        if (message.author.bot)
            return;
        const hitMiss = helper_1.getRandomInt(0, 100) < EDIT_CHANCE;
        if (hitMiss) {
            if (message.content.toLowerCase().includes('taiga')) {
                if (patterns_1.EMOTE_MENTIONS_REGEX.test(message.content.toLowerCase()))
                    return;
                let newStr = message.content.replace('taiga', 'the Great Taiga Akatora');
                newStr = newStr.replace('Taiga', 'The Great Taiga Akatora');
                message.edit(newStr);
            }
        }
    }
    static isSpecialized() {
        return helper_1.getRandomInt(0, 100) < SPECIALIZED_CHANCE;
    }
}
exports.default = ClientUtility;
//# sourceMappingURL=clientUtility.js.map