"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSchedules = void 0;
const Command_1 = require("../Classes/Command");
const fs = require("fs");
const HttpClient_1 = require("typed-rest-client/HttpClient");
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const http = __importStar(require("http"));
function downloadPNGImage(url, outputPath) {
    const file = fs.createWriteStream(outputPath);
    http.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
        });
    }).on('error', (err) => {
        fs.unlink(outputPath, () => {
            console.error(`Error while download: ${err.message}`);
        });
    });
}
class Parser {
    constructor() {
        this.client = new HttpClient_1.HttpClient("ClientHttp");
        this.url = 'http://uoggmk.by/%D1%80%D0%B0%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5/';
        this.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 OPR/98.0.0.0 (Edition Yx GX)"
        };
        this.Axio = axios_1.default.create();
        this.imagesUrls = [];
        this.imagePaths = [];
    }
    GetImages() {
        return this.imagesUrls;
    }
    ParseUrls() {
        this.Axio.get(this.url).then(response => {
            const html = response.data;
            const parsedInfo = cheerio_1.default.load(html);
            const table = parsedInfo("img");
            this.imagesUrls[0] = table[5].attribs["src"];
            this.imagesUrls[1] = table[6].attribs["src"];
            return this.imagesUrls;
        });
    }
    DownloadImages() {
        this.imagePaths = [];
        this.imagesUrls.forEach((url, index) => __awaiter(this, void 0, void 0, function* () {
            const path = `./Temp/schedule${index}.png`;
            downloadPNGImage(url, path);
            this.imagePaths.push(path);
        }));
    }
}
const parser = new Parser();
parser.ParseUrls();
parser.DownloadImages();
class GetSchedules extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.Command = "get_schedules";
        this.Description = "Изменения в расписании";
    }
    Handle() {
        const bot = this.bot.GetBotInstance();
        bot.on("message", (message, metadata) => __awaiter(this, void 0, void 0, function* () {
            if (message.text !== "/get_schedules")
                return;
            parser.DownloadImages();
            const chatId = message.chat.id;
            bot.sendMessage(chatId, `Скачивание...`);
            parser.imagePaths.forEach(path => {
                const file = fs.readFileSync(path);
                bot.sendPhoto(chatId, file);
            });
        }));
    }
}
exports.GetSchedules = GetSchedules;