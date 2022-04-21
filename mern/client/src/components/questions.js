import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router";


const Question = (props) => (
    <tr>
        <td>{props.question.title}</td>
        <td>{props.question.description}</td>
        <td>{props.question.answers}</td>
        <td>{props.question.followUp}</td>
        <td>
            <Link className="btn btn-link" to={`/edit/${props.question._id}`}>Edit</Link> |
            <button className="btn btn-link"
                    onClick={() => {
                        props.deleteQuestion(props.question._id);
                    }}
            >
                Delete
            </button>
        </td>
    </tr>
);

export default function Questions() {
    const [questions, setQuestions] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        answerType: "",
        followUp: ""
    });
    const navigate = useNavigate();

    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    // This method fetches the questions from the database.
    useEffect(() => {
        async function getQuestions() {
            const response = await fetch(`http://localhost:5000/question`);

            if (!response.ok) {
                const message = `An error occured: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const questions = await response.json();
            setQuestions(questions);
        }

        getQuestions();

        return;
    }, [questions.length]);

    // This method will delete a record
    async function deleteQuestion(id) {
        await fetch(`http://localhost:5000/${id}`, {
            method: "DELETE"
        });

        const newRecords = questions.filter((el) => el._id !== id);
        setQuestions(newRecords);
    }

    // This method will map out the questions on the table
    function questionList() {
        return questions.map((question) => {
            return (
                <Question
                    question={question}
                    deleteQuestion={() => deleteQuestion(question._id)}
                    key={question._id}
                />
            );
        });
    }

    console.log(form);

    // This function will handle the submission.
    async function onSubmit() {

        // When a post request is sent to the create url, we'll add a new record to the database.
        const newQuestion = { ...form };

        await fetch("http://localhost:5000/question/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newQuestion),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        setForm(
            {
                title: "",
                description: "",
                answerType: "",
                followUp: ""
            }
        );
        navigate("/questions");
    }

    // This following section will display the table with the questions of individuals.
    return (
        <div>
            <h3>Question List</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                <tr>
                    <th>Titel</th>
                    <th>Fragestellung</th>
                    <th>Antwortmöglichkeiten</th>
                    <th>Folgefrage</th>
                </tr>
                </thead>
                <tbody>{questionList()}</tbody>
                <tr>
                    <td>
                        <input
                            type="text"
                            placeholder="Fragentitel"
                            className="form-control"
                            id="title"
                            value={form.title}
                            onChange={(e) => updateForm({ title: e.target.value })}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            placeholder="Frage"
                            className="form-control"
                            id="description"
                            value={form.description}
                            onChange={(e) => updateForm({ description: e.target.value })}
                        />
                    </td>
                    <td>
                        <select
                            className="form-control"
                            id={"answerSelect"}
                            value={form.answerType}
                            onChange={(e) => updateForm({ answerType: e.target.value })}
                        >
                            <option value="" selected disabled hidden>Antwortmöglichkeit wählen</option>
                            <option value={"binary"}>Binär</option>
                            <option value={"freeText"}>Freitext</option>
                        </select>
                    </td>
                    <td>
                        <select
                            className="form-control"
                            id={"followUp"}
                            value={form.followUp}
                            onChange={(e) => updateForm({ followUp: e.target.value })}
                        >
                            <option value="" selected disabled hidden>Folgefrage auswählen</option>
                            {questions.map(question => <option value={question.title}>{question.title}</option>)}
                            <option value="">Keine</option>
                        </select>
                    </td>
                    <td>
                        <button type={"button"} onClick={onSubmit} className="btn btn-primary">Frage hinzufügen</button>
                    </td>
                </tr>
            </table>
        </div>
    );
}
