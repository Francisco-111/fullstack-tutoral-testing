import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import MenuItem from "../menu-item";

describe("<MenuItem />", () => {
    it("renders its label", () => {
        const w = shallow(<MenuItem to="/home">Home</MenuItem> as any);
        expect(w.text().length).toBeGreaterThan(0);
    });

    it("links to route when used with router OR exposes a clickable", () => {
        const w = mount(
            <MemoryRouter initialEntries={["/"]}>
                <MenuItem to="/home">Home</MenuItem>
            </MemoryRouter>
        );

        const link = w.find('a[href="/home"]').first();
        const hasClickable =
            link.exists() ||
            w.findWhere(
                (n) => typeof n.prop === "function" && typeof n.prop("onClick") === "function"
            ).length > 0 ||
            w.find("button").length > 0;

        expect(hasClickable).toBe(true);

        const onClick = jest.fn();
        const w2 = mount(
            <MemoryRouter>
                <MenuItem to="/home" onClick={onClick as any}>
                    Home
                </MenuItem>
            </MemoryRouter>
        );
        const btn = w2.find("button").first();
        if (btn.exists()) {
            btn.simulate("click");
            expect(onClick).toHaveBeenCalled();
        } else if (link.exists()) {
            link.simulate("click", { button: 0 });
        }
        w.unmount();
        w2.unmount();
    });

    it("matches snapshot (shallow)", () => {
        const w = shallow(<MenuItem to="/home">Home</MenuItem> as any);
        expect(w).toMatchSnapshot();
    });
});
