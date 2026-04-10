function sortIsCompletedFirst(a, b) {
  if (a.isCompleted === b.isCompleted) {
    return 0; // same completion status, no change
  }
  return a.isCompleted ? -1 : 1; // if a is completed, move it after b
}
function sortDueDateNewestFirst(a, b) {
  return new Date(b.dueDate) - new Date(a.dueDate)
};
function sortDateThenCompleted(a, b) {
  // First: compare due dates (newest first)
  const dateDiff = new Date(b.dueDate) - new Date(a.dueDate);
  if (dateDiff !== 0) {
    return dateDiff; // if dates differ, sort by date
  }
  // If dates are the same, sort by isCompleted (true comes first)
  return a.isCompleted === b.isCompleted ? 0 : (a.isCompleted ? -1 : 1);
}