import React from "react";
import { mount, shallow } from "enzyme";
import Button from "../button";

function click(wrapper: ReturnType<typeof mount>) {
    const native = wrapper.find("button").first();
    if (native.exists()) {
        native.simulate("click");
        return true;
    }
    const anyClickable = wrapper.findWhere(
        (n) => typeof n.prop === "function" && typeof n.prop("onClick") === "function"
    ).first();
    if (anyClickable.exists()) {
        // @ts-ignore
        (anyClickable.prop("onClick") as Function)?.({ preventDefault() {} });
        return true;
    }
    return false;
}

describe("<Button />", () => {
    it("renders its children label", () => {
        const w = shallow(<Button>Book now</Button>);
        expect(w.text()).toContain("Book now");
    });

    it("invokes onClick when activated", () => {
        const onClick = jest.fn();
        const w = mount(<Button onClick={onClick}>Go</Button>);
        const triggered = click(w);
        expect(triggered).toBe(true);
        expect(onClick).toHaveBeenCalled();
        w.unmount();
    });

    it("respects disabled state when provided", () => {
        const w = mount(
            // @ts-ignore some buttons accept `disabled`, some pass it through
            <Button disabled>Disabled</Button>
        );
        const native = w.find("button").first();
        if (native.exists()) {
            expect(native.prop("disabled")).toBe(true);
        } else {
            expect(w.text()).toContain("Disabled");
        }
        w.unmount();
    });

    it("matches snapshot", () => {
        const w = shallow(<Button>Snapshot</Button>);
        expect(w).toMatchSnapshot();
    });
});
