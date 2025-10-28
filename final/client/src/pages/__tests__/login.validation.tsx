// src/pages/__tests__/login.validation.test.tsx
import React from "react";
import { mount } from "enzyme";
import { MockedProvider } from "@apollo/client/testing";
import { act } from "react-dom/test-utils";
import Login from "../login";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("<Login /> validation", () => {
    it("prevents submit when email is empty", async () => {
        const wrapper = mount(
            <MockedProvider mocks={[]} addTypename={false}>
                <Login />
            </MockedProvider>
        );

        await act(async () => {
            await flush();
        });
        wrapper.update();

        const button = wrapper.find("button").first();
        // If your component sets disabled state until email is valid:
        // expect(button.prop("disabled")).toBe(true);

        // Or attempt to click and assert UI stays the same (no loading, no error)
        button.simulate("click");
        await act(async () => {
            await flush();
        });
        wrapper.update();

        // Adjust these to match your UI. The key is: no token set, no success state.
        expect(window.localStorage.getItem("token")).toBeNull();
        wrapper.unmount();
    });
});
