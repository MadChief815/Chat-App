export const getRoomID = (userID1, userID2) => {
    const sortedIDs = [userID1, userID2].sort();
    const roomID = sortedIDs.join('_');
    return roomID;
};

export const formatDate = date => {
    var day = date.getDate();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var month = monthNames[date.getMonth()];

    var formattedDate = day + ' ' + month;
    return formattedDate;
}