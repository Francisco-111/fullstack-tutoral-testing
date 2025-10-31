import React from "react";
import { shallow } from "enzyme";
import Loading from "../loading";

describe("<Loading />", () => {
    it("renders without crashing and provides some UI", () => {
        const w = shallow(<Loading />);

        const exists = w.exists();
        const hasChildren = w.children().length > 0;
        const hasText = w.text().trim().length > 0;

        const hasProgressRole = w.find('[role="progressbar"]').exists();
        const hasAriaBusy = w.findWhere((n) => n.prop("aria-busy") === true).exists();
        const hasSvg = w.find("svg").exists();

        expect(
            exists && (hasChildren || hasText || hasProgressRole || hasAriaBusy || hasSvg)
        ).toBe(true);
    });

    it("matches snapshot", () => {
        const w = shallow(<Loading />);
        expect(w).toMatchSnapshot();
    });
});
