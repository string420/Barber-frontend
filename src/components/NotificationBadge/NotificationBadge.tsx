import { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import { useQuery } from "react-query";
import { AppointmentInterface, UserInterface } from "../../Types";
import useAuthStore from "../../zustand/AuthStore";
import axios from "axios";
import "./NotificationBadge.css";

function NotificationBadge() {
  const [appointmentList, setAppointmentList] =
    useState<AppointmentInterface[]>();

  const user = useAuthStore((state) => state.user);

  const { data } = useQuery<UserInterface>({
    queryKey: ["NotificationBadge"],
    queryFn: async () =>
      fetch(`${import.meta.env.VITE_APP_API_URL}/api/user/${user}`).then(
        (res) => res.json()
      ),
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/appointment/list/${user}`
      );
      setAppointmentList(res.data);
    };
    fetch();
  }, [data]);

  const handleClick = () => {
    window.location.href = "/appointments";
  };

  return (
    <div>
      {/* {data?.role === "user" && ( */}
      <IconButton aria-label="notifications" onClick={handleClick}>
        <Badge
          badgeContent={
            appointmentList?.filter(
              (appointment) =>
                appointment.userMarkAsRead === false &&
                appointment.userNotification === true
            ).length || 0
          }
          sx={{ color: "white", cursor: "pointer" }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      {/* )} */}
    </div>
  );
}

export default NotificationBadge;
