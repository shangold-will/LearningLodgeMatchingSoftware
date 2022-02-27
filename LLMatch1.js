/** INSTRUCTIONS:
 * 1. Go to "LLMatch.gs" file
 * 2. Edit the four variables at the top to match the data on the sheet
 * 3. Come back to the "runMatch.gs" file (this file)
 * 4. Press Run!!
 * 5. After a few seconds you should see in the Execution Log --> "Notice : Execution completed"
 * 5. This should output the matches at the end of the sheet (should be after the "OUTPUT" line)
 */


//GLOBAL VARIABLES (TODO: change these 4 to fit your needs)
let TUTOR_NUM = 10; //number of tutors
let STUDENT_NUM = 18; //number of students

let TUTOR_ID_ROW = 0; //NOTE: input (row number - 1)
let STUD_ID_ROW = 15; //NOTE: input (row number - 1)



/**
 * LAST UPDATED: 2/25/22 @ 17:30:00
 */






































let ELEM_ID_ROW = STUD_ID_ROW;
let MIDDLE_ID_ROW = 19; //ignore this
let OUTPUT_ID_ROW = 69; //ignore this

let STUD_TYPE = "elem"; //ignore this
//let tnum = SpreadsheetApp.getActiveSheet().getMaxRows(); //<-- this gets number of rows on sheet


/**
 * @return any[][] values : returns all values available on the sheet in a 2-D array
 */
function getData() { //returns all values on sheet
  let sheet = SpreadsheetApp.getActiveSheet();
  var values = sheet.getDataRange().getValues();
  //Logger.log(values);
  return values;
}

/**
 * @param int numPpl : input number of people (num of rows)
 * @param String personType : input type of person to get data of ("elem", "middle", or "tutor")
 * @return any[] returnValues : 2-D array of all data values of the person type
 */
function getSectionData(personType) {
  let numPpl = 0;
  let startCol = 0; //starting column
  let endCol = 0; //ending column

  var row = 0; //current row

  if (personType == "tutor") { //specify the num of data values, based on person type
    row = TUTOR_ID_ROW + 1;
    endCol = 43;
    numPpl = TUTOR_NUM;
  } else if (personType == "middle") {
    row = MIDDLE_ID_ROW + 1;
    endCol = 39;
    numPpl = STUDENT_NUM;
  } else if (personType == "elem") {
    row = ELEM_ID_ROW + 1;
    endCol = 39;
    numPpl = STUDENT_NUM;
  } else {
    return undefined;
  }
  
  var rowIndex = 0; //starting row for 2-D array
  var values = getData(); //grab all data valies
  var returnValues = new Array(numPpl);
  for (let j = 0; j < returnValues.length; j++) { //initialize 2-d array
    returnValues[j] = new Array(endCol-startCol+1);
  }
  
  while (numPpl >= 1) { //for each row
  
    for (let i = 0; i < (endCol - startCol+1); i++) { //assign values...
      returnValues[rowIndex][i] = values[row][i];
    }
    rowIndex++;
    row++;
    numPpl--;
  }
  //if (personType=="middle") Logger.log("HERE");
  //Logger.log(returnValues);
  return returnValues;
}
//TEST: 
//Logger.log(getSectionData(5, "elem"));
//Logger.log(getSectionData("tutor"))

/**
 * @param any[] tutor : input tutor data value array
 * @param any[] student : input student data value array
 * @param -----String studentType : input the type of student ("elem" or "middle")-----taken out!
 * @return boolean isMatch : returns if the tutor/student pair matches availability
 */
