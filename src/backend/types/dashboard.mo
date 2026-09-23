import Common "common";

module {
  public type Id = Common.Id;
  public type ActivityEntry = Common.ActivityEntry;

  /// Number of students enrolled in a single class.
  public type ClassDistribution = {
    classId : Id;
    className : Text;
    studentCount : Nat;
  };

  /// Aggregate counts shown on the dashboard.
  public type DashboardStats = {
    studentCount : Nat;
    teacherCount : Nat;
    classCount : Nat;
    enrollmentCount : Nat;
    /// Students per class, one entry per class.
    studentsPerClass : [ClassDistribution];
  };
};
