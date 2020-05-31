"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("../bot");
const helper_1 = require("./helper");
class AdminUtility {
    static execute(client, message, args) {
        var _a;
        const { channel, guild } = message;
        const cmd = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const deleteOps = { timeout: 5 * 1000 };
        switch (cmd) {
            case 'setlang':
                {
                    console.log('Setting language code...');
                    const [user] = helper_1.findMembers(args[0], guild);
                    for (let i = 0; i < bot_1.MEMBER_CONFIG.length; i++) {
                        if (bot_1.MEMBER_CONFIG[i].userId === user.id) {
                            bot_1.MEMBER_CONFIG[i].lang = args[1];
                            channel.send(`Successfully set the language for ${user.displayName} to ${args[1]}`)
                                .then((m) => {
                                m.delete(deleteOps).then((_m) => message.delete());
                            });
                            return;
                        }
                    }
                    bot_1.MEMBER_CONFIG.push({ user: user.user, userId: user.id, lang: args[1] });
                    channel.send(`Successfully add the language for ${user.displayName}: ${args[1]}`)
                        .then((m) => {
                        m.delete(deleteOps).then((_m) => message.delete());
                    });
                    return;
                }
            default:
                channel.send('Invalid admin command.');
        }
    }
}
exports.default = AdminUtility;
//# sourceMappingURL=adminUtility.js.map