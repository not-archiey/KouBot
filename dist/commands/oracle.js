"use strict";
// Copyright(C) 2020 Tetsuki Syu
// See bot.ts for the full notice.
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const bot_1 = require("../bot");
const localizedStrings = require("../storage/localizedStrings.json");
const oracles = require("../storage/oracles.json");
const helper_1 = require("../utility/helper");
const command_1 = require("./base/command");
const thumbnailUrl = 'https://cdn.discordapp.com/emojis/701918026164994049.png?v=1';
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class Oracle extends command_1.default {
    constructor() {
        super('oracle', 'info', enStrings.texts.oracle.description, enStrings.texts.oracle.usage, ['fortune'], 5);
        console.log(`Total oracles available: ${oracles.length}`);
    }
    run(client, message, args) {
        const embedMessage = this.getEmbeddedMessage(message);
        embedMessage.setAuthor(message.member.displayName, message.author.displayAvatarURL({ format: 'png' }));
        message.channel.send(embedMessage);
    }
    getEmbeddedMessage(message) {
        const oracle = this.getOracle();
        const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
        const oracleStrings = (config.lang === 'en') ? enStrings.texts.oracle : jpStrings.texts.oracle;
        return new Discord.MessageEmbed()
            .setThumbnail(thumbnailUrl)
            .setColor('#ff0000')
            .setTitle(`${oracle.fortune}`)
            .setDescription(`${oracle.content}`)
            .addField(oracleStrings.uis.no, `${oracle.no}`, false)
            .addField(oracleStrings.uis.meaning, `${oracle.meaning}`, false)
            .setFooter(oracleStrings.result);
    }
    getOracle() {
        return oracles[helper_1.getRandomInt(0, oracles.length)];
    }
}
exports.default = Oracle;
//# sourceMappingURL=oracle.js.map