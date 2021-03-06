/**
 * Event Card Component
 * Return a card thumbnail of an event.
 */

import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import "./EventCard.css";

// set up the class for EventCard component
class EventCard extends Component {
  constructor() {
    super();
    this.state = {
      photoName: [],
    };
  }

  componentDidMount() {
    this.loadEvent();
  }

  loadEvent = () => {
    fetch(
      "http://3.143.248.67:8080/events/get_photo/".concat(this.props.event.id)
    )
      .then((response) => response.json())
      .then((result) => {
        // fetched file name of the photo of this event, contained inside result
        const fileNameOfThisPhoto =
          result.photoFileNames[0]?.fileName ?? undefined;

        this.setState({ photoName: fileNameOfThisPhoto }, () => {});
      });
  };

  render() {
    let imgSource = this.state.photoName
      ? "http://3.143.248.67:8080/image/".concat(this.state.photoName)
      : "https://picsum.photos/200/300";

    return (
      <div className="card-container">
        <Card className="root">
          <CardActionArea>
            <CardMedia
              className="media"
              image={imgSource}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {this.props.event.name}
              </Typography>
              <Typography>
                {this.props.event.time
                  ? (function (dateTimeString) {
                      let dateTimeObject = new Date(dateTimeString);
                      console.log(dateTimeObject);

                      if (
                        dateTimeObject === undefined ||
                        Number.isNaN(dateTimeObject.getTime())
                      ) {
                        return "a";
                      }
                      return `${dateTimeObject.getFullYear()}-${(
                        dateTimeObject.getMonth() +
                        1 +
                        ""
                      ).padStart(2, "0")}-${(
                        dateTimeObject.getDate() + ""
                      ).padStart(2, "0")} ${(
                        dateTimeObject.getHours() + ""
                      ).padStart(2, "0")}:${(
                        dateTimeObject.getMinutes() + ""
                      ).padStart(2, "0")}`;
                    })(this.props.event.time)
                  : "00:00:00"}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {this.props.event.description?.length
                  ? this.props.event.description
                  : "Happy hiking!"}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions></CardActions>
        </Card>
      </div>
    );
  }
}
//export the event card
export default EventCard;
