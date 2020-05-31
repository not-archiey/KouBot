"use strict";
// Copyright(C) 2020 Tetsuki Syu
// See bot.ts for the full notice.
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("../bot");
const localizedStrings = require("../storage/localizedStrings.json");
const command_1 = require("./base/command");
const enStrings = localizedStrings.find((val) => val.lang === 'en');
const jpStrings = localizedStrings.find((val) => val.lang === 'jp');
class Help extends command_1.default {
    constructor() {
        super('help', 'info', enStrings.texts.help.description, enStrings.texts.help.usage);
    }
    run(client, message, args) {
        const commandName = args[0] || 'help';
        const config = bot_1.MEMBER_CONFIG.find((config) => config.userId === message.author.id);
        const helpStrings = (config.lang === 'en') ? enStrings.texts.help : jpStrings.texts.help;
        const commandLists = bot_1.COMMANDS.map((cmd) => ` - **${cmd.Category}:** \`${cmd.Name}\`: *${cmd.Description}*`).join('\n');
        if (commandName === 'list') {
            message.channel.send(helpStrings.errors.show_list.replace('{commandLists}', commandLists));
            return;
        }
        let command = bot_1.COMMANDS.get(commandName);
        if (!command && bot_1.ALIASES.has(commandName)) {
            command = bot_1.COMMANDS.get(bot_1.ALIASES.get(commandName));
        }
        if (!command) {
            message.reply(helpStrings.errors.no_command);
            return;
        }
        const result = helpStrings.result
            .replace('{category}', command.Category)
            .replace('{name}', command.Name)
            .replace('{usage}', command.Usage)
            .replace('{aliases}', (command.Alias && command.Alias.length) ? `\n**Aliases:** \`${command.Alias}\`` : '');
        message.channel.send(result);
    }
}
exports.default = Help;
//# sourceMappingURL=help.js.map