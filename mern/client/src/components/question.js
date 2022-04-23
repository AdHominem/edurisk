import {Link} from "react-router-dom";
import React, {useState} from "react";
import UpdateQuestion from "./updateQuestion";
import {queries} from "@testing-library/react";


export default function Question(props) {
    const [isEdited, setIsEdited] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        answerType: "",
        followUp: ""
    });

    // These methods will update the state properties. It's necessary because of nested state
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    console.log(isEdited);

    function handleClick() {
        setIsEdited(true);
    }

    return (
        <tr>
            <td>{props.question.title}</td>
            <td>{props.question.description}</td>
            <td>{props.question.answerType}</td>
            <td>{props.question.followUp}</td>
            <td>
                <button className="btn btn-link" onClick={handleClick}>Bearbeiten</button>
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