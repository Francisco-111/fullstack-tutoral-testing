// src/pages/__tests__/login.mutation.success.test.tsx
import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import { act } from "react-dom/test-utils";
import Login from "../login";

// Prefer importing the exact document from your component if exported:
// import { LOGIN_USER } from "../login";

const LOGIN_USER = gql`
    mutation Login($email: String!) {
        login(email: $email) {
            id
            token
        }
    }
`;

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

function findEmailInput(wrapper: ReactWrapper) {
    const byName = wrapper.find('input[name="email"]');
    if (byName.exists()) return byName.first();
    const byTypeEmail = wrapper.find('input[type="email"]');
    if (byTypeEmail.exists()) return byTypeEmail.first();
    const anyInput = wrapper.find("input");
    if (anyInput.exists()) return anyInput.first();
    throw new Error("Email input not found. Adjust selector to your component.");
}

describe("<Login /> mutation (success)", () => {
    const email = "user@example.com";
    const token = "jwt.123";

    const mocks = [
        {
            request: {
                query: LOGIN_USER,
                variables: { email }, // must match exactly what your component sends
            },
            result: {
                data: {
                    login: {
                        id: "user-1",   // include id since the real mutation returns it
                        token,          // token your component stores in localStorage
                    },
                },
            },
        },
    ];

    beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => {});
        window.localStorage.removeItem("token");
    });

    afterEach(() => {
        (window.localStorage.setItem as jest.Mock).mockRestore();
    });

    it("stores token in localStorage after successful login", async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Login />
            </MockedProvider>
        );

        // type email
        const emailInput = findEmailInput(wrapper);
        emailInput.simulate("change", { target: { value: email, name: "email" } });

        // submit (prefer submitting the form if present)
        const form = wrapper.find("form").first();
        if (form.exists()) {
            form.simulate("submit", { preventDefault() {} });
        } else {
            wrapper.find("button").first().simulate("click");
        }

        // let Apollo resolve; sometimes two ticks are safer
        await act(async () => {
            await flush();
            await flush();
        });
        wrapper.update();

        expect(window.localStorage.setItem).toHaveBeenCalledWith("token", token);
        wrapper.unmount();
    });
});
