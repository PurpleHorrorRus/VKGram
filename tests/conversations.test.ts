import misc from "../src/renderer/assets/misc";
import c_scripts from "../src/renderer/assets/conversations";
import easyvk from "easyvk";

let vk = null;

beforeAll(async () => {
    let VKAuthData: object = misc.ReadJSON("./config/vk.json");
    VKAuthData = Object.assign(VKAuthData, { session_file: "./config/.vksession" });
    vk = await easyvk(VKAuthData);
});

test("VK Auth", () => expect(vk).not.toBeFalsy());
describe("Get Conversations", () => {   
    let conversations = null;
    let build = null;

    test("Get", async () => {
        const { vkr } = await vk.call("messages.getConversations", { extended: 1 });
        conversations = vkr;
        expect(conversations).not.toBeFalsy();
    });

    test("Build", () => {
        const { items, groups, profiles } = conversations;
        build = c_scripts.BuildConversations(items, groups, profiles);
        expect(build).not.toBeFalsy();
    });

    test("Build Object Match", () => {
        const props = ["id", "title", "photo", "msg_id", "out_read", "in_read", "online", "online_mobile", "message"];
        build.forEach(e => props.forEach(p => expect(e).toHaveProperty(p)));
    });
});