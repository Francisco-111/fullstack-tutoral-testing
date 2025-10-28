import React from "react";
import { shallow } from "enzyme";
import Header from "../header";

describe("<Header />", () => {
    it("renders the Space Explorer title", () => {
        const wrapper = shallow(<Header />);
        expect(wrapper.text()).toMatch(/Space Explorer/i);
    });

    it("matches snapshot", () => {
        const wrapper = shallow(<Header />);
        expect(wrapper).toMatchSnapshot();
    });
});