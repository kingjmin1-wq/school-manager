import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/enrollments";
import Common "../types/common";
import EnrollmentsLib "../lib/enrollments";
import ClassesLib "../lib/classes";
import StudentTypes "../types/students";
import ClassTypes "../types/classes";

mixin (
  accessControlState : AccessControl.AccessControlState,
  enrollments : Map.Map<Common.Id, Types.Enrollment>,
  students : Map.Map<Common.Id, StudentTypes.Student>,
  classes : Map.Map<Common.Id, ClassTypes.Class>,
  activity : List.List<Common.ActivityEntry>,
  counters : {
    var nextEnrollmentId : Common.Id;
    var nextActivityId : Common.Id;
  },
) {
  func recordEnrollmentActivity(kind : Common.ActivityKind, message : Text, performedBy : Principal) : () {
    let id = counters.nextActivityId;
    counters.nextActivityId := id + 1;
    activity.add({ id; kind; message; performedBy; at = Time.now() });
  };

  /// List enrollments, optionally filtered by student or class.
  public query ({ caller }) func listEnrollments(filter : Types.EnrollmentFilter) : async [Types.Enrollment] {
    ignore AccessControl.getUserRole(accessControlState, caller);
    EnrollmentsLib.listEnrollments(enrollments, filter);
  };

  /// Enroll a student into a class. Admin only.
  public shared ({ caller }) func addEnrollment(input : Types.EnrollmentInput) : async Types.Enrollment {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add enrollments");
    };
    let student = switch (students.get(input.studentId)) {
      case null { Runtime.trap("Student not found") };
      case (?s) { s };
    };
    let cls = switch (classes.get(input.classId)) {
      case null { Runtime.trap("Class not found") };
      case (?c) { c };
    };
    if (cls.enrolledCount >= cls.capacity) {
      Runtime.trap("Class is at full capacity");
    };
    let enrollment = EnrollmentsLib.addEnrollment(enrollments, counters, input);
    students.add(
      student.id,
      { student with classIds = student.classIds.concat([input.classId]) },
    );
    ClassesLib.incrementEnrolled(classes, input.classId);
    recordEnrollmentActivity(
      #enrollmentAdded,
      "បានចុះឈ្មោះសិស្ស " # student.name # " ចូលថ្នាក់ " # cls.name,
      caller,
    );
    enrollment;
  };

  /// Remove an enrollment. Admin only.
  public shared ({ caller }) func removeEnrollment(id : Types.Id) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove enrollments");
    };
    switch (enrollments.get(id)) {
      case null { false };
      case (?enrollment) {
        ignore EnrollmentsLib.removeEnrollment(enrollments, id);
        switch (students.get(enrollment.studentId)) {
          case null {};
          case (?student) {
            students.add(
              student.id,
              {
                student with
                classIds = student.classIds.filter(func(cid) = cid != enrollment.classId);
              },
            );
          };
        };
        ClassesLib.decrementEnrolled(classes, enrollment.classId);
        recordEnrollmentActivity(
          #enrollmentRemoved,
          "បានដកសិស្សចេញពីថ្នាក់រៀន",
          caller,
        );
        true;
      };
    };
  };
};