function availabilityMatch(tutor, student) {
  let range = 7; //number of columns to parse over
  let startCol = 9; //starting column
  let isMatch = false; //return value
  let numMatches = 0; //number of time slot matches
  let matchArray = [false, ["MONDAY: ((", " )) TUESDAY: ((", ")) WEDNESDAY: ((", " )) THURSDAY: ((", ")) FRIDAY: ((", ")) SATURDAY: ((", ")) SUNDAY: (("]];

  let dayArray = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  for (let i = startCol; i < (startCol+range); i++) { //parse through each day's availability
    if (student[i] && tutor[i]) {
      if (tutor[i+8].includes("8 am - 12 pm") && student[i].includes("8 am - 12 pm")) numMatches++; matchArray[1][i-9] = matchArray[1][i-9] + "8 am - 12 pm, ";
      if (tutor[i+8].includes("12 pm - 4 pm") && student[i].includes("12 pm - 4 pm")) numMatches++; matchArray[1][i-9] = matchArray[1][i-9] + "12 pm - 4 pm, ";
      if (tutor[i+8].includes("4 pm - 8 pm") && student[i].includes("4 pm - 8 pm")) numMatches++; matchArray[1][i-9] = matchArray[1][i-9] + "4 pm - 8 pm, ";
      //Logger.log("TUTOR TIME: " + tutor[i+8]);
      //Logger.log("STUDENT TIME: " + student[i]);
    }
  }

  if (numMatches >= 2) { //if certain number of time blocks match (**can change number later**), then return true
    isMatch = true;
    //Logger.log("MATCHES: " + numMatches);
  }
  matchArray[0] = isMatch;

  return matchArray;

}
//TEST: 
//Logger.log(availabilityMatch(getSectionData(5, "tutor")[2], getSectionData(5, "elem")[3]));


/**
 * @param any[] tutor : input tutor data value array
 * @param any[] student : input student data value array
 * @return any[][] studSubs : returns 2-D array [do they match boolean, [matching subjects], [non-matching subjects]]
 */
function subjectMatch(tutor, student) {
  var studCol = 7; //column of subjects for students
  var tutorStartCol = 12; //start column of subjects for tutors
  var tutorColRange = 5; //number of subjects for tutor
  var tutorSubs = ["Math", "Science", "Social Studies", "English/Reading", "Foreign Language"]; //subjects the tutor is willing to teach
  const prefValue = 2; //preference rankings > than this num will not be included in tutor subjects (can be altered)

  for (let i = 0; i < tutorColRange; i++) { //parse through tutor subjects, remove non-prefered subjects
    if (tutor[tutorStartCol+i] > prefValue) {
      tutorSubs[i] = ""; 
      tutorSubs.splice(i, 1);
    }
  }
  var studSubs = new Array(3);
  studSubs[0] = false; //is there a match
  for (let h = 1; h < studSubs.length; h++) { //initialize return array (match bool, matching subs, non-matching subs)
    studSubs[h] = new Array();
  }
  for (let j = 0; j < tutorSubs.length; j++) {
    if (student[7].includes(tutorSubs[j])) { //if match, add to match array
      studSubs[1].push(tutorSubs[j]);
      studSubs[0] = true; //there is a match!
    } else { //if no match, add to non-match array
      studSubs[2].push(tutorSubs[j]);
    }
  }
  return studSubs;
}
//TEST: 
//Logger.log(subjectMatch(getSectionData(5, "tutor")[2], getSectionData(5, "elem")[3]));

/**
 * @param int tutorNum : input number of tutors you want to compare (auto starts from row 0)
 * @param int studentNum : input number of students you want to compare (auto starts from row 0)
 * @param String studType : input student type ("elem" or "middle")
 */
