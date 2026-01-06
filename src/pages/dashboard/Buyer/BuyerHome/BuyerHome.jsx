import React from "react";

const BuyerHome = () => {
  return <div>Buyer-Home
States
Buyer will see his total task Count (task added by user),  pending Task( sum of all  required_workers count of his added Tasks), and total payment paid by the user. 
Task To Review
Buyer  will see all submissions for his added tasks  where the status is “pending” in a table format  with the following information
worker_name 
task_title 
payable_amount
View Submission Button( will open a modal  and show the submission detail)
Actionable Buttons
Approve Button
Reject Button
***  On Clicking the Approve Button 
increase payable amount coin for the workers
Change the SubmissionStatus to “approve” for specific submissions. 


***  On clicking the Reject Button, 
change the status to “rejected” of the specific submission. 
Increase required_workers by 1. 
</div>;
};

export default BuyerHome;
