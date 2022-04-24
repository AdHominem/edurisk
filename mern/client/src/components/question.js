import {Link} from "react-router-dom";
import React, {useState} from "react";
import UpdateQuestion from "./updateQuestion";
import {queries} from "@testing-library/react";

/**
 * Every question has its own edit button and thus its own edit state determining whether it is edited or not.
 * An edited question will display UpdateQuestion instead of the regular Question.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Question(props) {
    const [isEdited, setIsEdited] = useState(false);

    const questions = 1;
    const onSubmit = 1;

    console.log(isEdited);

    function handleClick() {
        setIsEdited(true);
    }

    function updateQuestion(question) {
        props.updateQuestion(question);
        setIsEdited(false);
    }

    return (
        isEdited ?
            <UpdateQuestion
                question={props.question}
                questions={props.questions}
                updateQuestion={updateQuestion}
                cancelUpdate={() => setIsEdited(false)}
            />
            :
            <tr>
                <td>{props.question.title}</td>
                <td>{props.question.description}</td>
                <td>{props.question.answerType}</td>
                <td>{props.question.followUp}</td>
                <td>
                    <button className="btn btn-link" onClick={handleClick}>Bearbeiten</button>
                </td>
                <td>
                    <button className="btn btn-link"
                            onClick={() => {
                                props.deleteQuestion(props.question._id);
                            }}>
                        Löschen
                    </button>
                </td>
            </tr>
    );
}