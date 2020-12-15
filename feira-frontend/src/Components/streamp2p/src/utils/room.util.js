export const sortByParticipants = ({ roomList }) => {
  const sortedRooms = roomList;
  sortedRooms.sort((a, b) => {
    if (a.participants.length > b.participants.length) return -1;
    if (a.participants.length < b.participants.length) return 1;
    return 0;
  });
  return sortedRooms;
}