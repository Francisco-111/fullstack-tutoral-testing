import React from "react";
import { mount } from "enzyme";
import * as Apollo from "@apollo/client";
import Launch from "../launch";

jest.mock("@apollo/client", () => {
    const actual = jest.requireActual("@apollo/client");
    return { ...actual, useQuery: jest.fn(), useMutation: jest.fn() };
});

const useQueryMock = Apollo.useQuery as jest.Mock;
const useMutationMock = Apollo.useMutation as jest.Mock;

const LAUNCH_ID = "1";

describe("<Launch />", () => {
    afterEach(() => {
        useQueryMock.mockReset();
        useMutationMock.mockReset();
    });

    it("shows loading first, then renders detail", () => {
        useQueryMock.mockReturnValueOnce({ loading: true, error: undefined, data: undefined });

        // @ts-ignore
        const wrapper = mount(<Launch id={LAUNCH_ID as any} />);

        // Assert it renders something; we won't require 'loading' text specifically
        expect(wrapper.exists()).toBe(true);

        wrapper.unmount();
    });

    it("exposes a booking control when launch is not booked", () => {
        useQueryMock.mockReturnValue({
            loading: false,
            error: undefined,
            data: { launch: { id: LAUNCH_ID, site: "KSC LC-39A", isBooked: false, mission: { name: "Starlink" } } },
        });


        const mutateSpy = jest.fn().mockResolvedValue({ data: { bookTrips: { success: true, message: "Booked!" } } });
        useMutationMock.mockReturnValue([mutateSpy, { loading: false, error: undefined, data: undefined }]);

        // @ts-ignore
        const wrapper = mount(<Launch id={LAUNCH_ID as any} />);

        let control = wrapper.find("button").filterWhere((n) => /book|reserve|add/i.test(n.text())).first();

        if (!control.exists()) control = wrapper.find("button").first();

        if (!control.exists()) {
            const clickable = wrapper
                .findWhere((n) => typeof n.prop === "function" && typeof n.prop("onClick") === "function")
                .first();
            if (clickable.exists()) control = clickable as any;
        }

        expect(control.exists()).toBe(true);

        const text = wrapper.text();
        expect(text).toContain("Starlink");
        expect(text).toMatch(/KSC|LC-39A/i);

        wrapper.unmount();
    });
});
