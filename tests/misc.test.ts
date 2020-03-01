import misc from "../src/renderer/assets/misc";
describe("Misc", () => {
    test("Array Move", () => {
        const src: Array<number> = [1, 2, 3, 4];
        const target: Array<number> = [3, 1, 2, 4];
        expect(misc.ArrayMove(src, 2, 0)).toStrictEqual(target);
    });
});