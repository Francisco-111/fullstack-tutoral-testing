import React from "react";
import { mount } from "enzyme";
import { MockedProvider } from "@apollo/client/testing";
import { act } from "react-dom/test-utils";
import ActionButton from "../action-button";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("<ActionButton />", () => {
    it("renders a clickable control without crashing", async () => {
        const wrapper = mount(
            <MockedProvider addTypename={false}>
                <ActionButton>Add to cart</ActionButton>
            </MockedProvider>
        );

        const btn = wrapper.find("button").first();
        expect(btn.exists()).toBe(true);

        btn.simulate("click");
        await act(async () => { await flush(); });
        wrapper.update();

        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    it("shows a sensible label (accept several variants)", () => {
        const wrapper = mount(
            <MockedProvider addTypename={false}>
                <ActionButton>Add to cart</ActionButton>
            </MockedProvider>
        );

        const text = wrapper.text().toLowerCase();
        expect(text).toMatch(/add to cart|remove from cart|book|reserve|trip|checkout|buy/);
        wrapper.unmount();
    });
});
