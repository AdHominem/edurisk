import React, { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import UpdateQuestion from "./updateQuestion";
import Question from "./question";
import NewQuestion from "./newQuestion";

/**
 * Shows a single questionnaire
 * @returns {JSX.Element}
 * @constructor
 */
export default function Questionnaire() {
    const [questions, setQuestions] = useState([]);
    const [questionnaire, setQuestionnaire] = useState({
        title: "",
        description: "",
        questions: []
    });

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

    let { id } = useParams();

    async function getQuestionnaire() {
        const response = await fetch(`http://localhost:5000/questionnaire/${id}`);

        if (!response.ok) {
            const message = `An error occured: ${response.statusText}`;
            window.alert(message);
            return;
        }

        const questionnaire = await response.json();
        setQuestionnaire(questionnaire);
    }

    // Questions are being pulled from DB after rendering DOM
    useEffect(() => {
        getQuestions();
        getQuestionnaire();
        return;
    }, []);

    // This method will delete a question
    async function deleteQuestion(id) {
        await fetch(`http://localhost:5000/question/${id}`, {
            method: "DELETE"
        });

        await getQuestions();
    }

    // This method will map out the questions on the table
    function questionList() {
        return questionnaire.questions && questionnaire.questions.map((question) => {
            return (
                <Question
                    question={question}
                    questions={questions}
                    updateQuestion={updateQuestion}
                    deleteQuestion={() => deleteQuestion(question._id)}
                    key={question._id}
                />
            );
        });
    }

    // This function will handle the submission.
    async function updateQuestion(updatedQuestion) {

        console.log("Updating...");
        console.log(updatedQuestion);
        console.log(`http://localhost:5000/questionnaire/updateQuestion/${updatedQuestion._id}`);
        await fetch(`http://localhost:5000/questionnaire/updateQuestion/${updatedQuestion._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    question: updatedQuestion,
                    questionnaire: questionnaire
                }),
        })
            .catch(error => {
                console.log(error);
                window.alert(error);
                return;
            });

        await getQuestions();
    }

    // This function will handle the submission.
    async function addQuestion(newQuestion) {

        await fetch(`http://localhost:5000/questionnaire/addQuestion/${questionnaire._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: newQuestion,
                questionnaire: questionnaire
            }),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        await getQuestionnaire();
        await getQuestions();
    }

    // This following section will display the table with the questions of individuals.
    return (
        <div>
            <h3>Fragebogen "{questionnaire.title}"</h3>
            <p>{questionnaire.description}</p>
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>Titel</th>
                    <th>Fragestellung</th>
                    <th>Asset</th>
                    <th>Risk Rating</th>
                    <th>Antwortmöglichkeiten</th>
                    <th>Folgefrage</th>
                </tr>
                </thead>
                <tbody>
                {questionList()}
                <NewQuestion
                    createQuestion={addQuestion}
                    questions={questions}
                />
                </tbody>
            </table>
        </div>
    );
}
