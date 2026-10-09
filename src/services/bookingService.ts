export const createBooking = async (booking) => ({
  ...booking,
  id: String(Date.now()),
});
export const getBookings = async () => [];
export const cancelBooking = async () => true;
