// src/components/__tests__/footer.test.tsx
import React from "react";
import { shallow } from "enzyme";
import Footer from "../footer";

// If LogoutButton is exported and used directly inside Footer, you can import it:
// import LogoutButton from "../logout-button";

describe("<Footer />", () => {
    it("renders nav links", () => {
        const wrapper = shallow(<Footer />);
        const text = wrapper.text();
        expect(text).toContain("Home");
        expect(text).toContain("Cart");
        expect(text).toContain("Profile");
    });

    it("renders a logout control", () => {
        const wrapper = shallow(<Footer />);

        // Option A: If there's a LogoutButton component:
        // expect(wrapper.find(LogoutButton).exists()).toBe(true);

        // Option B: Fallback to text-based check if LogoutButton isn't directly importable:
        const text = wrapper.text().toLowerCase();
        expect(text).toMatch(/logout/); // or the component’s label if different
    });

    it("matches snapshot", () => {
        const wrapper = shallow(<Footer />);
        expect(wrapper).toMatchSnapshot();
    });
});
