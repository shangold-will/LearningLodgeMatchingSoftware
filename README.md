# Learning Lodge Matching Software
A matching software for students and tutors based on Google's App Script API. Much of the code references Google Sheets specific to the organization, like our tutor form and parent forms. Thus, some of the references to certain row and column numbers only apply to the documents I based my code off of. This was intended to not scale or be abstracted, mainly because our needs were very specific and likely won't change in the near future. However, much of the comparison algorithms in the code are simple and widely applicable.

# Description of Source Google Sheet
Because the google sheet includes private information of tutors and students, I can't include it in this repository. Below is a description of this sheet, in order to understand the code better.

In this sheet, there are three sections: a tutor section, a student section, and an output. Each one is titled, and consists of a certain number of data rows. Each row represents one tutor/student, with all representative information. When the program runs, the rows below/after the "Output" title is automatically filled with the matches, and the important info for each. Here is an array that represents all the info that is exported into the sheet:

["PARENT EMAIL", "TUTOR EMAIL", "STUDENT NAME", "STUDENT PRONOUNS", "STUDENT GRADE", "PARENT COMMENTS", "TUTOR NAME", "TUTOR PRONOUNS", "TUTOR YEAR", "TUTOR SCHOOL", "TUTOR MAJOR", "SESSION LENGTH", "SESSIONS PER WEEK", "AVAILABILITY","STUDENT START DATE", "TUTOR START DATE", "STUDENT TIME ZONE", "TUTOR TIME ZONE"]

# How does this data get into the sheet?
We are currentely working on linking the tutor and parent forms with this sheet that contains the software. These forms are also google sheets which are automatically populated when a parent or a tutor submits the google signup form from our website (learninglodge.org).

# Where does this data go?
The matches that output will go into another google sheet, which is set up to email the tutor and parent with all the relevant info. After this email, they are officially matched and can start tutoring!

