import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import Header from "../header";

describe("<Header />", () => {
    it("renders a title, logo, or any text (with router)", () => {
        const w = mount(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const hasLogoImg = w.find("img[alt]").exists();
        const hasH1 = w.find("h1").exists();
        const hasH2 = w.find("h2").exists();
        const hasRoleHeading = w.findWhere((n) => n.prop("role") === "heading").exists();
        const hasAnyText = w.text().trim().length > 0;

        expect(hasLogoImg || hasH1 || hasH2 || hasRoleHeading || hasAnyText).toBe(true);
        w.unmount();
    });

    it("renders a usable header shell (with router)", () => {
        const w = mount(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const hasNavTag = w.find("nav").exists();
        const hasLinks = w.find("a").length > 0;
        const hasButtons = w.find("button").length > 0;
        const hasIcon = w.find("svg").exists() || w.find("img").exists();
        const hasAnyText = w.text().trim().length > 0;

        const text = w.text().toLowerCase();
        const looksLikeTitle = /space\s*explorer/.test(text);

        expect(
            hasNavTag || hasLinks || hasButtons || hasIcon || hasAnyText || looksLikeTitle
        ).toBe(true);

        w.unmount();
    });

    it("matches snapshot (shallow)", () => {
        const w = shallow(<Header />);
        expect(w).toMatchSnapshot();
    });
});
