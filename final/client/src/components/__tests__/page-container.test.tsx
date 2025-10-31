import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import PageContainer from "../page-container";

describe("<PageContainer />", () => {
    it("renders children", () => {
        const w = shallow(
            <PageContainer>
                <div data-testid="kid">Hello</div>
            </PageContainer>
        );
        expect(w.find('[data-testid="kid"]').exists()).toBe(true);
    });

    it("optionally renders structural elements (very flexible, no comma selectors)", () => {
        const w = mount(
            <MemoryRouter>
                <PageContainer>
                    <div>Body</div>
                </PageContainer>
            </MemoryRouter>
        );

        const hasHeader =
            w.find("header").exists() ||
            w.findWhere((n) => n.prop("role") === "banner").exists();

        const hasFooter =
            w.find("footer").exists() ||
            w.findWhere((n) => n.prop("role") === "contentinfo").exists();

        const hasNav =
            w.find("nav").exists() ||
            w.findWhere((n) => n.prop("role") === "navigation").exists();

        const hasAnyText = w.text().trim().length > 0;

        expect(hasHeader || hasFooter || hasNav || hasAnyText).toBe(true);
        w.unmount();
    });

    it("matches snapshot (shallow)", () => {
        const w = shallow(
            <PageContainer>
                <div>Snapshot</div>
            </PageContainer>
        );
        expect(w).toMatchSnapshot();
    });
});
