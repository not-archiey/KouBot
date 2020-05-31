"use strict";
// Copyright(C) 2020 Tetsuki Syu
// See bot.ts for the full notice.
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const bot_1 = require("../bot");
const localizedStrings = require("../storage/localizedStrings.json");
const routes = require("../storage/routes.json");
const helper_1 = require("../utility/helper");
const command_1 = require("./base/command");
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class Route extends command_1.default {
    constructor() {
        super('route', 'info', enStrings.texts.route.description, enStrings.texts.route.usage, undefined, 5);
    }
    run(client, message, args) {
        const embedMessage = this.getEmbeddedMessage(message);
        embedMessage.content.setAuthor(message.member.displayName, message.author.displayAvatarURL({ format: 'png' }));
        message.channel.send(embedMessage.content);
    }
    getFirstName(name) {
        return name.split(/\s+/)[0];
    }
    getEmbeddedMessage(message) {
        const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
        const routeStrings = (config.lang === 'en') ? enStrings.texts.route : jpStrings.texts.route;
        const character = this.getRoute();
        let ending = this.getEnding(message);
        if (character.name === 'Hiro Akiba (Mature)') {
            ending = (config.lang === 'en') ? 'Perfect' : 'パーフェクト';
        }
        const title = routeStrings.infos.next
            .replace('{name}', character.name)
            .replace('{ending}', ending);
        const footer = routeStrings.infos.footer
            .replace('{firstName}', this.getFirstName(character.name));
        const content = new Discord.MessageEmbed()
            .setThumbnail(this.getEmoteUrl(character.emoteId))
            .setColor(character.color)
            .setTitle(title)
            .setDescription(character.description)
            .addField(routeStrings.infos.age, character.age, true)
            .addField(routeStrings.infos.birthday, character.birthday, true)
            .addField(routeStrings.infos.animal_motif, character.animal, true)
            .setFooter(footer);
        return { content, prefix: '' };
    }
    getEmoteUrl(emoteId) {
        return `https://cdn.discordapp.com/emojis/${emoteId}.gif?v=1`;
    }
    getEnding(message) {
        const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
        const routeStrings = (config.lang === 'en') ? enStrings.texts.route : jpStrings.texts.route;
        return routeStrings
            .infos.endings[helper_1.getRandomInt(0, routeStrings.infos.endings.length)];
    }
    getRoute() {
        return routes[helper_1.getRandomInt(0, routes.length)];
    }
}
exports.default = Route;
//# sourceMappingURL=route.js.map