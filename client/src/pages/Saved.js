import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { savenew, socket, subscribeToTimer } from '../utils/Socket';

class Saved extends Component {
  state = {
    books: [],
    timestamp: 'no timestamp'
  };

  constructor(props) {
    super(props);
    subscribeToTimer((err, timestamp) => this.setState({
      timestamp
    }));
    savenew();
  }

  componentDidMount() {
    this.loadBooks();
    socket.on('saveNew', this.loadBooks)
  }
  componentWillUnmount() {
    socket.off('saveNew');
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data })
      )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };


  render() {
    return (
      <Container fluid>
        <div className="App">
          <p className="App-intro">
            This is the timer value: {this.state.timestamp}
          </p>
        </div>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <Row>
                    <Col size="md-3">
                      <img src={book.image} className="m-2" style={{ maxHeight: "200px" }}></img>
                    </Col>
                    <Col size="md-9">
                      <ListItem key={book._id}>

                        <h3>Title: {book.title + "\n"}</h3>
                        <p>Author: {book.author}</p>
                        <p>Description: {book.synopsis + "\n"}</p>
                        <p>Link: {book.link + "\n"}</p>
                        <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                      </ListItem>
                    </Col>
                  </Row>
                ))}
              </List>
            ) : (
                <h3>No Results to Display</h3>
              )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Saved;
