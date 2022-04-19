import React, { useState } from "react";
import { useNavigate } from "react-router";

const crypto = require("crypto");


export default function Login() {
    const [form, setForm] = useState({
        mail: "",
        password: ""
    });
    const navigate = useNavigate();

    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();

        // When a post request is sent to the create url, we'll add a new record to the database.
        const credentials = { ...form };

        credentials.password = crypto.createHash('sha256').update(credentials.password).digest('hex');

        const response = await fetch("http://localhost:5000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        const responseAsJSON = await response.json();

        const UNAUTHORIZED = 401;
        const OK = 200;

        if (response.status === UNAUTHORIZED) {
            window.alert(responseAsJSON.message);
            navigate("/login");
        }
        if (response.status === OK) {
            navigate("/");
        }
    }

    // This following section will display the form that takes the input from the user.
    return (
        <div>
            <h3>Login</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Uni-Mail</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Passwort</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="submit"
                        value="Login"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}
