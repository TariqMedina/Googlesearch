import React, { Component } from "react";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, FormBtn } from "../components/Form";
import { socket, subscribeToTimer, savenew } from '../utils/Socket';

class Search extends Component {
  state = {
    books: [],
    title: "",
    author: "",
    synopsis: "",
    results: [],
    timestamp: 'no timestamp yet'
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
    socket.on('saveNew', ()=> console.log("Test"));
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
      )
      .catch(err => console.log(err));
  };

  compare() {
    let arr = [...arguments];
    return arr.shift().filter(y =>
      arr.every(x => x.some(j => j.Id === y.Id))
    )
  };

  loadSearch = (res) => {
    // console.log(res.data.items[0].volumeInfo.imageLinks.smallThumbnail)
    var books = res.data.items;
    API.getBooks()
      .then(allBooks => {

        let mybooks = books.map(book => {
          if (allBooks.data.find(x => x.googleId === book.id)) {
            book.saved = true;
            return book;
          }
          else {
            book.saved = false;
            return book;
          }
        })
        console.log(mybooks)
        this.setState({ results: books })
      }
      )

};

handleInputChange = event => {
  const { name, value } = event.target;
  this.setState({
    [name]: value
  });
};

handleFormSubmit = event => {
  event.preventDefault();
  if (this.state.title) {
    API.searchBook(
      this.state.title,
    )
      .then(res => this.loadSearch(res))
      // .then(res => console.log(res))
      .catch(err => console.log(err));
  }
};

handleSave = (book) => {
  var synopsis = "";
  var image = "";
  if (book.volumeInfo.imageLinks) {
    image = book.volumeInfo.imageLinks.smallThumbnail;
  }
  else {
    image = "No image available"
  }
  if (book.searchInfo) {
    synopsis = book.searchInfo.textSnippet;
  }
  else {
    synopsis = "No description available";
  }
  var authors = JSON.stringify(book.volumeInfo.authors)
  API.saveBook({
    googleId: book.id,
    title: book.volumeInfo.title,
    author: authors,
    synopsis: synopsis,
    image: image,
    link: book.volumeInfo.infoLink
  })
    .then(res => {
      socket.emit('newSave', 1000);
      var results = this.state.results;
      var myIndex = results.findIndex(x => x.id === book.id);
      console.log(myIndex)
      results[myIndex].saved = true;
      this.setState({
        results: results
      })
    })
    .catch(err => console.log(err));
    
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
            <h1>Search Books</h1>
          </Jumbotron>
          <form className="form-inline">
            <div className="form-group">
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                name="title"
                placeholder="Title (required)"
              />
              <FormBtn
                disabled={!(this.state.title)}
                onClick={this.handleFormSubmit}
              >
                Search Book
              </FormBtn>
            </div>
          </form>
          <Row>
            <List>
              {this.state.results.map(book => (
                <ListItem key={book.id}>
                  {/* <Link to={"/books/" + book._id}> */}
                  <Row>

                    <div className="col-md-3 resultDiv" key={book.id}>
                      <img style={{ maxHeight: "100px" }} src={book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.smallThumbnail : "https://via.placeholder.com/60x100.png"} />
                    </div>
                    <div className="col-md-9" key={book.id + "1"}>
                      <strong>
                        <a href={book.volumeInfo.infoLink} target="_blank">
                          {book.volumeInfo.title} by {book.volumeInfo.authors[0]}
                        </a>
                      </strong>
                      <p>{book.searchInfo ? book.searchInfo.textSnippet : "No description available"}</p>
                    </div>
                    {/* </Link> */}
                    <button className={book.saved ? "btn btn-success" : "btn btn-primary"} disabled={book.saved ? true : false} onClick={() => this.handleSave(book)}>{book.saved ? "Book Saved" : "Save Book"}</button>
                  </Row>
                </ListItem>
              ))}
            </List>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
}

export default Search;
