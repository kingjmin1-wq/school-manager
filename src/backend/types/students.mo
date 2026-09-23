import Common "common";

module {
  public type Id = Common.Id;
  public type Gender = Common.Gender;
  public type StudentStatus = Common.StudentStatus;

  /// A student record as stored and returned by the API.
  public type Student = {
    id : Id;
    name : Text;
    gender : Gender;
    /// Date of birth as an ISO-8601 date string (YYYY-MM-DD).
    dateOfBirth : Text;
    guardianName : Text;
    guardianPhone : Text;
    status : StudentStatus;
    /// Classes the student is currently enrolled in.
    classIds : [Id];
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  /// Payload for creating a student.
  public type StudentInput = {
    name : Text;
    gender : Gender;
    dateOfBirth : Text;
    guardianName : Text;
    guardianPhone : Text;
    status : StudentStatus;
  };

  /// Payload for updating a student. Absent fields are left unchanged.
  public type StudentUpdate = {
    name : ?Text;
    gender : ?Gender;
    dateOfBirth : ?Text;
    guardianName : ?Text;
    guardianPhone : ?Text;
    status : ?StudentStatus;
  };

  /// Filter accepted by the student list endpoint.
  public type StudentFilter = {
    /// Case-insensitive substring match on the student name.
    search : ?Text;
    /// Restrict to students enrolled in this class.
    classId : ?Id;
    status : ?StudentStatus;
  };
};
