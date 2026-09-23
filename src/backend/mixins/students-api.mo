import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/students";
import Common "../types/common";
import ClassTypes "../types/classes";
import EnrollmentTypes "../types/enrollments";
import StudentsLib "../lib/students";
import EnrollmentsLib "../lib/enrollments";
import ClassesLib "../lib/classes";

mixin (
  accessControlState : AccessControl.AccessControlState,
  students : Map.Map<Common.Id, Types.Student>,
  classes : Map.Map<Common.Id, ClassTypes.Class>,
  enrollments : Map.Map<Common.Id, EnrollmentTypes.Enrollment>,
  activity : List.List<Common.ActivityEntry>,
  counters : {
    var nextStudentId : Common.Id;
    var nextEnrollmentId : Common.Id;
    var nextActivityId : Common.Id;
  },
) {
  func recordStudentActivity(kind : Common.ActivityKind, message : Text, performedBy : Principal) : () {
    let id = counters.nextActivityId;
    counters.nextActivityId := id + 1;
    activity.add({ id; kind; message; performedBy; at = Time.now() });
  };

  /// List students, optionally filtered by search text, class, or status.
  public query ({ caller }) func listStudents(filter : Types.StudentFilter) : async [Types.Student] {
    ignore AccessControl.getUserRole(accessControlState, caller);
    StudentsLib.listStudents(students, filter);
  };

  /// Fetch a single student by id.
  public query ({ caller }) func getStudent(id : Types.Id) : async ?Types.Student {
    ignore AccessControl.getUserRole(accessControlState, caller);
    StudentsLib.getStudent(students, id);
  };

  /// Create a student. Admin only.
  public shared ({ caller }) func createStudent(input : Types.StudentInput) : async Types.Student {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create students");
    };
    let student = StudentsLib.createStudent(students, counters, input);
    recordStudentActivity(#studentCreated, "បានបន្ថែមសិស្ស " # student.name, caller);
    student;
  };

  /// Update a student. Admin only.
  public shared ({ caller }) func updateStudent(id : Types.Id, update : Types.StudentUpdate) : async ?Types.Student {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update students");
    };
    switch (StudentsLib.updateStudent(students, id, update)) {
      case null { null };
      case (?student) {
        recordStudentActivity(#studentUpdated, "បានកែប្រែព័ត៌មានសិស្ស " # student.name, caller);
        ?student;
      };
    };
  };

  /// Delete a student. Admin only.
  public shared ({ caller }) func deleteStudent(id : Types.Id) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete students");
    };
    switch (StudentsLib.getStudent(students, id)) {
      case null { false };
      case (?student) {
        let removed = EnrollmentsLib.removeByStudent(enrollments, id);
        for (e in removed.values()) {
          ClassesLib.decrementEnrolled(classes, e.classId);
        };
        ignore StudentsLib.deleteStudent(students, id);
        recordStudentActivity(#studentDeleted, "បានលុបសិស្ស " # student.name, caller);
        true;
      };
    };
  };
};
