/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/wechaty/wechaty
 */
import { Contact, ScanStatus, Wechaty, log } from "wechaty";
import { WechatyVorpal } from "wechaty-vorpal";

import { generate } from "qrcode-terminal";

const hackerNews = require("vorpal-hacker-news");

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    generate(qrcode, { small: true }); // show qrcode on console

    const qrcodeImageUrl = [
      "https://wechaty.js.org/qrcode/",
      encodeURIComponent(qrcode)
    ].join("");

    log.info(
      "VorpalBot",
      "onScan: %s(%s) - %s",
      ScanStatus[status],
      status,
      qrcodeImageUrl
    );
  } else {
    log.info("VorpalBot", "onScan: %s(%s)", ScanStatus[status], status);
  }
}

function onLogin(user: Contact) {
  log.info("VorpalBot", "%s login", user);
}

function onLogout(user: Contact) {
  log.info("VorpalBot", "%s logout", user);
}

const bot = new Wechaty({
  name: "vorpal-bot",
  /**
   * Specify a `puppet` for a specific protocol (Web/Pad/Mac/Windows, etc).
   *
   * You can use the following providers:
   *  - wechaty-puppet-hostie
   *  - wechaty-puppet-wechat
   *  - wechaty-puppet-padplus
   *  - etc.
   *
   * Learn more about Wechaty Puppet Providers at:
   *  https://github.com/wechaty/wechaty-puppet/wiki/Directory
   */

  // puppet: 'wechaty-puppet-hostie',
  puppet: "wechaty-puppet-wechat4u"
});

bot.on("scan", onScan);
bot.on("login", onLogin);
bot.on("logout", onLogout);

bot.use(
  WechatyVorpal({
    use: hackerNews
  })
);

bot
  .start()
  .then(() => log.info("VorpalBot", "Vorpal Bot Started."))
  .catch((e) => log.error("VorpalBot", e));
