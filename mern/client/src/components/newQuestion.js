import React, {useEffect, useState} from "react";

/**
 * This component displays a form which can be used to create a question
 * @param props contains the questions existing for the followUp selection.
 */
export default function NewQuestion(props) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        answerType: "",
        followUp: "",
        asset: "",
        riskRating: ""
    });

    // These methods will update the state properties. It's necessary because of nested state
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    function submitNewQuestion() {
        props.createQuestion(form);
        setForm({
            title: "",
            description: "",
            answerType: "",
            followUp: "",
            asset: "",
            riskRating: ""
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
                <input
                    type="text"
                    placeholder="Asset"
                    className="form-control"
                    id="asset"
                    value={form.asset}
                    onChange={(e) => updateForm({ asset: e.target.value })}
                />
            </td>
            <td>
                <input
                    type="text"
                    placeholder="Risk Rating"
                    className="form-control"
                    id={form.riskRating}
                    value={form.riskRating}
                    onChange={(e) => updateForm({ riskRating: e.target.value })}
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
                    {props.questions.map(question => <option key={question._id} value={question.title}>{question.title}</option>)}
                    <option value="">Keine</option>
                </select>
            </td>
            <td>
                <button type={"button"} onClick={() => submitNewQuestion()} className="btn btn-primary">Frage hinzufügen</button>
            </td>
            <td>

            </td>
        </tr>
    )

}