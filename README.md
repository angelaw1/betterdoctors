# betterdoctors

API used: BetterDoctor https://betterdoctor.com/partners/<br>
Main library used: jquery<br>
This is a web application that allows users to browse through a preconfigured or filtered (by specialty) list of doctors.<br>
Upon selecting a doctor, more information on the doctor, along with a list of similar doctors, is provided.<br>
The "similarity" is determined by the doctors' specialties and practices.<br>
The similar doctors are sorted using 'best match' algoritm provided by the betterdoctors API<br>
<br>
Assumptions made:<br>
assumes user wants doctors located at 37.773,-122.413<br>
<br>
Hours spent thus far: 4<br>
<br>
Future Improvements: <br>
Performance: I believe the over-usage of jquery is the reason for the poor performance.<br>
&nbsp;&nbsp;Due to poor performance, need to wait a little bit before selecting a doctor for similar doctors list to be rendered<br>
Give users the option to select on similar doctors.<br>
&nbsp;&nbsp;Add another modal popup when users select similar doctors<br>
Visuals: Add background image, change the look of buttons and drop down menu, add more animations and visual appeal<br>
Remove location assumption by asking users for their location<br>
<br>
Screenshots:<br>
![alt text](screenshots/onload.png)<br>
When the page is loaded<br>
<br>
![alt text](screenshots/filtered.png)<br>
When user filters by specific specialty<br>
<br>
![alt text](screenshots/modal.png)<br>
When user selects doctor<br>
<br>
![alt text](screenshots/similar-doctors.png)<br>
List of similar doctors in modal<br>
