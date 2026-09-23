import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/teachers";
import Common "../types/common";
import TeachersLib "../lib/teachers";

mixin (
  accessControlState : AccessControl.AccessControlState,
  teachers : Map.Map<Common.Id, Types.Teacher>,
  activity : List.List<Common.ActivityEntry>,
  counters : {
    var nextTeacherId : Common.Id;
    var nextActivityId : Common.Id;
  },
) {
  func recordTeacherActivity(kind : Common.ActivityKind, message : Text, performedBy : Principal) : () {
    let id = counters.nextActivityId;
    counters.nextActivityId := id + 1;
    activity.add({ id; kind; message; performedBy; at = Time.now() });
  };

  /// List teachers, optionally filtered by search text.
  public query ({ caller }) func listTeachers(filter : Types.TeacherFilter) : async [Types.Teacher] {
    ignore AccessControl.getUserRole(accessControlState, caller);
    TeachersLib.listTeachers(teachers, filter);
  };

  /// Fetch a single teacher by id.
  public query ({ caller }) func getTeacher(id : Types.Id) : async ?Types.Teacher {
    ignore AccessControl.getUserRole(accessControlState, caller);
    TeachersLib.getTeacher(teachers, id);
  };

  /// Create a teacher. Admin only.
  public shared ({ caller }) func createTeacher(input : Types.TeacherInput) : async Types.Teacher {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create teachers");
    };
    let teacher = TeachersLib.createTeacher(teachers, counters, input);
    recordTeacherActivity(#teacherCreated, "បានបន្ថែមគ្រូ " # teacher.name, caller);
    teacher;
  };

  /// Update a teacher. Admin only.
  public shared ({ caller }) func updateTeacher(id : Types.Id, update : Types.TeacherUpdate) : async ?Types.Teacher {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update teachers");
    };
    switch (TeachersLib.updateTeacher(teachers, id, update)) {
      case null { null };
      case (?teacher) {
        recordTeacherActivity(#teacherUpdated, "បានកែប្រែព័ត៌មានគ្រូ " # teacher.name, caller);
        ?teacher;
      };
    };
  };

  /// Delete a teacher. Admin only.
  public shared ({ caller }) func deleteTeacher(id : Types.Id) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete teachers");
    };
    switch (TeachersLib.getTeacher(teachers, id)) {
      case null { false };
      case (?teacher) {
        ignore TeachersLib.deleteTeacher(teachers, id);
        recordTeacherActivity(#teacherDeleted, "បានលុបគ្រូ " # teacher.name, caller);
        true;
      };
    };
  };
};
