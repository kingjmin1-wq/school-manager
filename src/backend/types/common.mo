module {
  /// Unique identifier for a stored record.
  public type Id = Nat;

  /// Wall-clock timestamp in nanoseconds since the Unix epoch.
  public type Timestamp = Int;

  /// Gender of a student.
  public type Gender = {
    #male;
    #female;
    #other;
  };

  /// Lifecycle status of a student record.
  public type StudentStatus = {
    #active;
    #inactive;
    #graduated;
    #transferred;
  };

  /// Kind of mutation recorded in the activity feed.
  public type ActivityKind = {
    #studentCreated;
    #studentUpdated;
    #studentDeleted;
    #teacherCreated;
    #teacherUpdated;
    #teacherDeleted;
    #classCreated;
    #classUpdated;
    #classDeleted;
    #enrollmentAdded;
    #enrollmentRemoved;
  };

  /// A single entry in the recent-activity feed.
  public type ActivityEntry = {
    id : Id;
    kind : ActivityKind;
    /// Human-readable description of what happened.
    message : Text;
    /// Principal that performed the action.
    performedBy : Principal;
    at : Timestamp;
  };
};
