import React, {useEffect, useState} from "react";
import Questionnaire from "./questionnaire";
import * as PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";



function NewQuestionnaire(props) {
    const [form, setForm] = useState({
        title: "",
        description: ""
    });

    // These methods will update the state properties. It's necessary because of nested state
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    function submitNewQuestionnaire() {
        props.createQuestionnaire(form);
        setForm({
            title: "",
            description: ""
        });
    }

    return <tr>
        <td>
            <input
                type="text"
                placeholder="Fragebogentitel"
                className="form-control"
                id="title"
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
            />
        </td>
        <td>
            <input
                type="text"
                placeholder="Beschreibung"
                className="form-control"
                id="description"
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
            />
        </td>
        <td>
            <button type={"button"} onClick={() => submitNewQuestionnaire()} className="btn btn-primary">Fragebogen erstellen</button>
        </td>
        <td>

        </td>
    </tr>;
}

NewQuestionnaire.propTypes = {createQuestionnaire: PropTypes.func};
export default function Questionnaires() {
    const [questionnaires, setQuestionnaires] = useState([]);

    let navigate = useNavigate();

    // This method fetches the questionnaires from the database.
    async function getQuestionnaires() {
        const response = await fetch(`http://localhost:5000/questionnaire`);

        if (!response.ok) {
            const message = `An error occured: ${response.statusText}`;
            window.alert(message);
            return;
        }

        const questionnaires = await response.json();
        setQuestionnaires(questionnaires);
    }

    // Questions are being pulled from DB after rendering DOM
    useEffect(() => {
        getQuestionnaires();
        return;
    }, [questionnaires.length]);

    // This method will delete a question
    async function deleteQuestionnaire(id) {
        await fetch(`http://localhost:5000/questionnaire/${id}`, {
            method: "DELETE"
        });

        await getQuestionnaires();
    }

    // This method will map out the questionnaires on the table
    function questionnaireList() {
        return questionnaires.map((questionnaire) => {
            return (
                <tr key={questionnaire._id}>
                    <td>{questionnaire.title}</td>
                    <td>{questionnaire.description}</td>
                    <td>
                        <button className="btn btn-link"
                                onClick={     () =>
                                    navigate(`/questionnaire/${questionnaire._id}`, { questionnaire: questionnaire})
                                }>
                            Bearbeiten
                        </button>
                    </td>
                    <td>
                        <button className="btn btn-link"
                                onClick={async () => {
                                    await deleteQuestionnaire(questionnaire._id);
                                }}>
                            Löschen
                        </button>
                    </td>
                </tr>
            );
        });
    }

    // This function will handle the submission.
    async function updateQuestionnaire(updatedQuestionnaire) {

        console.log("Updating...");
        console.log(updatedQuestionnaire);
        console.log(`http://localhost:5000/questionnaire/update/${updatedQuestionnaire._id}`);
        await fetch(`http://localhost:5000/questionnaire/update/${updatedQuestionnaire._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedQuestionnaire),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        await getQuestionnaires();
    }

    // This function will handle the submission.
    async function createQuestionnaire(newQuestionnaire) {

        await fetch("http://localhost:5000/questionnaire/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newQuestionnaire),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        await getQuestionnaires();
    }

    // This following section will display the table with the questionnaires of individuals.
    return (
        <div>
            <h3>Fragebögen</h3>
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>Titel</th>
                    <th>Beschreibung</th>
                </tr>
                </thead>
                <tbody>
                {questionnaireList()}
                <NewQuestionnaire
                    createQuestionnaire={createQuestionnaire}
                />
                </tbody>
            </table>
        </div>
    );
}
