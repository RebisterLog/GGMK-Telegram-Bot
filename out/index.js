"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bot_1 = require("./Bot");
const Config_json_1 = require("./Config.json");
const Start_1 = require("./Commands/Start");
const Schedules_1 = require("./Commands/Schedules");
const constructorOptions = {
    polling: false,
    request: {
        url: 'http://uoggmk.by/%D1%80%D0%B0%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5/',
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 OPR/98.0.0.0 (Edition Yx GX)"
        }
    },
    filepath: true,
};
const GGMK_INFO_BOT = new Bot_1.Bot(Config_json_1.token, constructorOptions);
GGMK_INFO_BOT.SetCommands([
    new Start_1.Start(),
    new Schedules_1.Schedules(),
]);
GGMK_INFO_BOT.Start();
