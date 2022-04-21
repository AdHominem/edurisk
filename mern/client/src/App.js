import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
import Register from "./components/register";
import Login from "./components/login";
import Questionnaire from "./components/questionnaire";
import CreateQuestion from "./components/createQuestion";
import Questions from "./components/questions";

const App = () => {
  return (
    <div>
      <Navbar />
      <div style={{ margin: 20 }}>
      <Routes>
        <Route exact path="/" element={<RecordList />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/createQuestion" element={<CreateQuestion />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
      </div>
    </div>
  );
};

export default App;
