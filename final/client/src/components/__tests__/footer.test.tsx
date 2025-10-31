import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import Footer from "../footer";

jest.mock("@apollo/client", () => {
    const actual = jest.requireActual("@apollo/client");
    return {
        ...actual,
        useApolloClient: jest.fn(() => ({
            // minimal fake client
            clearStore: jest.fn(),
            resetStore: jest.fn(),
            cache: { reset: jest.fn() },
        })),
        useMutation: jest.fn(() => [
            jest.fn().mockResolvedValue({ data: {} }),
            { loading: false, error: undefined, data: undefined },
        ]),
    };
});

function countLinks(wrapper: ReturnType<typeof mount>) {
    const anchors = wrapper.find("a").length;
    const buttons = wrapper.find("button").length;
    return anchors + buttons;
}

describe("<Footer />", () => {
    it("renders navigation or actions (with router, Apollo hooks mocked)", () => {
        const w = mount(
            <MemoryRouter initialEntries={["/"]}>
                <Footer />
            </MemoryRouter>
        );
        expect(countLinks(w)).toBeGreaterThan(0);
        w.unmount();
    });

    it("shows common nav text if present (non-brittle)", () => {
        const w = shallow(<Footer />);
        const t = w.text().toLowerCase();
        expect(/home|cart|profile|logout/.test(t)).toBe(true);
    });

    it("matches snapshot (shallow)", () => {
        const w = shallow(<Footer />);
        expect(w).toMatchSnapshot();
    });
});