function matchTutorStud() {
  let tutors = getSectionData("tutor"); //grab 2-D array of tutors
  let students = getSectionData(STUD_TYPE); //grab 2-D array of students
  let matchArray = new Array() //return array
  matchArray[0] = ["PARENT EMAIL", "TUTOR EMAIL", "STUDENT NAME", "STUDENT PRONOUNS", "STUDENT GRADE", "PARENT COMMENTS", "TUTOR NAME", "TUTOR PRONOUNS", "TUTOR YEAR", "TUTOR SCHOOL", "TUTOR MAJOR", "SESSION LENGTH", "SESSIONS PER WEEK", "AVAILABILITY","STUDENT START DATE", "TUTOR START DATE", "STUDENT TIME ZONE", "TUTOR TIME ZONE"]
  let tutorName = ""; let studName = ""; let studGrade = ""; let studEmail = ""; let studStartDate = ""; let tutorEmail = ""; let tutorPronouns = ""; 
  let studPronouns = ""; let tutorYear = ""; let tutorSchool = ""; let tutorMajor = ""; let sessionLength = ""; let numSessions = ""; let tutorStartDate = "";
  let tutorTimeZone = ""; let studTimeZone = ""; let studComments = "";

  for (let i = 0; i < TUTOR_NUM; i++) { //cycle through each tutor
    tutorName = tutors[i][0];
    tutorPronouns = tutors[i][10];
    tutorEmail = tutors[i][1];
    tutorYear = tutors[i][4];
    tutorSchool = tutors[i][42];
    tutorMajor = tutors[i][5];
    tutorStartDate = tutors[i][7] + "";
    tutorTimeZone = tutors[i][9];
    for (let j = 0; j < STUDENT_NUM; j++) { //cycle through each student
      if (availabilityMatch(tutors[i], students[j])[0] && subjectMatch(tutors[i], students[j])[0]) { //if its a match!!
        //return tutor/stud name, tutor email, start date
        studName = students[j][5];
        studGrade = students[j][6];
        studEmail = students[j][2];
        studStartDate = students[j][16] + "";
        studPronouns = students[j][20];
        sessionLength = students[j][19];
        numSessions = students[j][18];
        studTimeZone = students[j][21];
        studComments = null ? "none" : students[j][38];
        studComments = "NEED FORM" ? students[j][39] : students[j][38];
        
        matchArray.push([studEmail, tutorEmail, studName, studPronouns, studGrade, studComments, tutorName, tutorPronouns, tutorYear, tutorSchool, tutorMajor, sessionLength, numSessions, availabilityMatch(tutors[i], students[j])[1] + "", studStartDate, tutorStartDate, studTimeZone, tutorTimeZone]); //add to array

      }
    }
  }
  return matchArray;
}
//TEST: 
//Logger.log(matchTutorStud());

/**
 * @return values : returns all matches based on student-first sorting (only allows one student to be paired, rather than one tutor)
 */
function firstMatch() {
  let values = matchTutorStud(TUTOR_NUM, STUDENT_NUM, STUD_TYPE);
  let studNames = new Array(); //names of students already matched
  let tutorNames = new Array(); //names of tutors already matched
  let returnValues = new Array();
  // for (let i = 0; i < values.length; i++) { 
  //   if (studNames.includes(values[i][2])) { //if student name is already matched, delete all indices
  //     //Logger.log(values[i][0]);
  //     values[i] = [null];
  //   } else {
  //     studNames.push(values[i][2]); //add name 
  //   }
  // }
  for (let i = 0; i < values.length; i++) { 
    if (!tutorNames.includes(values[i][6]) && !studNames.includes(values[i][2])) { //if tutor/student names aren't already matched, add to return array
      studNames.push(values[i][2]); //add student name 
      tutorNames.push(values[i][6]); //add tutor name 
      returnValues.push(values[i]); //add to return array
    }
  }
  //Logger.log("TUTORS: " + tutorNames);
  //Logger.log("STUDENTS" + studNames);
  return returnValues;
} 

function printMatches() {
  let values = firstMatch();
  //let values = matchTutorStud(TUTOR_NUM, STUDENT_NUM, STUD_TYPE);
  for (let i = 0; i < values.length; i++) {
    if (values[i][2] != null) Logger.log(values[i]);
  }
}
//TEST: 
//printMatches();


/** FUTURE FUNCTIONS TO IMPLEMENT: 
 * bestMatch() : maximizes amount of matches by parsing through the matchArray
 * firstMatch(): matches based on who matched first --DONE--
 */


function outputData() {
  let values = firstMatch();
  //let values = bestMatch();
  //let values = matchTutorStud(TUTOR_NUM, STUDENT_NUM, STUD_TYPE);
  let i = 0;
  while (i < values.length) {
    if (values[i] != null) {
      //Logger.log(values[i]);
      SpreadsheetApp.getActiveSheet().appendRow(values[i]);
    }
    i++;
  }
}
//TEST: 
//outputData();






