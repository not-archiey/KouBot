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
var _state, _timer;
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const helper_1 = require("../../utility/helper");
const game_1 = require("../base/game");
const VERTICAL_LENGTH = 3;
const HORIZONTAL_LENGTH = 3;
const EMPTY_SLOT = '\u25a1';
const CIRCLE = '\u25cb';
const CROSS = '\u2573';
const FILE_PATH = '../storage/ticTacToe.json';
var GameState;
(function (GameState) {
    GameState[GameState["Off"] = 0] = "Off";
    GameState[GameState["Starting"] = 1] = "Starting";
    GameState[GameState["PlayerTurn"] = 2] = "PlayerTurn";
    GameState[GameState["TaigaTurn"] = 3] = "TaigaTurn";
})(GameState || (GameState = {}));
var GameResult;
(function (GameResult) {
    GameResult[GameResult["NotOver"] = 0] = "NotOver";
    GameResult[GameResult["CircleWin"] = 1] = "CircleWin";
    GameResult[GameResult["CrossWin"] = 2] = "CrossWin";
    GameResult[GameResult["Draw"] = 3] = "Draw";
})(GameResult || (GameResult = {}));
var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["Easy"] = 0] = "Easy";
    Difficulty[Difficulty["Hard"] = 1] = "Hard";
})(Difficulty || (Difficulty = {}));
class Mark {
    constructor(mark = EMPTY_SLOT) {
        this.IsOccupied = false;
        this.Mark = mark;
    }
}
class GameStatus {
    constructor(state) {
        this.State = state;
    }
}
class TicTacToe extends game_1.default {
    constructor() {
        super('tictactoe', 'A classic tic tac toe game. Game will be cancelled if there are not reactions in 30 seconds.');
        _state.set(this, GameState.Off);
        _timer.set(this, Date.now() / 1000);
    }
    run(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel } = message;
            const player = message.author;
            yield channel.send(`So you're in for a game, huh? <:TaigaSmug:702210822310723614> Bring it on!`)
                .then(msg => {
                msg.channel.send(`Reply 0 or 1 in 5 seconds to select if you want to go first (0) or later (1).`);
            });
            client.on('message', this.waitForMoveFirstChoice);
            yield this.pause();
            if (TicTacToe.MoveFirst.get(player) === undefined) {
                channel.send(`Invalid choice. Aborting the game...`);
                this.uninitialize(client, player);
                return;
            }
            client.off('message', this.waitForMoveFirstChoice);
            const moveFirst = TicTacToe.MoveFirst.get(player);
            yield channel.send(`You will move ${moveFirst ? 'first' : 'later'}.`)
                .then(msg => {
                msg.channel.send(`Reply 0 (Easy) or 1 (Hard) in 5 seconds to select the difficulty.`);
            });
            client.on('message', this.waitForDifficultyChoice);
            yield this.pause();
            if (TicTacToe.Difficulty.get(player) === undefined) {
                channel.send(`Invalid choice. Aborting the game...`);
                this.uninitialize(client, player);
                return;
            }
            client.off('message', this.waitForDifficultyChoice);
            const difficulty = TicTacToe.Difficulty.get(player);
            yield channel.send(`You select the difficulty: ${difficulty === Difficulty.Easy ? 'Easy' : 'Hard'}.`);
            __classPrivateFieldSet(this, _state, GameState.Starting);
            this.initialize(player);
            this.drawBoard(message);
            channel.send(`Game Start!`)
                .then(msg => {
                __classPrivateFieldSet(this, _state, moveFirst ? GameState.PlayerTurn : GameState.TaigaTurn);
                this.play(client, msg, player);
                this.uninitialize(client, player);
            });
        });
    }
    initialize(user) {
        if (__classPrivateFieldGet(this, _state) === GameState.Off)
            return;
        TicTacToe.GameStatuses.set(user, new GameStatus(__classPrivateFieldGet(this, _state)));
        TicTacToe.GameStatuses.get(user).Board = new Array(VERTICAL_LENGTH);
        let board = TicTacToe.GameStatuses.get(user).Board;
        for (let y = 0; y < board.length; y++) {
            board[y] = new Array(HORIZONTAL_LENGTH);
            for (let x = 0; x < HORIZONTAL_LENGTH; x++) {
                board[y][x] = new Mark();
            }
        }
    }
    uninitialize(client, user) {
        client.off('message', this.waitForMoveFirstChoice);
        client.off('message', this.waitForDifficultyChoice);
        client.off('message', this.waitForXInput);
        client.off('message', this.waitForYInput);
        TicTacToe.MoveFirst.delete(user);
        TicTacToe.Difficulty.delete(user);
        TicTacToe.GameStatuses.delete(user);
        TicTacToe.InputX.delete(user);
        TicTacToe.InputY.delete(user);
    }
    waitForMoveFirstChoice(msg) {
        if (msg.author.bot)
            return;
        const reply = msg.content.trim();
        if (/\d{1}/g.test(reply)) {
            const inputNumber = parseInt(reply);
            if (inputNumber < 0 || inputNumber > 1)
                return;
            TicTacToe.MoveFirst.set(msg.author, (inputNumber === 0) ? true : false);
        }
    }
    waitForDifficultyChoice(msg) {
        if (msg.author.bot)
            return;
        const reply = msg.content.trim();
        if (/\d{1}/g.test(msg.content.trim())) {
            const inputNumber = parseInt(reply);
            if (inputNumber < 0 || inputNumber > 1)
                return;
            TicTacToe.Difficulty
                .set(msg.author, (inputNumber === 0) ? Difficulty.Easy : Difficulty.Hard);
        }
    }
    drawBoard(message) {
        let msg = '';
        let board = TicTacToe.GameStatuses.get(message.author).Board;
        board.forEach(row => {
            row.forEach(col => {
                msg += col.Mark + ' ';
            });
            msg += '\n';
        });
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL({ format: 'png' }))
            .setColor(message.member.displayHexColor)
            .setTitle('Current Game Board')
            .setDescription(msg);
        message.channel.send(embed);
    }
    waitForYInput(msg) {
        if (msg.author.bot)
            return;
        const reply = msg.content.trim();
        if (/\d{1}/g.test(msg.content.trim())) {
            const inputNumber = parseInt(reply);
            if (inputNumber < 1 || inputNumber > 3)
                return;
            TicTacToe.InputY.set(msg.author, inputNumber);
        }
    }
    waitForXInput(msg) {
        if (msg.author.bot)
            return;
        const reply = msg.content.trim();
        if (/\d{1}/g.test(msg.content.trim())) {
            const inputNumber = parseInt(reply);
            if (inputNumber < 1 || inputNumber > 3)
                return;
            TicTacToe.InputX.set(msg.author, inputNumber);
        }
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            return helper_1.sleep(5 * 1000);
        });
    }
    waitForAllInput(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel } = message;
            client.on('message', this.waitForYInput);
            yield this.pause();
            if (TicTacToe.InputY.get(message.author) === undefined) {
                channel.send(`Invalid input. Try again.`);
                //this.uninitialize(client);
                //return;
                yield this.pause();
            }
            const inputY = TicTacToe.InputY.get(message.author) - 1;
            channel.send(`Type the column number (1 to 3) in 5 seconds.`);
            client.off('message', this.waitForYInput);
            client.on('message', this.waitForXInput);
            yield this.pause();
            if (TicTacToe.InputX.get(message.author) === undefined) {
                channel.send(`Invalid input. Try again.`);
                //this.uninitialize(client);
                //return;
                yield this.pause();
            }
            const inputX = TicTacToe.InputX.get(message.author) - 1;
            client.off('message', this.waitForXInput);
            return { X: inputX, Y: inputY };
        });
    }
    easyModeRandomPick() {
        return { X: helper_1.getRandomInt(0, HORIZONTAL_LENGTH), Y: helper_1.getRandomInt(0, VERTICAL_LENGTH) };
    }
    areMarksEqual(a, b, c) {
        if (a.Mark === EMPTY_SLOT || b.Mark === EMPTY_SLOT || c.Mark === EMPTY_SLOT)
            return false;
        if (a.Mark !== b.Mark)
            return false;
        if (b.Mark !== c.Mark)
            return false;
        if (a.Mark !== c.Mark)
            return false;
        return true;
    }
    checkResult(message) {
        let result;
        let board = TicTacToe.GameStatuses.get(message.author).Board;
        for (let y = 0; y < VERTICAL_LENGTH; y++) {
            if (this.areMarksEqual(board[y][0], board[y][1], board[y][2])) {
                if (board[y][0].Mark === CIRCLE)
                    return GameResult.CircleWin;
                else if (board[y][0].Mark === CROSS)
                    return GameResult.CrossWin;
            }
            if (this.areMarksEqual(board[0][y], board[1][y], board[2][y])) {
                if (board[0][y].Mark === CIRCLE)
                    return GameResult.CircleWin;
                else if (board[0][y].Mark === CROSS)
                    return GameResult.CrossWin;
            }
        }
        if (this.areMarksEqual(board[VERTICAL_LENGTH - 1][0], board[VERTICAL_LENGTH - 2][1], board[VERTICAL_LENGTH - 3][2])) {
            if (board[VERTICAL_LENGTH - 1][0].Mark === CIRCLE)
                return GameResult.CircleWin;
            else if (board[VERTICAL_LENGTH - 1][0].Mark === CROSS)
                return GameResult.CrossWin;
        }
        if (this.areMarksEqual(board[0][0], board[1][1], board[2][2])) {
            if (board[0][0].Mark === CIRCLE)
                return GameResult.CircleWin;
            else if (board[0][0].Mark === CROSS)
                return GameResult.CrossWin;
        }
        for (let y = 0; y < VERTICAL_LENGTH; y++) {
            for (let x = 0; x < HORIZONTAL_LENGTH; x++) {
                if (!(board[y][x].IsOccupied))
                    return GameResult.NotOver;
            }
        }
        return GameResult.Draw;
    }
    play(client, message, player) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel } = message;
            let board = TicTacToe.GameStatuses.get(player).Board;
            if (__classPrivateFieldGet(this, _state) === GameState.PlayerTurn) {
                channel.send(`It's your turn. Type the row number (1 to 3) in 5 seconds.`);
                let input = yield this.waitForAllInput(client, message);
                while (input && board[input.Y][input.X].IsOccupied) {
                    channel.send(`Space is occupied. Try again.`);
                    input = yield this.waitForAllInput(client, message);
                }
                board[input.Y][input.X].Mark = CIRCLE;
                board[input.Y][input.X].IsOccupied = true;
                this.drawBoard(message);
                TicTacToe.InputX.set(player, undefined);
                TicTacToe.InputY.set(player, undefined);
                __classPrivateFieldSet(this, _state, GameState.TaigaTurn);
            }
            else {
                channel.send(`It's MY turn! <:TaigaSmug:702210822310723614>`);
                if (TicTacToe.Difficulty.get(player) === Difficulty.Easy) {
                    let input;
                    do {
                        input = this.easyModeRandomPick();
                    } while (board[input.Y][input.X].IsOccupied);
                    board[input.Y][input.X].Mark = CROSS;
                    board[input.Y][input.X].IsOccupied = true;
                    this.drawBoard(message);
                    __classPrivateFieldSet(this, _state, GameState.PlayerTurn);
                }
            }
            const result = this.checkResult(message);
            switch (result) {
                case GameResult.Draw:
                    channel.send(`Hah! Guess you're not that bad after all! It's a draw!`);
                    return;
                case GameResult.CircleWin:
                    channel.send(`Shit! You'd better not let your guard down! I'll get to you next time! <:TaigaAnnoyed:702646568146436187>`);
                    return;
                case GameResult.CrossWin:
                    channel.send(`Amateurs! <:TaigaSmug:702210822310723614>`);
                    return;
                default:
                    this.play(client, message, player);
            }
        });
    }
}
exports.default = TicTacToe;
_state = new WeakMap(), _timer = new WeakMap();
TicTacToe.MoveFirst = new Discord.Collection();
TicTacToe.Difficulty = new Discord.Collection();
TicTacToe.GameStatuses = new Discord.Collection();
TicTacToe.InputX = new Discord.Collection();
TicTacToe.InputY = new Discord.Collection();
//# sourceMappingURL=ticTacToe.js.map