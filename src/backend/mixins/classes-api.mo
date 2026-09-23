import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/classes";
import Common "../types/common";
import ClassesLib "../lib/classes";
import EnrollmentsLib "../lib/enrollments";
import StudentTypes "../types/students";
import EnrollmentTypes "../types/enrollments";

mixin (
  accessControlState : AccessControl.AccessControlState,
  classes : Map.Map<Common.Id, Types.Class>,
  students : Map.Map<Common.Id, StudentTypes.Student>,
  enrollments : Map.Map<Common.Id, EnrollmentTypes.Enrollment>,
  activity : List.List<Common.ActivityEntry>,
  counters : {
    var nextClassId : Common.Id;
    var nextActivityId : Common.Id;
  },
) {
  func recordClassActivity(kind : Common.ActivityKind, message : Text, performedBy : Principal) : () {
    let id = counters.nextActivityId;
    counters.nextActivityId := id + 1;
    activity.add({ id; kind; message; performedBy; at = Time.now() });
  };

  /// List classes, optionally filtered by search text or homeroom teacher.
  public query ({ caller }) func listClasses(filter : Types.ClassFilter) : async [Types.Class] {
    ignore AccessControl.getUserRole(accessControlState, caller);
    ClassesLib.listClasses(classes, filter);
  };

  /// Fetch a single class by id.
  public query ({ caller }) func getClass(id : Types.Id) : async ?Types.Class {
    ignore AccessControl.getUserRole(accessControlState, caller);
    ClassesLib.getClass(classes, id);
  };

  /// Create a class. Admin only.
  public shared ({ caller }) func createClass(input : Types.ClassInput) : async Types.Class {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create classes");
    };
    let cls = ClassesLib.createClass(classes, counters, input);
    recordClassActivity(#classCreated, "បានបង្កើតថ្នាក់រៀន " # cls.name, caller);
    cls;
  };

  /// Update a class, including homeroom teacher and capacity. Admin only.
  public shared ({ caller }) func updateClass(id : Types.Id, update : Types.ClassUpdate) : async ?Types.Class {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update classes");
    };
    switch (ClassesLib.updateClass(classes, id, update)) {
      case null { null };
      case (?cls) {
        recordClassActivity(#classUpdated, "បានកែប្រែថ្នាក់រៀន " # cls.name, caller);
        ?cls;
      };
    };
  };

  /// Delete a class. Admin only.
  public shared ({ caller }) func deleteClass(id : Types.Id) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete classes");
    };
    switch (ClassesLib.getClass(classes, id)) {
      case null { false };
      case (?cls) {
        let removed = EnrollmentsLib.removeByClass(enrollments, id);
        for (e in removed.values()) {
          switch (students.get(e.studentId)) {
            case null {};
            case (?student) {
              students.add(
                student.id,
                { student with classIds = student.classIds.filter(func(cid) = cid != id) },
              );
            };
          };
        };
        ignore ClassesLib.deleteClass(classes, id);
        recordClassActivity(#classDeleted, "បានលុបថ្នាក់រៀន " # cls.name, caller);
        true;
      };
    };
  };
};
