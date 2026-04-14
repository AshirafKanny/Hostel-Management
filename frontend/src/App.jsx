import React from "react";
import HomeView from "./screens/homeView";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/header";
import Footer from "./components/footer";
import AddStudentView from "./screens/addStudentView";
import AnalysisView from "./screens/analysisView";
import LoginView from "./screens/Authentication Screens/LoginView";
import RegisterView from "./screens/Authentication Screens/RegisterView";
import StudentDetailsView from "./screens/studentDetailsView";
import AttendanceView from "./screens/attendanceView";
import ProfileView from "./screens/profileView";
import UserListView from "./screens/userListView";
import UserEditView from "./screens/userEditView";
import DashboardView from "./screens/dashboardView";
import RoomManagementView from "./screens/roomManagementView";
import FeeManagementView from "./screens/feeManagementView";
import AddFeeView from "./screens/addFeeView";
import ComplaintManagementView from "./screens/complaintManagementView";
import NoticeBoardView from "./screens/noticeBoardView";
import AddRoomView from "./screens/addRoomView";
import AddComplaintView from "./screens/addComplaintView";
import AddNoticeView from "./screens/addNoticeView";
import BookingManagementView from "./screens/bookingManagementView";
import PaymentManagementView from "./screens/paymentManagementView";
import NotificationManagementView from "./screens/notificationManagementView";
import ReportView from "./screens/reportView";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/dashboard" component={DashboardView} exact />
          <Route path="/rooms" component={RoomManagementView} exact />
          <Route path="/rooms/add" component={AddRoomView} exact />
          <Route path="/rooms/edit/:id" component={AddRoomView} exact />
          <Route path="/fees" component={FeeManagementView} exact />
          <Route path="/fees/add" component={AddFeeView} exact />
          <Route path="/complaints" component={ComplaintManagementView} exact />
          <Route path="/complaints/add" component={AddComplaintView} exact />
          <Route path="/notices" component={NoticeBoardView} exact />
          <Route path="/notices/add" component={AddNoticeView} exact />
          <Route path="/bookings" component={BookingManagementView} exact />
          <Route path="/payments" component={PaymentManagementView} exact />
          <Route path="/notifications" component={NotificationManagementView} exact />
          <Route path="/reports" component={ReportView} exact />
          <Route path="/user/:userId/edit" component={UserEditView} />
          <Route path="/userList" component={UserListView} />
          <Route path="/profile" component={ProfileView} />
          <Route path="/attendance" component={AttendanceView} />
          <Route path="/analysis" component={AnalysisView} />
          <Route path="/addStudent" component={AddStudentView} />
          <Route path="/student/edit/:id" component={AddStudentView} exact />
          <Route path="/student/:id" component={StudentDetailsView} exact />
          <Route path="/login" component={LoginView} exact />
          <Route path="/register" component={RegisterView} exact />
          <Route path="/search/:keyword" component={HomeView} exact />
          <Route path="/page/:pageNumber" component={HomeView} exact />
          <Route
            path="/search/:keyword/page/:pageNumber"
            component={HomeView}
            exact
          />
          <Route path="/" component={HomeView} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
