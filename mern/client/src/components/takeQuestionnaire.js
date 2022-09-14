import React, { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import UpdateQuestion from "./updateQuestion";
import Question from "./question";
import NewQuestion from "./newQuestion";

/**
 * Allows taking the questionnaire
 * @returns {JSX.Element}
 * @constructor
 */
export default function TakeQuestionnaire() {
    const [questionnaire, setQuestionnaire] = useState({
        title: "",
        description: "",
        questions: []
    });

    async function getQuestionnaire() {
        const response = await fetch(`http://localhost:5000/questionnaire/take`);

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
        getQuestionnaire();
        return;
    }, []);

    function askQuestion() {

    }

    // This following section will display one question after another
    return (
        <div>
            { questionnaire === null ? <div>Aktuell keine Umfrage verfügbar</div> :
                <div>
                    <h3>Fragebogen "{questionnaire.title}"</h3>
                    <p>{questionnaire.description}</p>
                </div>
            }
        </div>
    );
}
