import bpm2ms from "../src/bpm-to-ms";

describe("bpm2ms", () => {
    it("converts bpm to milliseconds", () => {
        expect(bpm2ms(120)).toBe(500);
        expect(bpm2ms(100)).toBe(600);
        expect(bpm2ms(80)).toBe(750);
    })
})
