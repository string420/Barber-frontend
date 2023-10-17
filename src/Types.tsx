// export const variantsFramerMotion = {
//   visible: {
//     opacity: 2,
//     transform: "translateY(0)",
//   },
//   hidden: {
//     opacity: 0,
//     transform: "translateY(50px)",
//     transition: {
//       opacity: { duration: 1.3, ease: "easeInOut" },
//       transform: { duration: 0.5, ease: "easeInOut" },
//     },
//   },
// };

export const variantsFramerMotion = {
  visible: {
    opacity: 1,
    transform: "translateY(0)",
  },
  hidden: {
    opacity: 0,
    transform: "translateY(50px)",
  },
};

// reusable transition effect only of modal
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material";

export const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface RegistrationInterface {
  fullname: string;
  email: string;
  password: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface AppointmentInterface {
  _id: string;
  appointmentDate: string;
  appointmentTime: string;
  barberName: string;
  cutStyle: string;
  reason: string;
  email: string;
  contactNumber: string;
  barberRating: number;
  base64ImageUrl: string;
  createdAt: string;
}

export interface UserInterface {
  email: string;
  fullname: string;
  password: string;
  role: string;
}

export interface BarberInterface {
  _id: string;
  fullname: string;
  status: string;
  createdAt: string;
}

export interface CutInterface {
  _id: string;
  cutName: string;
  description: string;
  createdAt: string;
}

export interface AppointmentRatingInterface {
  _id: string;
  averageRating: number;
}
