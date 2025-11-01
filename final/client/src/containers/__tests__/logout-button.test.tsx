import React from "react";
import { mount } from "enzyme";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import LogoutButton from "../logout-button";
import { act } from "react-dom/test-utils";

function makeClient() {
    return new ApolloClient({ cache: new InMemoryCache() });
}

const realLocation = window.location;

beforeAll(() => {
    delete (window as any).location;
    (window as any).location = {
        href: "",
        reload: jest.fn(),
        assign: jest.fn(),
        replace: jest.fn(),
    } as unknown as Location;
});

afterAll(() => {
    (window as any).location = realLocation;
});

describe("<LogoutButton />", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
    });

    it("renders a clickable button", () => {
        const client = makeClient();
        const wrapper = mount(
            <ApolloProvider client={client}>
                <LogoutButton />
            </ApolloProvider>
        );

        const btn = wrapper.find("button");
        expect(btn.exists()).toBe(true);
        const label = btn.text().toLowerCase();
        expect(label.includes("logout") || label.includes("log out")).toBe(true);
    });

    it("removes the auth token on click (primary expected behavior)", async () => {
        localStorage.setItem("token", "test-token");
        const client = makeClient();

        const wrapper = mount(
            <ApolloProvider client={client}>
                <LogoutButton />
            </ApolloProvider>
        );

        expect(localStorage.getItem("token")).toBe("test-token");

        await act(async () => {
            wrapper.find("button").simulate("click");
            await Promise.resolve();
            await new Promise((r) => setTimeout(r, 0));
        });
        wrapper.update();

        expect(localStorage.getItem("token")).toBeNull();
    });

    it("is safe to click when no token is present (idempotent)", async () => {
        // no token set
        const client = makeClient();

        const wrapper = mount(
            <ApolloProvider client={client}>
                <LogoutButton />
            </ApolloProvider>
        );

        await act(async () => {
            expect(() => wrapper.find("button").simulate("click")).not.toThrow();
            await Promise.resolve();
            await new Promise((r) => setTimeout(r, 0));
        });
        wrapper.update();

        expect(localStorage.getItem("token")).toBeNull();
    });
});
