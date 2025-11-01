import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import { MemoryRouter } from "react-router-dom";
import CartItem, { GET_LAUNCH as EXPORTED_GET_LAUNCH } from "../cart-item";

const GET_LAUNCH =
    EXPORTED_GET_LAUNCH ||
    gql`
        query LaunchDetails($launchId: ID!) {
            launch(id: $launchId) {
                id
                site
                isBooked
                mission { name missionPatch }
                rocket { name }
            }
        }
    `;

const launchId = "109";

const successMock: MockedResponse = {
    request: { query: GET_LAUNCH, variables: { launchId } },
    result: {
        data: {
            launch: {
                __typename: "Launch",
                id: launchId,
                site: "CCAFS LC-40",
                isBooked: false,
                mission: {
                    __typename: "Mission",
                    id: "mission-" + launchId,
                    name: "Thaicom 6",
                    missionPatch: "http://x/patch.png",
                },
                rocket: {
                    __typename: "Rocket",
                    id: "rocket-" + launchId,
                    name: "Falcon 9",
                },
            },
        },
    },
};


const errorMock: MockedResponse = {
    request: { query: GET_LAUNCH, variables: { launchId: "bad-id" } },
    error: new Error("boom"),
};

describe("<CartItem />", () => {
    it("shows a loading state first", () => {
        const wrapper = mount(
            <MemoryRouter>
                <MockedProvider mocks={[successMock]} addTypename>
                    <CartItem launchId={launchId} />
                </MockedProvider>
            </MemoryRouter>
        );
        expect(wrapper.text().toLowerCase().includes("load")).toBe(true);
    });

    it("renders launch details after query resolves", async () => {
        const wrapper = mount(
            <MemoryRouter>
                <MockedProvider mocks={[successMock]} addTypename>
                    <CartItem launchId={launchId} />
                </MockedProvider>
            </MemoryRouter>
        );

        await act(async () => {
            await new Promise((r) => setTimeout(r, 0));
        });
        wrapper.update();

        const txt = wrapper.text();
        expect(txt.toLowerCase().includes("load")).toBe(false);
        expect(txt).toContain("Thaicom");
        expect(txt).toContain("Falcon");
    });

    it("renders an error state when the query fails", async () => {
        const wrapper = mount(
            <MemoryRouter>
                <MockedProvider mocks={[errorMock]} addTypename>
                    <CartItem launchId={"bad-id"} />
                </MockedProvider>
            </MemoryRouter>
        );

        await act(async () => {
            await new Promise((r) => setTimeout(r, 0));
        });
        wrapper.update();

        const txt = wrapper.text().toLowerCase();
        expect(txt.includes("error") || txt.includes("failed")).toBe(true);
    });
});
