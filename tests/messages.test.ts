import misc from "../src/renderer/assets/misc";
import m_scripts from "../src/renderer/assets/messages";
import easyvk from "easyvk";

let vk = null;

beforeAll(async () => {
    let VKAuthData: object = misc.ReadJSON("./config/vk.json");
    VKAuthData = Object.assign(VKAuthData, { session_file: "./config/.vksession" });
    vk = await easyvk(VKAuthData);
});

describe("Get History", () => {
    let history = null;

    beforeAll(async () => {
        const { vkr: _history } = await vk.call("messages.getHistory", {
            peer_id: 243263728,
            fields: "photo_50",
            extended: 1
        });
        history = _history;
    });

    test("Get", () => expect(history).not.toBeFalsy());
    test("Build", () => {
        const build = m_scripts.BuildHistory(history);
        expect(build).not.toBeFalsy();
    });

    test("Build Groups", async () => {
        const { vkr: _history } = await vk.call("messages.getHistory", {
            peer_id: -49423435,
            fields: "photo_50",
            extended: 1
        });
        const build = m_scripts.BuildHistory(_history);
        expect(build).not.toBeFalsy();
    });
});