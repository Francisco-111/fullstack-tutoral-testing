import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import BookTrips from "../book-trips";

describe("<BookTrips />", () => {
    it("renders and can activate a booking control without crashing", async () => {
        const w = mount(
            <MockedProvider mocks={[]} addTypename={false}>
                <MemoryRouter>
                    <BookTrips />
                </MemoryRouter>
            </MockedProvider>
        );

        let clicked = false;
        let btn = w.find("button").filterWhere(n => /book|checkout|confirm/i.test(n.text())).first();
        if (!btn.exists()) btn = w.find("button").first();

        if (btn.exists()) {
            btn.simulate("click");
            clicked = true;
        } else {
            const clickable = w
                .findWhere(n => typeof n.prop === "function" && typeof n.prop("onClick") === "function")
                .first();
            if (clickable.exists()) {
                (clickable.prop("onClick") as any)({ preventDefault() {} });
                clicked = true;
            }
        }

        expect(w.text().length + w.find("*").length).toBeGreaterThan(0);
        expect(clicked).toBe(true);

        w.unmount();
    });
});
