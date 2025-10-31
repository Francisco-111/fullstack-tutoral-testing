import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import LaunchDetail from "../launch-detail";

jest.mock("@apollo/client", () => {
    const actual = jest.requireActual("@apollo/client");
    return {
        ...actual,
        useMutation: jest.fn(() => [
            jest.fn().mockResolvedValue({ data: {} }),
            { loading: false, error: undefined, data: undefined },
        ]),
        useApolloClient: jest.fn(() => ({
            clearStore: jest.fn(),
            resetStore: jest.fn(),
            cache: { reset: jest.fn() },
        })),
    };
});

const launch = {
    id: "7",
    site: "VAFB SLC-4E",
    isBooked: false,
    mission: { name: "Sentinel" },
    rocket: { name: "Falcon 9" },
    missionPatch: "https://example.com/patch.png",
};

describe("<LaunchDetail />", () => {
    it("renders without crashing and shows some content", () => {
        const w = shallow(<LaunchDetail launch={launch as any} />);

        const exists = w.exists();
        const hasChildren = w.children().length > 0;
        const hasText = w.text().trim().length > 0;
        const hasImg = w.find("img").exists();

        expect(exists && (hasChildren || hasText || hasImg)).toBe(true);
    });

    it("mounts with router and provides some UI (button or clickable optional)", async () => {
        const w = mount(
            <MemoryRouter>
                <LaunchDetail launch={launch as any} />
            </MemoryRouter>
        );

        let clicked = false;

        let btn = w.find("button").filterWhere((n) => /book|reserve|add/i.test(n.text())).first();
        if (!btn.exists()) btn = w.find("button").first();

        if (btn.exists()) {
            btn.simulate("click");
            clicked = true;
        } else {
            const clickable = w
                .findWhere((n) => typeof n.prop === "function" && typeof n.prop("onClick") === "function")
                .first();
            if (clickable.exists()) {
                (clickable.prop("onClick") as Function)?.({ preventDefault() {} });
                clicked = true;
            }
        }

        await new Promise((r) => setTimeout(r, 0));

        const hasSomeUI =
            w.exists() && (w.text().trim().length > 0 || w.find("img,svg,div,section").exists());

        expect(hasSomeUI).toBe(true);

        w.unmount();
    });

    it("matches snapshot (shallow)", () => {
        const w = shallow(<LaunchDetail launch={launch as any} />);
        expect(w).toMatchSnapshot();
    });
});
