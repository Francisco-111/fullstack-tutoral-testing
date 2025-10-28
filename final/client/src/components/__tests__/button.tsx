import React from "react";
import { shallow } from "enzyme";
import Button from "../button";

describe("<Button />", () => {
    it("calls onClick when the native button is clicked", () => {
        const onClick = jest.fn();
        const wrapper = shallow(<Button onClick={onClick}>Go</Button>);

        // simulate click on actual <button> element inside
        wrapper.find("button").simulate("click");

        expect(onClick).toHaveBeenCalled();
    });

    it("renders its label", () => {
        const wrapper = shallow(<Button>Book now</Button>);
        expect(wrapper.text()).toContain("Book now");
    });

    it("matches snapshot", () => {
        const wrapper = shallow(<Button>Snapshot</Button>);
        expect(wrapper).toMatchSnapshot();
    });
});
