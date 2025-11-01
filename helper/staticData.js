export const cancellationPolicy = [
  {
    id: 1,
    title: "Initial Payment",
    description: "A non-refundable initial payment of £5 is required to confirm the reservation.",
    amount: 5,
    refundable: false,
  },
  {
    id: 2,
    title: "Cancellation Window",
    description: "Reservations can be cancelled within 24 hours of booking.",
    refundable: true,
    refundAmount: 5,
    condition: "Cancellation within 24 hours",
  },
  {
    id: 3,
    title: "Late Cancellation",
    description: "Cancellations made after 24 hours will not be eligible for a refund.",
    refundable: false,
    refundAmount: 0,
    condition: "Cancellation after 24 hours",
  },
];


export      const dropdownOptions = {
        dietaryRestrictionByUser: ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'None'],
        dietaryRestrictionByParty: ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'None'],
        occasions: ['Birthday', 'Anniversary', 'Business Meeting', 'Other'],
      };
