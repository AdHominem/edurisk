import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router";
import UpdateQuestion from "./updateQuestion";


function Question(props) {
    return (
        <tr>
            <td>{props.question.title}</td>
            <td>{props.question.description}</td>
            <td>{props.question.answerType}</td>
            <td>{props.question.followUp}</td>
            <td>
                <button className="btn btn-link" onClick={props.handleClick}>Bearbeiten</button>
                <button className="btn btn-link"
                        onClick={() => {
                            props.deleteQuestion(props.question._id);
                        }}
                >
                    Löschen
                </button>
            </td>
        </tr>
    );
}

export default function Questions() {
    const [questions, setQuestions] = useState([]);

    // This method fetches the questions from the database.
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

    // Questions are being pulled from DB after rendering DOM
    useEffect(() => {
        getQuestions();
        return;
    }, [questions.length]);

    // This method will delete a question
    async function deleteQuestion(id) {
        await fetch(`http://localhost:5000/question/${id}`, {
            method: "DELETE"
        });

        await getQuestions();
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

    // This function will handle the submission.
    async function updateQuestion(updatedQuestion) {

        await fetch("http://localhost:5000/question/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedQuestion),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        await getQuestions();
    }

    // This following section will display the table with the questions of individuals.
    return (
        <div>
            <h3>Fragenkatalog</h3>
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>Titel</th>
                    <th>Fragestellung</th>
                    <th>Antwortmöglichkeiten</th>
                    <th>Folgefrage</th>
                </tr>
                </thead>
                <tbody>
                    {questionList()}
                    <UpdateQuestion question={{title: "New", description: "Lol", answerType: "binary", followUp: undefined}} questions={questions} onSubmit={updateQuestion}/>
                {/*TODO: Switch between UpdateQuestion and Question component depending on whether Edit was clicked*/}
                </tbody>
            </table>
        </div>
    );
}