/**
 * NOTE: still a work in progress
 * @return returnValues : returns all matches based on maximizing the number of matches 
 */
function bestMatch() {
  let values = matchTutorStud(TUTOR_NUM, STUDENT_NUM, STUD_TYPE);
  let studNames = new Array(); //names of students already matched
  let tutorNames = new Array(); //names of tutors already matched
  let returnValues = new Array();
  let studNames2 = new Array(); tutorNames2 = new Array(); returnValues2 = new Array();
  let studNames3 = new Array(); tutorNames3 = new Array(); returnValues3 = new Array();
  let finalReturnValues = new Array();

  for (let i = 0; i < values.length; i++) { //first match
    if (!tutorNames.includes(values[i][6]) && !studNames.includes(values[i][2])) { //if tutor/student names aren't already matched, add to return array
      studNames.push(values[i][2]); //add student name 
      tutorNames.push(values[i][6]); //add tutor name 
      returnValues.push(values[i]); //add to return array
    }
  }

  for (let i = 0; i < values.length; i++) { //second match
    if (tutorNames.includes(values[i][6]) && studNames.includes(values[i][2])) { //if tutor/student names aren't already matched, add to return array
      if (!tutorNames2.includes(values[i][6]) && !studNames2.includes(values[i][2])) {
          studNames2.push(values[i][2]); //add student name 
          tutorNames2.push(values[i][6]); //add tutor name 
          returnValues2.push(values[i]); //add to return array
      }
    }
  }

  for (let i = 0; i < values.length; i++) { //third match
    if (tutorNames.includes(values[i][6]) && studNames.includes(values[i][2])) {
      if (tutorNames2.includes(values[i][6]) && studNames2.includes(values[i][2])) { //if tutor/student names aren't already matched, add to return array
        if (!tutorNames3.includes(values[i][6]) && !studNames3.includes(values[i][2])) {
            studNames3.push(values[i][2]); //add student name 
            tutorNames3.push(values[i][6]); //add tutor name 
            returnValues3.push(values[i]); //add to return array
        }
      }
    }
  }

  for (let i = 0; i < returnValues.length; i++) {//compare return values
    if (!returnValues2.includes(returnValues[i])) { //if there's only one possible match
      finalReturnValues.push(returnValues[i]);
    } 

    if (i < returnValues2.length) { //if there's only two possible matches
      if (!returnValues3.includes(returnValues2[i])) {
        finalReturnValues.push(returnValues2[i]);
      }
    } else {
      finalReturnValues.push("-1");
    }
  }



  
  Logger.log(studNames3);
  Logger.log(studNames);
  //Logger.log("TUTORS: " + tutorNames);
  //Logger.log("STUDENTS" + studNames);
  return returnValues3;


//   let values = matchTutorStud(TUTOR_NUM, STUDENT_NUM, STUD_TYPE);
//   let tutNamesFreq = new Array(2); tutNamesFreq[0] = []; tutNamesFreq[1] = []; //initialize 2-D Array of names, and number of matches per name
//   let returnArray = [[]];

//   for (let j = 0; j < values.length-1; j++) { //fill array
//     if (tutNamesFreq[0].includes(values[j+1][0])) { //if it includes tutor name
//       //let index = namesFreq.
//       let index = tutNamesFreq[0].indexOf(""+values[j+1][0]);
//       tutNamesFreq[1][index]++;
//       if (tutNamesFreq[1][index] > 1) tutNamesFreq[0].splice(index+1, 1);
//     } else {
//       tutNamesFreq[0].push(values[j+1][0]);
//       tutNamesFreq[1].push(1);
//     }
//   }

//   //first: take away and match all tutors with only one match

//   for (let i = 0; i < tutNamesFreq[0].length; i++) {
//     if (tutNamesFreq[1][i] == 1) {
        
//     }
//   }

//   Logger.log(tutNamesFreq);
//   return tutNamesFreq;

}



















