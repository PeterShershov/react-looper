import { bpmToMs } from "../src/looper";

describe("bpmToMs utility function", () => {
	it("returns correct milliseconds", () => {
		expect(bpmToMs(100)).toBe(600);
		expect(bpmToMs(50)).toBe(1200);
		expect(bpmToMs(150)).toBe(400);
	})
})
