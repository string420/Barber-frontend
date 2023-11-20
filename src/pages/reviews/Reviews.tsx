import axios from "axios";
import { AppointmentRatingInterface } from "../../Types";
import "./Reviews.css";
import { useQuery } from "react-query";
import Rating from "@mui/material/Rating";

const Reviews = () => {
  const { data } = useQuery<AppointmentRatingInterface[]>({
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
      {data?.map((barber, key) => (
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
              <h1>Barber Name: {barber._id}</h1>
              <h1>
                Barber Rating:
                <Rating
                  name="simple-controlled"
                  value={barber.averageRating}
                  readOnly
                  size="large"
                />
              </h1>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Reviews;
