import React, {useEffect, useState} from "react";

/**
 * This component displays a form which can be used to create and update questions
 * @param props contains the question to be created or updated and the questions existing for the followUp selection
 */
export default function UpdateQuestion(props) {
    const [question, setQuestion] = useState({
        title: "",
        description: "",
        answerType: "",
        followUp: ""
    });

    // Update the local state with the question to update
    useEffect(() => {
        updateQuestion({
            title: props.question.title,
            description: props.question.description,
            answerType: props.question.answerType,
            followUp: props.question.followUp,
        })
    }, [props.question.title, props.question.description, props.question.answerType, props.question.followUp])

    console.log(question);

    // These methods will update the state properties. It's necessary because of nested state
    function updateQuestion(value) {
        return setQuestion((prev) => {
            return { ...prev, ...value };
        });
    }

    function submitUpdate() {
        props.onSubmit(question);
        setQuestion({
            title: "",
            description: "",
            answerType: "",
            followUp: ""
        });
    }

    return (
        <tr>
            <td>
                <input
                    type="text"
                    placeholder="Fragentitel"
                    className="form-control"
                    id="title"
                    value={question.title}
                    onChange={(e) => updateQuestion({ title: e.target.value })}
                />
            </td>
            <td>
                <input
                    type="text"
                    placeholder="Frage"
                    className="form-control"
                    id="description"
                    value={question.description}
                    onChange={(e) => updateQuestion({ description: e.target.value })}
                />
            </td>
            <td>
                <select
                    className="form-control"
                    id={"answerSelect"}
                    value={question.answerType}
                    onChange={(e) => updateQuestion({ answerType: e.target.value })}
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
                    value={question.followUp}
                    onChange={(e) => updateQuestion({ followUp: e.target.value })}
                >
                    <option value="" selected disabled hidden>Folgefrage auswählen</option>
                    {props.questions.map(question => <option key={question._id} value={question.title}>{question.title}</option>)}
                    <option value="">Keine</option>
                </select>
            </td>
            <td>
                <button type={"button"} onClick={() => submitUpdate()} className="btn btn-primary">Frage hinzufügen</button>
            </td>
        </tr>
    )

}