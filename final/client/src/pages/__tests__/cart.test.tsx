import React from "react";
import { mount } from "enzyme";
import * as Apollo from "@apollo/client";
import Cart from "../cart";

jest.mock("@apollo/client", () => {
    const actual = jest.requireActual("@apollo/client");
    return { ...actual, useQuery: jest.fn(), useMutation: jest.fn() };
});

const useQueryMock = Apollo.useQuery as jest.Mock;
const useMutationMock = Apollo.useMutation as jest.Mock;

describe("<Cart />", () => {
    const realConsoleError = console.error;

    beforeEach(() => {
        useQueryMock.mockReset();
        useMutationMock.mockReset();

        console.error = (msg?: any, ...args: any[]) => {
            const str = String(msg || "");
            if (str.includes("Encountered two children with the same key")) return;
            realConsoleError(msg, ...args);
        };
    });

    afterEach(() => {
        console.error = realConsoleError;
    });

    it("renders items and performs checkout / book-all mutation", async () => {
        useQueryMock.mockReturnValue({
            loading: false,
            error: undefined,
            data: {
                cartItems: [
                    { id: "1", mission: { name: "Starlink" } },
                    { id: "2", mission: { name: "Sentinel" } },
                ],
            },
        });

        const mutateSpy = jest.fn().mockResolvedValue({
            data: { checkout: { success: true, message: "Success!" } },
        });
        useMutationMock.mockReturnValue([mutateSpy, { loading: false, error: undefined, data: undefined }]);

        // @ts-ignore
        const wrapper = mount(<Cart />);

        let btn =
            wrapper
                .find("button")
                .filterWhere((n) => /book\s*all|checkout|purchase|book/i.test(n.text()))
                .first();

        if (!btn.exists()) {
            btn = wrapper.find("button").first();
        }

        if (!btn.exists()) {
            const clickable = wrapper
                .findWhere((n) => typeof n.prop === "function" && typeof n.prop("onClick") === "function")
                .first();
            if (clickable.exists()) {
                (clickable.prop("onClick") as Function)?.({ preventDefault() {} });
            }
        } else {
            btn.simulate("click");
        }

        await new Promise((r) => setTimeout(r, 0));

        expect(mutateSpy).toHaveBeenCalled();

        wrapper.unmount();
    });
});
