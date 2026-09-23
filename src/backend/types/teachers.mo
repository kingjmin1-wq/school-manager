import Common "common";

module {
  public type Id = Common.Id;

  /// A teacher record as stored and returned by the API.
  public type Teacher = {
    id : Id;
    name : Text;
    email : Text;
    phone : Text;
    /// Subject taught, e.g. "Mathematics".
    subject : Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  /// Payload for creating a teacher.
  public type TeacherInput = {
    name : Text;
    email : Text;
    phone : Text;
    subject : Text;
  };

  /// Payload for updating a teacher. Absent fields are left unchanged.
  public type TeacherUpdate = {
    name : ?Text;
    email : ?Text;
    phone : ?Text;
    subject : ?Text;
  };

  /// Filter accepted by the teacher list endpoint.
  public type TeacherFilter = {
    /// Case-insensitive substring match on name or subject.
    search : ?Text;
  };
};
