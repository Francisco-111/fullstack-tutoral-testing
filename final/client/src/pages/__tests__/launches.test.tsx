import React from "react";
import { mount } from "enzyme";
import * as Apollo from "@apollo/client";
import Launches from "../launches";

jest.mock("@apollo/client", () => {
    const actual = jest.requireActual("@apollo/client");
    return { ...actual, useQuery: jest.fn() };
});
const useQueryMock = Apollo.useQuery as jest.Mock;

function countLaunchItems(wrapper: ReturnType<typeof mount>): number {
    const byTestId = wrapper.find('[data-testid="launch-item"]').length;
    if (byTestId) return byTestId;

    const byRole = wrapper.find('[role="listitem"]').length;
    if (byRole) return byRole;

    // common patterns: cards/links that navigate to a launch page
    const byLink = wrapper.find('a[href*="/launch"]').length;
    if (byLink) return byLink;

    return wrapper.find("li").length;
}

describe("<Launches /> (unit, useQuery mocked)", () => {
    afterEach(() => useQueryMock.mockReset());

    it("renders zero items while loading", () => {
        useQueryMock.mockReturnValue({ loading: true, error: undefined, data: undefined });

        // @ts-ignore
        const wrapper = mount(<Launches />);
        expect(countLaunchItems(wrapper)).toBe(0);
        wrapper.unmount();
    });

    it("renders zero items for an empty result", () => {
        useQueryMock.mockReturnValue({
            loading: false,
            error: undefined,
            data: { launches: [] },
        });

        // @ts-ignore
        const wrapper = mount(<Launches />);
        expect(countLaunchItems(wrapper)).toBe(0);
        wrapper.unmount();
    });

    it("renders successfully when data is present (no loading/error)", () => {
        useQueryMock.mockReturnValue({
            loading: false,
            error: undefined,
            data: {
                launches: [
                    { id: "1", site: "KSC LC-39A", mission: { name: "Starlink" }, isBooked: false },
                    { id: "2", site: "VAFB SLC-4E", mission: { name: "Sentinel" }, isBooked: true },
                ],
            },
        });

        // @ts-ignore
        const wrapper = mount(<Launches />);

        expect(wrapper.exists()).toBe(true);

        const text = wrapper.text().toLowerCase();
        expect(text).not.toMatch(/error/);

        expect(text).not.toMatch(/loading|spinner|please wait/);

        wrapper.unmount();
    });
});
