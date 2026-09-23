import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import IntValue "mo:caffeineai-oql/IntValue";
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Common "types/common";
import StudentTypes "types/students";
import TeacherTypes "types/teachers";
import ClassTypes "types/classes";
import EnrollmentTypes "types/enrollments";
import StudentsApi "mixins/students-api";
import TeachersApi "mixins/teachers-api";
import ClassesApi "mixins/classes-api";
import EnrollmentsApi "mixins/enrollments-api";
import DashboardApi "mixins/dashboard-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let students : Map.Map<Common.Id, StudentTypes.Student>;
  let teachers : Map.Map<Common.Id, TeacherTypes.Teacher>;
  let classes : Map.Map<Common.Id, ClassTypes.Class>;
  let enrollments : Map.Map<Common.Id, EnrollmentTypes.Enrollment>;
  let activity : List.List<Common.ActivityEntry>;
  let counters : {
    var nextStudentId : Common.Id;
    var nextTeacherId : Common.Id;
    var nextClassId : Common.Id;
    var nextEnrollmentId : Common.Id;
    var nextActivityId : Common.Id;
  };

  include StudentsApi(accessControlState, students, classes, enrollments, activity, counters);
  include TeachersApi(accessControlState, teachers, activity, counters);
  include ClassesApi(accessControlState, classes, students, enrollments, activity, counters);
  include EnrollmentsApi(accessControlState, enrollments, students, classes, activity, counters);
  include DashboardApi(accessControlState, students, teachers, classes, enrollments, activity);

  include ApiDocMixin();

  include Expose({
    entities = [
      students.toEntityManual("student", "Student", "id")
        .sample({
          id = 0;
          name = "";
          gender = #other;
          dateOfBirth = "";
          guardianName = "";
          guardianPhone = "";
          status = #active;
          classIds = [];
          createdAt = 0;
          updatedAt = 0;
        })
        .payload("id", func s = s.id)
        .payload("name", func s = s.name)
        .payload("gender", func s = switch (s.gender) {
          case (#male) "male";
          case (#female) "female";
          case (#other) "other";
        })
        .payload("dateOfBirth", func s = s.dateOfBirth)
        .payload("guardianName", func s = s.guardianName)
        .payload("guardianPhone", func s = s.guardianPhone)
        .payload("status", func s = switch (s.status) {
          case (#active) "active";
          case (#inactive) "inactive";
          case (#graduated) "graduated";
          case (#transferred) "transferred";
        })
        .payload("classIds", func s = s.classIds.map(func id = id.toText()).values().join(","))
        .payload("createdAt", func s = s.createdAt)
        .payload("updatedAt", func s = s.updatedAt)
        .controllerOnly()
        .build(),
      teachers.toEntity("teacher", "Teacher", "id")
        .sample({
          id = 0;
          name = "";
          email = "";
          phone = "";
          subject = "";
          createdAt = 0;
          updatedAt = 0;
        })
        .controllerOnly()
        .build(),
      classes.toEntityManual("class", "Class", "id")
        .sample({
          id = 0;
          name = "";
          gradeLevel = "";
          homeroomTeacherId = null;
          capacity = 0;
          enrolledCount = 0;
          createdAt = 0;
          updatedAt = 0;
        })
        .payload("id", func c = c.id)
        .payload("name", func c = c.name)
        .payload("gradeLevel", func c = c.gradeLevel)
        .payload("homeroomTeacherId", func c = switch (c.homeroomTeacherId) {
          case null 0;
          case (?id) id;
        })
        .payload("capacity", func c = c.capacity)
        .payload("enrolledCount", func c = c.enrolledCount)
        .payload("createdAt", func c = c.createdAt)
        .payload("updatedAt", func c = c.updatedAt)
        .controllerOnly()
        .build(),
      enrollments.toEntity("enrollment", "Enrollment", "id")
        .sample({
          id = 0;
          studentId = 0;
          classId = 0;
          enrolledAt = 0;
        })
        .controllerOnly()
        .build(),
    ];
  });
};
