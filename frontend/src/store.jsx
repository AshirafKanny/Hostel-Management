import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import {
  studentListReducer,
  studentAddReducer,
  studentDetailsReducer,
  getStudentsByRoomNoReducer,
  studentUpdateReducer,
  studentDeleteReducer,
} from "./reducers/studentsReducer";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  attendanceDataEnterReducer,
  attendanceAnalysisReducer,
  deleteAttendanceReducer,
} from "./reducers/attendanceReducer";
import {
  bookingListReducer,
  bookingCreateReducer,
} from "./reducers/bookingReducer";
import {
  paymentListReducer,
  paymentCreateReducer,
} from "./reducers/paymentReducer";
import {
  notificationListReducer,
  notificationCreateReducer,
} from "./reducers/notificationReducer";

const reducer = combineReducers({
  studentsList: studentListReducer,
  studentDetails: studentDetailsReducer,
  studentAdd: studentAddReducer,
  studentUpdate: studentUpdateReducer,
  studentDelete: studentDeleteReducer,
  getStudentsByRoomNo: getStudentsByRoomNoReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  attendanceDataEnter: attendanceDataEnterReducer,
  attendanceAnalysis: attendanceAnalysisReducer,
  attendanceDelete: deleteAttendanceReducer,
  bookingList: bookingListReducer,
  bookingCreate: bookingCreateReducer,
  paymentList: paymentListReducer,
  paymentCreate: paymentCreateReducer,
  notificationList: notificationListReducer,
  notificationCreate: notificationCreateReducer,
});
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
