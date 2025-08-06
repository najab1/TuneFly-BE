function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; 
}
const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; 
  };

  function formatYear(dateString) {
    const date = new Date(dateString);
    return date.getFullYear().toString(); 
  }

const getWeekNumber = (dateString) => {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000; 
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7); 
  };
  
  const formatWeek = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-W${getWeekNumber(dateString).toString().padStart(2, '0')}`; 
  };

  const groupBy = (data, formatter) => {
    return data.reduce((acc, entry) => {
      const formattedDate = formatter(entry.created_At);
      if (!acc[formattedDate]) {
        acc[formattedDate] = 0;
      }
      acc[formattedDate] += 1;
      return acc;
    }, {});
  };
module.exports={
    formatDate,
    formatMonth,
    formatYear,
    groupBy,
    formatWeek
}