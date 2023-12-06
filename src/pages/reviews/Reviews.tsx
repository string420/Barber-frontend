import axios from "axios";
import { AppointmentInterface, AppointmentRatingInterface } from "../../Types";
import "./Reviews.css";
import { useQuery } from "react-query";
import Rating from "@mui/material/Rating";

const Reviews = () => {
  const { data: rating } = useQuery<AppointmentRatingInterface[]>({
    queryKey: ["Reviews"],
    queryFn: () =>
      axios
        .get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/appointment/calculate/ratings`
        )
        .then((res) => res.data),
  });

  const { data: barberAppointmentComents } = useQuery<AppointmentInterface[]>({
    queryKey: ["Comments"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/appointment`)
        .then((res) => res.data),
  });

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        color: "white",
        alignItems: "center",

        flexDirection: "column",
      }}
    >
      <h1>Barber overall rating</h1>
      {rating?.map((barber, key) => (
        <div
          key={key}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            border: "1px solid white",
            maxWidth: "1100px",
            width: "100%",
            paddingLeft: "20px",
          }}
        >
          {barber.averageRating !== null && (
            <>
              <h2>Barber Name: {barber._id}</h2>
              <h2>
                Barber Rating:
                <Rating
                  name="simple-controlled"
                  value={barber.averageRating}
                  readOnly
                  size="large"
                />
              </h2>
            </>
          )}
        </div>
      ))}

      <h1>Comments</h1>
      {barberAppointmentComents?.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid black",
            display: "flex",

            flexDirection: "column",
            maxWidth: "1100px",
            width: "100%",
            padding: "20px",
          }}
        >
          <div
            style={{
              paddingLeft: "50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span>Barber Name: {item.barberName}</span>
            <Rating
              name="simple-controlled"
              value={item.barberRating}
              readOnly
              size="large"
            />
            <span>Comment: {item.comment}</span>
          </div>
          <hr style={{ width: "100%" }} />
        </div>
      ))}
    </div>
  );
};

export default Reviews;
