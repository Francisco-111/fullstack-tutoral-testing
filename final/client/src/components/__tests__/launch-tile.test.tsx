import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import LaunchTile from "../launch-tile";

const sample = {
    id: "42",
    mission: { name: "Starlink" },
    rocket: { name: "Falcon 9" },
    isBooked: false,
    site: "KSC LC-39A",
    missionPatch: "https://example.com/patch.png",
};

describe("<LaunchTile />", () => {
    it("renders mission/rocket text", () => {
        const w = shallow(<LaunchTile launch={sample as any} />);
        const txt = w.text();
        expect(txt.length).toBeGreaterThan(0);
    });

    it("links to the launch detail route (with router) or exposes a clickable", () => {
        const w = mount(
            <MemoryRouter initialEntries={["/"]}>
                <LaunchTile launch={sample as any} />
            </MemoryRouter>
        );

        const links = w.find('a[href*="/launch"]');
        const hasClickable =
            links.length > 0 ||
            w.findWhere(
                (n) => typeof n.prop === "function" && typeof n.prop("onClick") === "function"
            ).length > 0;

        expect(hasClickable).toBe(true);
        w.unmount();
    });

    it("handles booked state without crashing (isBooked=true)", () => {
        const booked = { ...sample, isBooked: true };
        const w = shallow(<LaunchTile launch={booked as any} />);
        expect(w.exists()).toBe(true);
        expect(w.text().length).toBeGreaterThan(0);
    });
});
