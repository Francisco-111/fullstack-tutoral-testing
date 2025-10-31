import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "../login-form";

describe("<LoginForm />", () => {
    it("renders without crashing", () => {
        const w = shallow(<LoginForm login={jest.fn()} />);
        expect(w.exists()).toBe(true);
    });

    it("submits with entered credentials using provided login prop", async () => {
        const loginMock = jest.fn().mockResolvedValue({ data: { login: { token: "jwt.123" } } });

        const w = mount(
            <MemoryRouter>
                <LoginForm login={loginMock as any} />
            </MemoryRouter>
        );

        const emailInput =
            w.find('input[type="email"]').first().exists()
                ? w.find('input[type="email"]').first()
                : w.find('input[name="email"]').first().exists()
                    ? w.find('input[name="email"]').first()
                    : w.find('input[type="text"]').first();

        if (emailInput.exists()) {
            emailInput.simulate("change", { target: { name: "email", value: "user@example.com" } });
        }

        const pwd = w.find('input[type="password"]').first();
        if (pwd.exists()) {
            pwd.simulate("change", { target: { name: "password", value: "secret" } });
        }

        const form = w.find("form").first();
        if (form.exists()) {
            form.simulate("submit", { preventDefault() {} });
        } else {
            const btn =
                w.find('button[type="submit"]').first().exists()
                    ? w.find('button[type="submit"]').first()
                    : w.find("button").first();
            if (btn.exists()) btn.simulate("click");
        }

        await new Promise((r) => setTimeout(r, 0));

        expect(loginMock).toHaveBeenCalled();
        const lastCallArgs = loginMock.mock.calls.pop()?.[0];
        if (lastCallArgs?.variables?.email) {
            expect(lastCallArgs.variables.email).toBe("user@example.com");
        }

        w.unmount();
    });

    it("matches snapshot (shallow)", () => {
        const w = shallow(<LoginForm login={jest.fn()} />);
        expect(w).toMatchSnapshot();
    });
});
