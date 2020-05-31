"use strict";
// Copyright(C) 2020 Tetsuki Syu
// See bot.ts for the full notice.
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const bot_1 = require("../bot");
const localizedStrings = require("../storage/localizedStrings.json");
const valentines = require("../storage/valentines.json");
const helper_1 = require("../utility/helper");
const command_1 = require("./base/command");
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class Valentine extends command_1.default {
    constructor() {
        super('valentine', 'info', enStrings.texts.valentine.description, enStrings.texts.valentine.usage, ['lover'], 5);
    }
    run(client, message, args) {
        const embedMessage = this.getEmbeddedMessage(message);
        const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
        const valentineStrings = (config.lang === 'en') ? enStrings.texts.valentine : jpStrings.texts.valentine;
        embedMessage.content.setAuthor(message.member.displayName, message.author.displayAvatarURL({ format: 'png' }));
        if (embedMessage.prefix.length > 0) {
            message.channel
                .send(valentineStrings.infos.keitaro_header)
                .then((msg) => {
                message.channel.send(embedMessage.content);
            });
        }
        else {
            message.channel.send(embedMessage.content);
        }
    }
    getFirstName(name) {
        return name.split(/\s+/)[0];
    }
    getEmbeddedMessage(message) {
        const valentine = this.getValentine();
        const isKeitaro = this.getFirstName(valentine.name) === 'Keitaro';
        const prefixSuffix = isKeitaro ? '~~' : '';
        const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
        const valentineStrings = (config.lang === 'en') ? enStrings.texts.valentine : jpStrings.texts.valentine;
        const footer = isKeitaro ? valentineStrings.infos.keitaro_footer
            : valentineStrings.infos.normal_footer.replace('{firstName}', this.getFirstName(valentine.name));
        const valentineName = valentineStrings.infos.valentine
            .replace('{name}', valentine.name)
            .replace('{prefixSuffix}', prefixSuffix)
            .replace('{prefixSuffix}', prefixSuffix);
        const content = new Discord.MessageEmbed()
            .setThumbnail(this.getEmoteUrl(valentine.emoteId))
            .setColor(valentine.color)
            .setTitle(valentineName)
            .setDescription(`${prefixSuffix}${valentine.description}${prefixSuffix}`)
            .addField(valentineStrings.infos.age, `${prefixSuffix}${valentine.age}${prefixSuffix}`, true)
            .addField(valentineStrings.infos.birthday, `${prefixSuffix}${valentine.birthday}${prefixSuffix}`, true)
            .addField(valentineStrings.infos.animal_motif, `${prefixSuffix}${valentine.animal}${prefixSuffix}`, true)
            .setFooter(footer);
        return { content, prefix: prefixSuffix };
    }
    getEmoteUrl(emoteId) {
        return `https://cdn.discordapp.com/emojis/${emoteId}.png?v=1`;
    }
    getValentine() {
        return valentines[helper_1.getRandomInt(0, valentines.length)];
    }
}
exports.default = Valentine;
//# sourceMappingURL=valentine.js.map