import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/enrollments";
import Common "../types/common";

module {
  public func listEnrollments(
    enrollments : Map.Map<Common.Id, Types.Enrollment>,
    filter : Types.EnrollmentFilter,
  ) : [Types.Enrollment] {
    let all = enrollments.values().toArray();
    all.filter(
      func(e) {
        let matchesStudent = switch (filter.studentId) {
          case null { true };
          case (?sid) { e.studentId == sid };
        };
        let matchesClass = switch (filter.classId) {
          case null { true };
          case (?cid) { e.classId == cid };
        };
        matchesStudent and matchesClass;
      }
    );
  };

  /// Create an enrollment. Traps when the student or class does not exist,
  /// when the student is already enrolled in the class, or when the class is
  /// at capacity.
  public func addEnrollment(
    enrollments : Map.Map<Common.Id, Types.Enrollment>,
    counters : { var nextEnrollmentId : Common.Id },
    input : Types.EnrollmentInput,
  ) : Types.Enrollment {
    let duplicate = enrollments.values().any(
      func(e) { e.studentId == input.studentId and e.classId == input.classId }
    );
    if (duplicate) {
      Runtime.trap("Student is already enrolled in this class");
    };
    let id = counters.nextEnrollmentId;
    counters.nextEnrollmentId := id + 1;
    let enrollment : Types.Enrollment = {
      id;
      studentId = input.studentId;
      classId = input.classId;
      enrolledAt = Time.now();
    };
    enrollments.add(id, enrollment);
    enrollment;
  };

  public func removeEnrollment(
    enrollments : Map.Map<Common.Id, Types.Enrollment>,
    id : Types.Id,
  ) : Bool {
    switch (enrollments.get(id)) {
      case null { false };
      case (?_) {
        enrollments.remove(id);
        true;
      };
    };
  };

  /// Remove every enrollment belonging to a student, returning the removed records.
  public func removeByStudent(
    enrollments : Map.Map<Common.Id, Types.Enrollment>,
    studentId : Common.Id,
  ) : [Types.Enrollment] {
    let removed = enrollments.values().toArray().filter(
      func(e) { e.studentId == studentId }
    );
    for (e in removed.values()) {
      enrollments.remove(e.id);
    };
    removed;
  };

  /// Remove every enrollment belonging to a class, returning the removed records.
  public func removeByClass(
    enrollments : Map.Map<Common.Id, Types.Enrollment>,
    classId : Common.Id,
  ) : [Types.Enrollment] {
    let removed = enrollments.values().toArray().filter(
      func(e) { e.classId == classId }
    );
    for (e in removed.values()) {
      enrollments.remove(e.id);
    };
    removed;
  };
};
