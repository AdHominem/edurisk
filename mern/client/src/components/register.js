import React, { useState } from "react";
import { useNavigate } from "react-router";

const crypto = require("crypto");


export default function Register() {
    const [form, setForm] = useState({
        name: "",
        chair: "",
        email: "",
        password: "",
        passwordRepeat: "",
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
        const newPerson = { ...form };

        newPerson.password = crypto.createHash('sha256').update(newPerson.password).digest('hex');
        newPerson.passwordRepeat = crypto.createHash('sha256').update(newPerson.passwordRepeat).digest('hex');

        const response = await fetch("http://localhost:5000/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        const responseAsJSON = await response.json();
        const BAD_REQUEST = 400;
        const OK = 200;

        if (response.status === BAD_REQUEST) {
            alert(responseAsJSON.message)
            navigate("/register");
        }
        if (response.status === OK) {
            alert("Neuer Nutzer hinzugefügt!");
            navigate("/");
        }

    }

    // This following section will display the form that takes the input from the user.
    return (
        <div>
            <h3>Neuen Benutzer registrieren</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={form.name}
                        onChange={(e) => updateForm({ name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="chair">Lehrstuhl</label>
                    <input
                        type="text"
                        className="form-control"
                        id="chair"
                        value={form.chair}
                        onChange={(e) => updateForm({ chair: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Uni-E-Mail</label>
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
                    <label htmlFor="passwordRepeat">Passwort wiederholen</label>
                    <input
                        type="password"
                        className="form-control"
                        id="passwordRepeat"
                        value={form.passwordRepeat}
                        onChange={(e) => updateForm({ passwordRepeat: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="submit"
                        value="Registrieren"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}
