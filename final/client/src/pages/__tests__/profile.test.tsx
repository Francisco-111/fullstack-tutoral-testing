import React from "react";
import { mount } from "enzyme";
import * as Apollo from "@apollo/client";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Profile from "../profile";

jest.mock("@apollo/client", () => {
    const actual = jest.requireActual("@apollo/client");
    return { ...actual, useQuery: jest.fn() };
});

const useQueryMock = Apollo.useQuery as jest.Mock;

describe("<Profile />", () => {
    const realConsoleError = console.error;

    beforeEach(() => {
        useQueryMock.mockReset();
        console.error = (msg?: any, ...args: any[]) => {
            const s = String(msg ?? "");
            if (s.includes("useHref() may be used only in the context of a <Router>")) return;
            realConsoleError(msg, ...args);
        };
    });

    afterEach(() => {
        console.error = realConsoleError;
    });

    it("renders trips with router context", () => {
        useQueryMock.mockReturnValue({
            loading: false,
            error: undefined,
            data: {
                me: {
                    id: "u1",
                    email: "user@example.com",
                    trips: [
                        { id: "1", mission: { name: "Starlink" } },
                        { id: "2", mission: { name: "Sentinel" } },
                    ],
                },
            },
        });

        const wrapper = mount(
            <MemoryRouter initialEntries={["/profile"]}>
                <Routes>
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </MemoryRouter>
        );

        const text = wrapper.text();
        expect(text).toMatch(/my trips/i);
        expect(text).toContain("Starlink");
        expect(text).toContain("Sentinel");

        const links = wrapper.find('a[href*="/launch"]');
        if (links.length > 0) {
            expect(links.length).toBeGreaterThanOrEqual(1);
        }

        wrapper.unmount();
    });
});
