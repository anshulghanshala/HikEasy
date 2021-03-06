/**
 * Comments Component
 * React components for the review textbox in the trailpage.
 */

import React, { Component } from "react";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import { Button, Comment, Form, Header } from "semantic-ui-react";
import firebase from "firebase";
import firebaseJwtManager from "../services/firebaseJwtManager";

import "./Comments.css";
import http from "../services/http-common";

//export the class of <Comments>
class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newComments: [],
      rating: [],
    };
  }
  //function for setting rating
  setRating = (value) => {
    this.setState({ rating: value });
  };

  handleChange = (e, { value }) => {
    this.setState({ newComments: value });
  };
  //post the comment
  postComment = () => {
    let formData = new FormData();
    // formData.append("userID", 3);
    formData.append("rating", this.state.rating);
    formData.append("comment", this.state.newComments);

    let tProps = this.props;
    let commentSectionReloadComments = () => {
      console.log("reload");
      tProps.reloadComments();
    };

    // Get JWT for backend verification
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        // Send token to backend via HTTPS
        console.log(idToken);

        console.log(tProps.trail.id);

        // Post here
        http
          .post(
            "http://3.143.248.67:8080/review/publish_review/" + tProps.trail.id,
            formData,
            {
              headers: {
                authorization: "Bearer " + idToken,
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            console.log(response);
            commentSectionReloadComments();
          });
      })
      .catch(function (error) {
        // Handle error
        console.log(error);
      });
  };
  //render out the comment and style to the reviewbox
  render() {
    let reviews = this.props.reviews;

    return (
      <Comment.Group>
        <div className="comment-display-section">
          <Header as="h3" dividing>
            Comments
          </Header>
          {reviews.map((item) => (
            <div className="review-block">
              <Comment>
                <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/christian.jpg" />
                <Comment.Content>
                  <Comment.Author as="a">
                    {item.user.firstName} {item.user.lastName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                  </Comment.Metadata>
                  <Comment.Text>{item.comment}</Comment.Text>
                  {/* <Comment.Actions>
                  <Comment.Action> Reply </Comment.Action>
                </Comment.Actions> */}
                </Comment.Content>
              </Comment>
              <div>
                <Typography component="legend">Rated</Typography>
                <Rating
                  name="read-only"
                  value={item.rating}
                  size="medium"
                  readOnly
                />
              </div>
            </div>
          ))}
        </div>
        {firebaseJwtManager.getToken() ? (
          <Form clasName="add-comment">
            <Form.Group>
              <Form.TextArea
                placeholder="Share your views!"
                name="name"
                // value={coommen}
                onChange={this.handleChange}
              />
              <div className="comment-buttons">
                <div>
                  <Typography component="legend">Rate this trail!</Typography>
                  <Rating
                    size="large"
                    name="simple-controlled"
                    onChange={(event, newValue) => {
                      this.setRating(newValue);
                    }}
                  />
                </div>
                <Button content="Submit" onClick={this.postComment} />
              </div>
            </Form.Group>
          </Form>
        ) : null}
      </Comment.Group>
    );
  }
}
//export the Comments
export default Comments;
