import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/dashboard";
import StudentTypes "../types/students";
import TeacherTypes "../types/teachers";
import ClassTypes "../types/classes";
import EnrollmentTypes "../types/enrollments";
import Common "../types/common";

module {
  public func getStats(
    students : Map.Map<Common.Id, StudentTypes.Student>,
    teachers : Map.Map<Common.Id, TeacherTypes.Teacher>,
    classes : Map.Map<Common.Id, ClassTypes.Class>,
    enrollments : Map.Map<Common.Id, EnrollmentTypes.Enrollment>,
  ) : Types.DashboardStats {
    let distributions = classes.values().toArray().map(
      func(c) {
        let count = enrollments.values().toArray().filter(
          func(e) { e.classId == c.id }
        ).size();
        { classId = c.id; className = c.name; studentCount = count };
      }
    );
    {
      studentCount = students.size();
      teacherCount = teachers.size();
      classCount = classes.size();
      enrollmentCount = enrollments.size();
      studentsPerClass = distributions;
    };
  };

  public func getRecentActivity(
    activity : List.List<Common.ActivityEntry>,
    limit : Nat,
  ) : [Common.ActivityEntry] {
    let all = activity.toArray();
    let newestFirst = all.reverse();
    if (newestFirst.size() <= limit) {
      newestFirst;
    } else {
      newestFirst.sliceToArray(0, limit);
    };
  };
};
