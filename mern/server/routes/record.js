const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  db_connect
    .collection("records")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("records")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    position: req.body.position,
    level: req.body.level,
  };
  db_connect.collection("records").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you register a new user.
recordRoutes.route("/user/register").post(function (req, response) {

  // Server side validation
  const {email, password, passwordRepeat} = req.body;

  if (!email.endsWith("@fau.de")) {
    response.status(400).send({message: "Ungültige Email!"})
  } else if (password !== passwordRepeat) {
    response.status(400).send({message: "Passwort stimmt nicht mit wiederholtem Passwort überein."})
  } else {
    let db_connect = dbo.getDb();
    db_connect.collection("users").findOne({email: req.body.email}, (err, user) => {
      if (user) {
        response.status(400).send({message: "Nutzer existiert bereits mit dieser Email."});
      } else {
        let myobj = {
          name: req.body.name,
          chair: req.body.chair,
          email: req.body.email,
          password: req.body.password,
        };

        db_connect.collection("users").insertOne(myobj, function (err, res) {
          if (err) throw err;
          response.json(res);
        });
      }
    });
  }
});

// This section will help you get a list of all the questionnaires.
recordRoutes.route("/questionnaire").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
      .collection("questionnaires")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new questionnaire.
recordRoutes.route("/questionnaire/create").post(function (req, response) {

  const {title, description} = req.body;

  if (!title) {
    response.status(400).send({message: "Fragebogen darf keinen leeren Titel enthalten."})
  }

  let db_connect = dbo.getDb();

  db_connect.collection("questionnaires").findOne({title: title}, (err, question) => {
    if (question) {
      response.status(400).send({message: "Fragebogen mit diesem Titel existiert bereits"});
    } else {
      let newQuestionnaire = {
        title: title,
        description: description,
        questions: []
      };

      db_connect.collection("questionnaires").insertOne(newQuestionnaire, function (err, res) {
        if (err) throw err;
        response.json(res);
      });
    }
  });
});

// This section will help you get a single questionnaire by id
recordRoutes.route("/questionnaire/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("questionnaires")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you delete a questionnaire
recordRoutes.route("/questionnaire/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = {_id: ObjectId(req.params.id)};
  db_connect.collection("questionnaires").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 questionnaire deleted");
    response.json(obj);
  });
});

// This section will help you update a questionnaire by id.
recordRoutes.route("/questionnaire/update/:id").post(function (req, response) {

  const {id, title, description, questions} = req.body;

  if (!title) {
    response.status(400).send({message: "Fragebogen muss einen Titel haben."})
  }

  let db_connect = dbo.getDb();
  let oldQuestionnaire = {_id: ObjectId(req.params.id)};
  let newValues = {
    $set: {
      title: title,
      description: description,
      questions: questions
    }
  };

  db_connect
      .collection("questionnaires")
      .updateOne(oldQuestionnaire, newValues, function (err, res) {
        if (err) throw err;
        console.log("1 questionnaire updated");
        response.json(res);
      });
});

// This section will help you add a new question to an existing questionnaire.
recordRoutes.route("/questionnaire/addQuestion/:id").post(function (req, response) {
  const {title, description, answerType, followUp, asset, riskRating} = req.body.question;
  const {questions} = req.body.questionnaire;

  if (!title || !description || !answerType || !asset || !riskRating) {
    response.status(400).send({message: "Frage darf keine leeren Felder enthalten."})
  }

  if (questions.some((question) => question.title === title)) {
    response.status(400).send({message: "Frage mit diesem Titel existiert bereits"});
  } else {
    let newQuestion = {
      title: title,
      description: description,
      answerType: answerType,
      followUp: followUp,
      asset: asset,
      riskRating: riskRating
    };

    let db_connect = dbo.getDb();

    db_connect.collection("questions").insertOne(newQuestion, function (err, res) {
      if (err) throw err;
      console.log(res.ops[0]);

      db_connect
          .collection("questionnaires")
          .updateOne({_id: ObjectId(req.params.id)}, {$push:{"questions": res.ops[0]}}, function (err, res) {
            if (err) throw err;
            console.log("1 questionnaire updated");
            response.json(res);
          });
    });
  }

});

// This section will help you get a list of all the questions.
recordRoutes.route("/question").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  db_connect
      .collection("questions")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new question.
recordRoutes.route("/question/create").post(function (req, response) {

    const {title, description, answerType, followUp} = req.body;

    if (!title || !description || !answerType) {
      response.status(400).send({message: "Frage darf keine leeren Felder enthalten."})
    }

    let db_connect = dbo.getDb();

    db_connect.collection("questions").findOne({title: title}, (err, question) => {
      if (question) {
        response.status(400).send({message: "Frage mit diesem Titel existiert bereits"});
      } else {
        let newQuestion = {
          title: title,
          description: description,
          answerType: answerType,
          followUp: followUp
        };

        db_connect.collection("questions").insertOne(newQuestion, function (err, res) {
          if (err) throw err;
          response.json(res);
        });
      }
    });
  });

// This section will help you update a question by id.
recordRoutes.route("/question/update/:id").post(function (req, response) {

  const {id, title, description, answerType, followUp} = req.body.question;

  if (!title || !description || !answerType) {
    response.status(400).send({message: "Frage darf keine leeren Felder enthalten."})
  }

  let db_connect = dbo.getDb();
  let oldQuestion = {_id: ObjectId(req.params.id)};
  let newValues = {
    $set: {
      title: title,
      description: description,
      answerType: answerType,
      followUp: followUp
    }
  };

  db_connect
      .collection("questions")
      .updateOne(oldQuestion, newValues, function (err, res) {
        if (err) throw err;
        console.log("1 question updated");
        response.json(res);
      });


}
);

// This section will help you delete a question
recordRoutes.route("/question/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = {_id: ObjectId(req.params.id)};
  db_connect.collection("questions").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 question deleted");
    response.json(obj);
  });
});

// This section will help you log in an existing user.
  recordRoutes.route("/user/login").post(function (req, response) {
    let db_connect = dbo.getDb();

    db_connect.collection("users").findOne({email: req.body.email, password: req.body.password}, (err, user) => {
      if (user) {
        response.send({message: "User exists", user: user});
      } else {
        response.status(401).send({message: "User or Password are not correct"});
      }
    });
  });





module.exports = recordRoutes;
