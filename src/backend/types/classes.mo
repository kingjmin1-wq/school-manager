import Common "common";

module {
  public type Id = Common.Id;

  /// A class record as stored and returned by the API.
  public type Class = {
    id : Id;
    name : Text;
    /// Grade level, e.g. "Grade 7".
    gradeLevel : Text;
    /// Homeroom teacher, when one is assigned.
    homeroomTeacherId : ?Id;
    /// Maximum number of students allowed in the class.
    capacity : Nat;
    /// Number of students currently enrolled.
    enrolledCount : Nat;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  /// Payload for creating a class.
  public type ClassInput = {
    name : Text;
    gradeLevel : Text;
    homeroomTeacherId : ?Id;
    capacity : Nat;
  };

  /// Payload for updating a class. Absent fields are left unchanged.
  public type ClassUpdate = {
    name : ?Text;
    gradeLevel : ?Text;
    homeroomTeacherId : ?Id;
    capacity : ?Nat;
  };

  /// Filter accepted by the class list endpoint.
  public type ClassFilter = {
    /// Case-insensitive substring match on class name or grade level.
    search : ?Text;
    /// Restrict to classes whose homeroom teacher is this teacher.
    homeroomTeacherId : ?Id;
  };
};
