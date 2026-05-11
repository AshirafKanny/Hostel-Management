import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBox = ({ history, context = "nav" }) => {
  const [keyword, setKeyword] = useState("");
  const isNav = context === "nav";
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push(`/`);
    }
  };
  return (
    <Form onSubmit={submitHandler} className={isNav ? "nav-search-form" : "page-search-form"}>
      <Form.Control
        type="text"
        value={keyword}
        name="q"
        placeholder="Search students..."
        className={isNav ? "nav-search-input" : "page-search-input"}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button
        className={isNav ? "nav-search-button" : "page-search-button"}
        type="submit"
        variant={isNav ? "outline-light" : "primary"}
      >
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
