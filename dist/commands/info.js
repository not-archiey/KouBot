"use strict";
// Copyright(C) 2020 Tetsuki Syu
// See bot.ts for the full notice.
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const localizedStrings = require("../storage/localizedStrings.json");
const command_1 = require("./base/command");
const enStrings = localizedStrings.find((val) => val.lang === 'en');
class Info extends command_1.default {
    constructor() {
        super('info', 'info', enStrings.texts.info.description, enStrings.texts.info.usage, ['credits', 'bot']);
    }
    run(client, message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor('#e81615')
            .setAuthor('Taiga from Camp Buddy', 'https://cdn.discordapp.com/emojis/593518771554091011.png', 'https://blitsgames.com')
            .setDescription('Taiga was based on the amazing Yuuto, which was made and developed by the community, for the community. \n'
            + 'It was inspired by dunste123#0129\'s Hiro. \n'
            + 'Join Yuuto\'s dev team and start developing on the [project website](http://iamdeja.github.io/yuuto-docs/). \n\n'
            + 'Yuuto version 1.0 was made and developed by: \n'
            + '**Arch#0226**, **Dé-Jà-Vu#1004**, **dunste123#0129**, **zsotroav#8941** \n'
            + 'Taiga version 1.0 and Yuuto\'s TypeScript version ported by: \n**Chehui Chou#1250** \n'
            + 'Japanese oracle co-translated with: \n**Kirito#9286** \n'
            + 'Taiga reactions and feedback shared by: \n'
            + '**Kirito#9286**, **Kachiryoku#0387**, and countless Camp Buddy fans. \n')
            .setFooter('Taiga Bot: Release 1.0 (Based on Yuuto Bot Release 1.0) | 2020-04-22');
        message.channel.send(embed);
    }
}
exports.default = Info;
//# sourceMappingURL=info.js.map