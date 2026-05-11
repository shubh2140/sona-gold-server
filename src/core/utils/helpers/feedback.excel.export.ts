import { Workbook } from 'exceljs';
import Feedback from '../../../core/entities/feedback';

export default async function feedbackExcelExport(
  feedbacks: Feedback[],
): Promise<string> {
  const workBook = new Workbook();
  const creationDate = new Date();

  // Set properties
  workBook.creator = 'ABC';
  workBook.created = creationDate;
  workBook.modified = creationDate;

  // Add worksheet
  const workSheet = workBook.addWorksheet('Feedback sheet');

  // Add columns
  workSheet.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: 'Branch', key: 'branch', width: 50 },
    { header: 'Feedback', key: 'feedback', width: 50 },
    { header: 'Phone', key: 'phone', width: 30 },
    { header: 'Reason', key: 'reason', width: 100 },
  ];

  // Iterate over the Feedback array and add rows
  feedbacks.forEach((feedback) => {
    // Use Column key to identify field and insert the row.
    const feedbackIndexNumber = feedbacks.indexOf(feedback) + 1;
    workSheet.addRow({
      id: feedbackIndexNumber,
      branch: feedback.branchName,
      feedback: feedback.emoji,
      reason: feedback.reason,
      phone: feedback.mobileNumber,
    });
  });

  const fileName = `feedback-${creationDate.toISOString()}.xlsx`;
  // Save the excel in the following path.
  const fileSavePath = `./test/uploads/${fileName}`;
  await workBook.xlsx.writeFile(fileSavePath);

  return fileSavePath;
}
