import Common "common";

module {
  public type Id = Common.Id;

  /// A student-to-class enrollment.
  public type Enrollment = {
    id : Id;
    studentId : Id;
    classId : Id;
    enrolledAt : Common.Timestamp;
  };

  /// Payload for enrolling a student into a class.
  public type EnrollmentInput = {
    studentId : Id;
    classId : Id;
  };

  /// Filter accepted by the enrollment list endpoint.
  public type EnrollmentFilter = {
    studentId : ?Id;
    classId : ?Id;
  };
};
