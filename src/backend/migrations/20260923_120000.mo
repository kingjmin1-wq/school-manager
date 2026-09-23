import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type Id = Nat;
  type Timestamp = Int;

  type Gender = { #male; #female; #other };

  type StudentStatus = { #active; #inactive; #graduated; #transferred };

  type Student = {
    id : Id;
    name : Text;
    gender : Gender;
    dateOfBirth : Text;
    guardianName : Text;
    guardianPhone : Text;
    status : StudentStatus;
    classIds : [Id];
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  type Teacher = {
    id : Id;
    name : Text;
    email : Text;
    phone : Text;
    subject : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  type Class = {
    id : Id;
    name : Text;
    gradeLevel : Text;
    homeroomTeacherId : ?Id;
    capacity : Nat;
    enrolledCount : Nat;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  type Enrollment = {
    id : Id;
    studentId : Id;
    classId : Id;
    enrolledAt : Timestamp;
  };

  type ActivityKind = {
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

  type ActivityEntry = {
    id : Id;
    kind : ActivityKind;
    message : Text;
    performedBy : Principal;
    at : Timestamp;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    students : Map.Map<Id, Student>;
    teachers : Map.Map<Id, Teacher>;
    classes : Map.Map<Id, Class>;
    enrollments : Map.Map<Id, Enrollment>;
    activity : List.List<ActivityEntry>;
    counters : { var nextStudentId : Id; var nextTeacherId : Id; var nextClassId : Id; var nextEnrollmentId : Id; var nextActivityId : Id };
  };

  public func migration(_old : {}) : NewActor {
    let students = Map.empty<Id, Student>();
    let teachers = Map.empty<Id, Teacher>();
    let classes = Map.empty<Id, Class>();
    let enrollments = Map.empty<Id, Enrollment>();
    let activity = List.empty<ActivityEntry>();
    let counters = {
      var nextStudentId = 1;
      var nextTeacherId = 1;
      var nextClassId = 1;
      var nextEnrollmentId = 1;
      var nextActivityId = 1;
    };

    // Seed sample data so the app is not empty on first load.
    let seedTime : Timestamp = 0;

    let teacher1 : Teacher = {
      id = 1;
      name = "សុខ ដារា";
      email = "dara.sok@example.edu";
      phone = "012345678";
      subject = "គណិតវិទ្យា";
      createdAt = seedTime;
      updatedAt = seedTime;
    };
    let teacher2 : Teacher = {
      id = 2;
      name = "ចាន់ សុភា";
      email = "sopha.chan@example.edu";
      phone = "098765432";
      subject = "ភាសាខ្មែរ";
      createdAt = seedTime;
      updatedAt = seedTime;
    };
    let teacher3 : Teacher = {
      id = 3;
      name = "លី វិសាល";
      email = "visal.ly@example.edu";
      phone = "011223344";
      subject = "រូបវិទ្យា";
      createdAt = seedTime;
      updatedAt = seedTime;
    };
    teachers.add(1, teacher1);
    teachers.add(2, teacher2);
    teachers.add(3, teacher3);
    counters.nextTeacherId := 4;

    let class1 : Class = {
      id = 1;
      name = "ថ្នាក់ ៧ក";
      gradeLevel = "ថ្នាក់ទី ៧";
      homeroomTeacherId = ?1;
      capacity = 40;
      enrolledCount = 2;
      createdAt = seedTime;
      updatedAt = seedTime;
    };
    let class2 : Class = {
      id = 2;
      name = "ថ្នាក់ ៨ខ";
      gradeLevel = "ថ្នាក់ទី ៨";
      homeroomTeacherId = ?2;
      capacity = 35;
      enrolledCount = 1;
      createdAt = seedTime;
      updatedAt = seedTime;
    };
    let class3 : Class = {
      id = 3;
      name = "ថ្នាក់ ៩គ";
      gradeLevel = "ថ្នាក់ទី ៩";
      homeroomTeacherId = ?3;
      capacity = 30;
      enrolledCount = 0;
      createdAt = seedTime;
      updatedAt = seedTime;
    };
    classes.add(1, class1);
    classes.add(2, class2);
    classes.add(3, class3);
    counters.nextClassId := 4;

    let student1 : Student = {
      id = 1;
      name = "កែវ សុវណ្ណ";
      gender = #female;
      dateOfBirth = "2012-03-14";
      guardianName = "កែវ សំណាង";
      guardianPhone = "012111222";
      status = #active;
      classIds = [1];
      createdAt = seedTime;
      updatedAt = seedTime;
    };
    let student2 : Student = {
      id = 2;
      name = "មាស រិទ្ធី";
      gender = #male;
      dateOfBirth = "2011-07-22";
      guardianName = "មាស ចន្ថា";
      guardianPhone = "092333444";
      status = #active;
      classIds = [1];
      createdAt = seedTime;
      updatedAt = seedTime;
    };
    let student3 : Student = {
      id = 3;
      name = "ហេង ស្រីនាង";
      gender = #female;
      dateOfBirth = "2010-11-05";
      guardianName = "ហេង ប៊ុន";
      guardianPhone = "077555666";
      status = #active;
      classIds = [2];
      createdAt = seedTime;
      updatedAt = seedTime;
    };
    let student4 : Student = {
      id = 4;
      name = "ព្រាប សុភាព";
      gender = #male;
      dateOfBirth = "2013-01-30";
      guardianName = "ព្រាប ណារី";
      guardianPhone = "096777888";
      status = #inactive;
      classIds = [];
      createdAt = seedTime;
      updatedAt = seedTime;
    };
    students.add(1, student1);
    students.add(2, student2);
    students.add(3, student3);
    students.add(4, student4);
    counters.nextStudentId := 5;

    let enrollment1 : Enrollment = { id = 1; studentId = 1; classId = 1; enrolledAt = seedTime };
    let enrollment2 : Enrollment = { id = 2; studentId = 2; classId = 1; enrolledAt = seedTime };
    let enrollment3 : Enrollment = { id = 3; studentId = 3; classId = 2; enrolledAt = seedTime };
    enrollments.add(1, enrollment1);
    enrollments.add(2, enrollment2);
    enrollments.add(3, enrollment3);
    counters.nextEnrollmentId := 4;

    {
      accessControlState = AccessControl.initState();
      students;
      teachers;
      classes;
      enrollments;
      activity;
      counters;
    };
  };
};
