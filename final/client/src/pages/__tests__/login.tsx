// src/pages/__tests__/login.test.tsx
import React from "react";
import { mount } from "enzyme";
import { MockedProvider } from "@apollo/client/testing";
import { act } from "react-dom/test-utils";
import Login from "../login";

// Helper to let Apollo microtasks resolve in jsdom/Jest
const flushPromises = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("<Login />", () => {
    it("shows an input for email/username (with Apollo provider)", async () => {
        const wrapper = mount(
            <MockedProvider mocks={[]} addTypename={false}>
                <Login />
            </MockedProvider>
        );

        await act(async () => {
            await flushPromises();
        });
        wrapper.update();

        const hasEmailInput =
            wrapper.find('input[type="email"]').exists() ||
            wrapper.find('input[name="email"]').exists() ||
            wrapper.find('input[type="text"]').exists();

        expect(hasEmailInput).toBe(true);
        wrapper.unmount();
    });

    it("renders a submit button", async () => {
        const wrapper = mount(
            <MockedProvider mocks={[]} addTypename={false}>
                <Login />
            </MockedProvider>
        );

        await act(async () => {
            await flushPromises();
        });
        wrapper.update();

        const button = wrapper.find("button").first();
        expect(button.exists()).toBe(true);
        expect(button.text().toLowerCase()).toMatch(/log\s*in|sign\s*in|submit/);

        wrapper.unmount();
    });

    it("matches snapshot", async () => {
        const wrapper = mount(
            <MockedProvider mocks={[]} addTypename={false}>
                <Login />
            </MockedProvider>
        );

        await act(async () => {
            await flushPromises();
        });
        wrapper.update();

        expect(wrapper).toMatchSnapshot();
        wrapper.unmount();
    });
});
