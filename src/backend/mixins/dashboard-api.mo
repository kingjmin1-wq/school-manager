import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/dashboard";
import Common "../types/common";
import StudentTypes "../types/students";
import TeacherTypes "../types/teachers";
import ClassTypes "../types/classes";
import EnrollmentTypes "../types/enrollments";
import DashboardLib "../lib/dashboard";

mixin (
  accessControlState : AccessControl.AccessControlState,
  students : Map.Map<Common.Id, StudentTypes.Student>,
  teachers : Map.Map<Common.Id, TeacherTypes.Teacher>,
  classes : Map.Map<Common.Id, ClassTypes.Class>,
  enrollments : Map.Map<Common.Id, EnrollmentTypes.Enrollment>,
  activity : List.List<Common.ActivityEntry>,
) {
  /// Aggregate counts for the dashboard.
  public query ({ caller }) func getDashboardStats() : async Types.DashboardStats {
    ignore AccessControl.getUserRole(accessControlState, caller);
    DashboardLib.getStats(students, teachers, classes, enrollments);
  };

  /// Most recent activity entries, newest first.
  public query ({ caller }) func getRecentActivity(limit : Nat) : async [Types.ActivityEntry] {
    ignore AccessControl.getUserRole(accessControlState, caller);
    DashboardLib.getRecentActivity(activity, limit);
  };
};
